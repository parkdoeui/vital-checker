import UserVital from '../models/userVital.js'

export const getVitals = async (req, res) => {
  const { userId } = req.params;
  try {
    const filter = { userID: userId };
    const userVital = await UserVital.find(filter);
    res.status(200).json(userVital);
    console.log();
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
}

export const postVital = async (req, res) => {

  const history = req.body;
  const { userId } = req.params;

  try {
    const newVital = new UserVital({ userID: userId, history });
    newVital.save();
    res.status(200).json(newVital);
  } catch (err) {
    res.status(404);
    console.log(err);
  }
}
