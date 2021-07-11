class storage {
  constructor(serviceUUID, chtUUID, userID) {
    this.vitalLog = [];
    this.vitalHistory = [];
    this.serviceUUID = serviceUUID || null;
    this.chtUUID = chtUUID || null;
    this.userID = userID || null;

  }

  updateHistory(data) {
    const historyData = {
      ...data,
      vitalLog: [...this.vitalLog],
    };
    this.vitalHistory.push(historyData);
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
    console.log("data", data)
    if (data.length > 0) {
      this.vitalHistory = data.map(d => d.vitalHistory);
    }
  }
}

export default storage;

