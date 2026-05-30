import api from "../../services/axios";

export const getRooms = async () => {
  const response = await api.get("/rooms");
  return response.data;
};