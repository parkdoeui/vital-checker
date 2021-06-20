class vitalHistory {
  constructor(userID) {
    this.userID = userID;
    this.storage = [];
  }

  add(data) {
    this.storage.push(data);
  }

  get() {
    return this.storage;
  }
}

export default vitalHistory
