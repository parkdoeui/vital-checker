import User from '../models/user.js'

export const getUserInfo = async (req, res) => {

  const { userId } = req.params;

  try {
    const filter = { userID: userId };
    const user = await User.find(filter);
    if (!user) {
      console.log('user not found');
      return;
    }
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
  }
}
