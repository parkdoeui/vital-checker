class storage {
  constructor(serviceUUID, chtUUID, userID) {
    this.vitalLog = [];
    this.history = [];
    this.serviceUUID = serviceUUID || null;
    this.chtUUID = chtUUID || null;
    this.userID = userID || null;

  }

  updateHistory(data) {
    const historyData = {
      ...data,
      vitalLog: [...this.vitalLog],
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

  addHistory(data) {
    if (data.length > 0) {
      this.history = data.map(d => d.history);
    }
  }
}

export default storage;

