import mongoose from 'mongoose';

const { Schema } = mongoose;
const userVitalSchema = Schema({
  userID: String,
  vitalHistory: {
    date: String,
    runTime: String,
    vitalLog: Array,
  },
});

var UserVital = mongoose.model('UserVital', userVitalSchema);

export default UserVital;
