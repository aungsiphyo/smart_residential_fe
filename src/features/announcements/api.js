import API from "../../services/axios";

export async function fetchAnnouncements(params = {}) {
  const res = await API.get(`/announcements`, { params });
  return res.data;
}

export async function createAnnouncement(payload) {
  const res = await API.post(`/announcements`, payload);
  return res.data;
}

export default {
  fetchAnnouncements,
  createAnnouncement,
};
