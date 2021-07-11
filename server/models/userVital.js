import mongoose from 'mongoose';

const { Schema } = mongoose;
const userVitalSchema = Schema({
  userID: String,
  history: {
    date: String,
    runTime: String,
    vitalLog: Array,
  },
});

var UserVital = mongoose.model('UserVital', userVitalSchema);

export default UserVital;
