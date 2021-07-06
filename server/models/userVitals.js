import mongoose from 'mongoose';

const { Schema } = mongoose;
const userVitalSchema = Schema({
  chtUUID: String,
  serviceUUID: String,
  history: [Schema.Types.Mixed],
  vitalLog: [Schema.Types.Mixed],
});

var UserVital = mongoose.model('UserVital', userVitalSchema);

export default UserVital;
