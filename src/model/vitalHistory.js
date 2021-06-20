class vitalHistory {
  constructor(userID, serviceUUID, chtUUID) {
    this.userID = userID;
    this.storage = [];
    this.serviceUUID = serviceUUID || null;
    this.chtUUID = chtUUID || null;
  }

  add(data) {
    this.storage.push(data);
  }

  getStorage() {
    return this.storage;
  }
  addUUIDs(serviceUUID, chtUUID) {
    this.serviceUUID = serviceUUID;
    this.chtUUID = chtUUID;
  }
}

export default vitalHistory
