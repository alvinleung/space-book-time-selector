import React from "react";
import Button from "../form/Button";
import { get12HourString } from "../timeline/time";
import "./TimeSelectStatusBar.css";

const TimeSelectStatusBar = ({ timeFrom, timeTo }) => {
  return (
    <div className="time-select-status">
      <div className="time-select-status__text h4">
        I am using the room <strong>{get12HourString(timeFrom)}</strong> to{" "}
        <strong>{get12HourString(timeTo)}</strong>
      </div>
      <Button>Next</Button>
    </div>
  );
};

export default TimeSelectStatusBar;
