import API from "../../services/axios";

export const fetchParking = () => API.get("/parking");
export const patchParkingDelta = (type, delta) =>
  API.patch(`/parking/${type}/delta`, { delta });
export const patchParkingReset = (type) =>
  API.patch(`/parking/${type}/reset`);
