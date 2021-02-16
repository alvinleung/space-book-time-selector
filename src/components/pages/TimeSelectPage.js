import React, { useState } from "react";
import TopBar from "../topBar/TopBar";
import TimeSelectStatusBar from "../timeSelectStatusBar";
import Timeline from "../timeline/Timeline";

const TimeSelectPage = () => {
  // time select page here

  const [selectedFrom, setSelectedFrom] = useState();
  const [selectedTo, setSelectedTo] = useState();
  const handleTimeSelectionChange = (startTime, endTime) => {
    setSelectedFrom(startTime);
    setSelectedTo(endTime);
  };

  return (
    <div>
      <TopBar />
      <Timeline
        beginHour={8}
        endHour={20}
        onChange={handleTimeSelectionChange}
      />
      <TimeSelectStatusBar timeFrom={selectedFrom} timeTo={selectedTo} />
    </div>
  );
};

export default TimeSelectPage;
