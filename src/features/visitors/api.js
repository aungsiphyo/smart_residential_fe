import API from "../../services/axios";

export async function fetchVisitors(params = {}) {
  const res = await API.get(`/visitors`, { params });
  return res.data;
}

export async function registerVisitor(payload) {
  const res = await API.post(`/visitors/register`, payload);
  return res.data;
}

export async function assignVisitorRfid(id, rfid_uid) {
  const res = await API.patch(`/visitors/${id}/rfid`, { rfid_uid });
  return res.data;
}

export async function getVisitor(id) {
  const res = await API.get(`/visitors/${id}`);
  return res.data;
}
