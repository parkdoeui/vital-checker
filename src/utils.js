export const checkVitalAnomalies = (vitalSnapshot) => {
  const HR_MAX = 140;
  const HR_MIN = 40;
  const SPO2_MIN = 80;
  const testRange = [...vitalSnapshot];
  const lastVital = testRange.pop();

  const test1 = testRange.every(({ heartRate, spo2 }) =>
    heartRate === lastVital.heartRate &&
        spo2 === lastVital.spo2);

  const test2 = testRange.some(({ heartRate, spo2 }) => (heartRate > 0 && spo2 > 0) && (heartRate > HR_MAX || heartRate < HR_MIN || spo2 < SPO2_MIN));

  return test1 || test2;
};

export const getTime = (startTime) => {
  const endTime = new Date();
  const elapsedTime = endTime - startTime;
  const s = parseInt(elapsedTime / 1000) % 60;
  const m = parseInt(elapsedTime / 60000) % 60;
  const h = parseInt(elapsedTime / 3600000) % 24;

  const prefix = '0';
  const time = `${h < 10 ? prefix + h : h}:${m < 10 ? prefix + m : m}:${s < 10 ? prefix + s : s}`;
  return time;

};
