import axios from 'axios';

const PORT = 5000;
const URL = `http://localhost:${PORT}/user`;

//TODO: get userinfo to fill out UUIDs
export const getUserInfo = async (userId) => {
  const res = await axios.get(`${URL}/${userId}`);
  return res.data;
};
