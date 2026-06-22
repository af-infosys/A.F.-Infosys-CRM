import apiPath from "../../isProduction";

const BASE_URL = `${await apiPath()}/api`;

export const fetchMeetings = async () => {
  const res = await fetch(`${BASE_URL}/yaadi`);
  return res.json();
};

export const fetchMeetingById = async (id) => {
  const res = await fetch(`${BASE_URL}/yaadi/${id}`);
  return res.json();
};

export const createMeeting = async (data) => {
  const res = await fetch(`${BASE_URL}/yaadi`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const updateMeeting = async (data) => {
  const res = await fetch(`${BASE_URL}/yaadi`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteMeeting = async (id) => {
  const res = await fetch(`${BASE_URL}/yaadi`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  return res.json();
};
