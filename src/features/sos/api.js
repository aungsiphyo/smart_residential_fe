import API from "../../services/axios";

export async function getSosAlerts(params = {}) {
  const res = await API.get("/sos", { params });
  return res.data;
}

export async function createSosAlert(payload) {
  const res = await API.post("/sos", payload);
  return res.data;
}

export async function updateSosAlert(id, payload) {
  const res = await API.put(`/sos/${id}`, payload);
  return res.data;
}
