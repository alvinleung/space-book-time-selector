import React, { useState } from "react";
import TopBar from "../topBar/TopBar";
import TimeSelectStatusBar from "../timeSelectStatusBar";
import Timeline from "../timeline/Timeline";
import TimelineScroll from "../timeline/TimelineScroll";

const TimeSelectPage = ({ path }) => {
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
      {path === "/" && (
        <Timeline
          beginHour={8}
          endHour={20}
          onChange={handleTimeSelectionChange}
        />
      )}
      {path === "/scroll" && (
        <TimelineScroll
          beginHour={8}
          endHour={20}
          onChange={handleTimeSelectionChange}
        />
      )}
      <TimeSelectStatusBar timeFrom={selectedFrom} timeTo={selectedTo} />
    </div>
  );
};

export default TimeSelectPage;
