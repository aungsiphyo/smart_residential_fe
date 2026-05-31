import api from "../../services/axios";

export const getHelpers = async () => {
  const response = await api.get("/helpers");
  return response.data;
};

export const createHelper = async (helperData) => {
  const response = await api.post("/helpers", helperData);
  return response.data;
};

export const updateHelper = async (id, helperData) => {
  const response = await api.put(`/helpers/${id}`, helperData);
  return response.data;
};

export const deleteHelper = async (id) => {
  const response = await api.delete(`/helpers/${id}`);
  return response.data;
};

export const getHelperRequests = async () => {
  const response = await api.get("/helper-requests");
  return response.data;
};

export const createHelperRequest = async (requestData) => {
  const response = await api.post("/helper-requests", requestData);
  return response.data;
};

export const updateHelperRequest = async (id, requestData) => {
  const response = await api.put(`/helper-requests/${id}`, requestData);
  return response.data;
};

