import API from "../../services/axios";

export async function fetchReports(params = {}) {
  const res = await API.get(`/reports`, { params });
  return res.data;
}

export async function createReport(payload) {
  const res = await API.post(`/reports`, payload);
  return res.data;
}

export async function updateReport(id, payload) {
  const res = await API.put(`/reports/${id}`, payload);
  return res.data;
}
