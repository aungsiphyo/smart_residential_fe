import { io } from "socket.io-client";
import useAuthStore from "../features/auth/authStore";

export const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  import.meta.env.VITE_API_BASE_URL?.replace(/\/api\/?$/, "") ||
  "https://54.87.203.253.sslip.io";

const socketCleanups = new WeakMap();

const getAccessToken = () =>
  localStorage.getItem("accessToken") || useAuthStore.getState().accessToken;

/**
 * Create a Socket.IO client that authenticates every connection attempt with
 * the latest access token. This also covers reconnects after a token refresh.
 */
export function createAuthenticatedSocket(options = {}) {
  const extraAuth =
    options.auth && typeof options.auth === "object" ? options.auth : {};
  const socketOptions = { ...options };
  delete socketOptions.auth;

  const buildAuth = () => ({
    ...extraAuth,
    token: getAccessToken(),
  });

  const socket = io(SOCKET_URL, {
    ...socketOptions,
    autoConnect: false,
    // Use a plain object so the token is included directly in the namespace
    // CONNECT packet. Some browser/client combinations did not invoke the
    // callback form before the server authentication middleware ran.
    auth: buildAuth(),
  });

  const syncAuth = () => {
    socket.auth = buildAuth();
  };

  // Socket.IO reuses the Socket instance during transport reconnects, so make
  // sure a refreshed access token replaces the token from the first connect.
  socket.io.on("reconnect_attempt", syncAuth);

  const unsubscribe = useAuthStore.subscribe((state, previousState) => {
    if (state.accessToken === previousState.accessToken) return;

    syncAuth();

    if (!state.accessToken) {
      socket.disconnect();
      return;
    }

    // An authentication failure is not automatically retried by Socket.IO.
    // The HTTP refresh flow updates the store, so retry immediately here.
    if (!socket.connected) socket.connect();
  });

  socketCleanups.set(socket, () => {
    unsubscribe();
    socket.io.off("reconnect_attempt", syncAuth);
  });

  if (getAccessToken()) {
    syncAuth();
    socket.connect();
  }

  return socket;
}

export function disconnectAuthenticatedSocket(socket) {
  if (!socket) return;

  socketCleanups.get(socket)?.();
  socketCleanups.delete(socket);
  socket.removeAllListeners();
  socket.disconnect();
}
