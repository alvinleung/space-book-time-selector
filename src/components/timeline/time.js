const createTime = (hour, min) => {
  return { hour: hour, minute: min };
};

const createTimeFromMinute = (min) => {
  const hours = min / 60;
  if (hours >= 1) {
    return { hour: hours, minute: min % 60 };
  } else {
    return { hour: 0, minute: min };
  }
};
const createTimeFromHour = (hour) => {
  return { hour: Math.floor(hour), minute: (hour % 1) * 60 };
};

const subTime = (time1, time2) => {
  let newHour = time1.hour - time2.hour;
  let newMinute = time1.minute - time2.minute;

  if (newMinute < 0) {
    newHour -= 1;
    newMinute = 60 - newMinute;
  }
  return { hour: newHour, minute: newMinute };
};

const addTime = (time1, time2) => {
  let newHour = time1.hour + time2.hour;
  let newMinute = time1.minute + time2.minute;

  if (newMinute >= 60) {
    newHour += 1;
    newMinute = newMinute - 60;
  }
  return { hour: newHour, minute: newMinute };
};

const toHour = (time) => time.hour + time.minute / 60;

const get12HourString = (time) => {
  if (!time) return;

  let resultHour = time.hour;
  let resultMinute = time.minute;
  let ampm = "";
  if (time.hour > 12) {
    resultHour = time.hour - 12;
    ampm = "pm";
  } else if (time.hour === 12) {
    resultHour = 12;
    ampm = "pm";
  } else {
    ampm = "am";
  }

  resultMinute = resultMinute > 9 ? `${resultMinute}` : `0${resultMinute}`;

  return `${resultHour}:${resultMinute} ${ampm}`;
};

export {
  createTime,
  createTimeFromMinute,
  subTime,
  addTime,
  toHour,
  createTimeFromHour,
  get12HourString,
};
