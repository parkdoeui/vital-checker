export const checkVitalAnomalies = (vitalSnapshot) => {
  const HR_MAX = 140;
  const HR_MIN = 39;
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
  return { formattedTime: time, rawTime: elapsedTime };

};

export const getCharacteristicUUID = () => {
  return prompt('Type characteristics UUID');
};

export const getServiceUUID = () => {
  return prompt('Type service UUID');
};

export const formatDate = (date) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  return `${months[month]} ${day}, ${year}`;
};

export const getAverage = (data) => (data.reduce((acc, val) => { return acc + val; }, 0) / data.length).toFixed(1);

export const getSummary = (data) => {
  const spo2 = data.map(({ spo2 }) => spo2).filter((val) => val > 0);
  const heartRate = data
    .map(({ heartRate }) => heartRate)
    .filter((val) => val > 0);
  const filteredSpo2 = spo2.filter((val) => val < 90);
  const filteredHR = heartRate.filter((val) => val < 50);
  console.log('Min spo2:', Math.min(...spo2));
  console.log('Min HR:', Math.min(...heartRate));
  console.log('Max HR:', Math.max(...heartRate));
  console.log(`SP02 below 90%: ${(filteredSpo2.length / spo2.length) * 100}%`);
  console.log(
    `HR below 50bpm: ${(filteredHR.length / heartRate.length) * 100}%`,
  );
};
