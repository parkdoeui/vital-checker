import axios from 'axios';

const PORT = 5000;
const url = `http://localhost:${PORT}/vitals`;

export const getSavedVitals = async () => {
  const res = await axios.get(url);
  return res.data;
};

