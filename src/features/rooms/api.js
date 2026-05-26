export const getRooms = async () => {
  const res = await fetch("http://localhost:5000/api/rooms");
  return res.json();
};