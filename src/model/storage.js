class storage {
  constructor(serviceUUID, chtUUID) {
    this.vitalLog = [];
    this.history = [];
    this.serviceUUID = serviceUUID || null;
    this.chtUUID = chtUUID || null;

  }

  updateHistory(data) {
    const historyData = {
      ...data,
      vitalLog: this.vitalLog,
    };
    this.history.push(historyData);
    this.vitalLog.length = 0;
  }

  updateLog(data) {
    this.vitalLog.push(data);
  }

  addUUIDs(serviceUUID, chtUUID) {
    this.serviceUUID = serviceUUID;
    this.chtUUID = chtUUID;
  }
}

export default storage;
