import mongoose from 'mongoose';

const { Schema } = mongoose;
const userSchema = Schema({
  userID: String,
  chtUUID: String,
  serviceUUID: String,
});

const User = mongoose.model('User', userSchema);

export default User;
