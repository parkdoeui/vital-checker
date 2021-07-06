import UserVital from '../models/userVitals.js'


export const getVitals = async (req, res) => {
  try {
    const userVital = await UserVital.find();

    res.status(200).json(userVital);
    console.log();
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
}

export const createVitals = async (req, res) => {
  const newVitals = new UserVital({ chtUUID: 'test', serviceUUID: 'test', history: [1, 2, 3], vitalLog: [1, 2, 3] })
  try {
    await newVitals.save();
    res.status(201).json(newVitals);
  } catch (err) {
    res.status(409).json({ message: error.message });
  }
}
