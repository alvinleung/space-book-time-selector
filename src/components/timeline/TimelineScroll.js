import React, { useState } from "react";
import { motion } from "framer-motion";
import "./TimelineScroll.css";
import TimelineSelector from "./TimelineSelector";
import TimelineSelectorScroll from "./TimelineSelectorScroll";

const Timeline = ({
  hourBegin = 8,
  hourEnd = 20,
  selectedBegin = 8,
  selectedEnd = 9,
  onChange = (startTime, endTime) => {},
}) => {
  // calculate how much hours are there
  const timeList = buildTimeList(hourBegin, hourEnd, true);

  const changeHandler = (startTime, endTime) => {};

  return (
    <div className="timeline">
      <div className="timeline__layer-selector">
        {/* <TimelineSelector
          hourBegin={hourBegin}
          hourEnd={hourEnd}
          onChange={onChange}
        /> */}
        <TimelineSelectorScroll
          hourBegin={hourBegin}
          hourEnd={hourEnd}
          onChange={changeHandler}
        />
      </div>
      <div className="timeline__layer-time">
        {timeList.map((timeText) => (
          <div className="timeline__time-interval">
            <div className="timeline__hour label">{timeText}</div>
            <div className="timeline__seperator"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

function buildTimeList(hourBegin, hourEnd, twelveHoursForm) {
  const timeList = [];
  const availableHours = hourEnd - hourBegin;
  for (let i = 0; i < availableHours; i++) {
    const currentHour = i + hourBegin;
    if (twelveHoursForm) {
      if (currentHour > 12) timeList.push([`${currentHour - 12} pm`]);
      else if (currentHour === 12) timeList.push([`12 pm`]);
      else timeList.push([`${currentHour} am`]);
    } else {
      timeList.push([`${currentHour}`]);
    }
  }
  return timeList;
}

//https://stackoverflow.com/questions/8888491/how-do-you-display-javascript-datetime-in-12-hour-am-pm-format
function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
}

export default Timeline;
