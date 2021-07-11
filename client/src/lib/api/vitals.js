import axios from 'axios';

const PORT = 5000;
const URL = `http://localhost:${PORT}/vitals`;

export const getVitals = async (userId) => {
  const res = await axios.get(`${URL}/${userId}`);
  return res.data;
};

export const postVital = (history, userId) => axios.post(`${URL}/${userId}/post`, history);
