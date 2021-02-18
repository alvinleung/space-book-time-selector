import React, { useState, useEffect, useRef, useCallback } from "react";
import { useMotionValue, motion, useAnimation } from "framer-motion";
import {
  createTime,
  subTime,
  toHour,
  addTime,
  get12HourString,
  createTimeFromHour,
} from "./time";

import "./TimelineSelectorScroll.css";

const TimelineSelectorScroll = ({
  initialFrom = createTime(8, 0),
  initialTo = createTime(9, 0),
  hourBegin = 8,
  hourEnd = 20,
  precisionMinute = 30, // 15minsutes
  maxHour = 2,
  minHour = 0.5,
  onChange = (startTime, endTime) => {},
}) => {
  const selectorHeight = useMotionValue();
  const controls = useAnimation();

  const [currentFrom, setCurrentFrom] = useState(initialFrom);
  const [currentDuration, setCurrentDuration] = useState(
    subTime(initialTo, initialFrom)
  );
  // measure the height
  const containerRef = useRef();
  const [containerHeight, setContainerHeight] = useState();
  const [containerTop, setContainerTop] = useState();

  useEffect(() => {
    const containerRect = containerRef.current.getBoundingClientRect();
    setContainerHeight(containerRect.height);
    setContainerTop(containerRect.top + window.scrollY);
  }, []);

  const numberOfHour = hourEnd - hourBegin;

  // calculate the hour height
  const calculateHourHeight = useCallback(() => {
    return containerHeight / numberOfHour;
  }, [containerHeight]);

  const calculatePrecisionUnitHeight = useCallback(() => {
    const precisionUnitHeight = (precisionMinute / 60) * calculateHourHeight();
    return precisionUnitHeight;
  }, [calculateHourHeight()]);

  // calculate the height of the user selected
  const calculateSelectedHeight = useCallback(() => {
    const hourHeight = calculateHourHeight();
    const diffTime = currentDuration;
    const diffHour = toHour(diffTime);

    console.log(diffHour * hourHeight);

    return diffHour * hourHeight;
  }, [currentFrom, currentDuration, containerHeight]);

  const onHandleDrag = (e, info) => {
    // set height
    const HANDLE_OFFSET = 50;
    const precisionUnitHeight = calculatePrecisionUnitHeight() * 2;
    const offsetUnit =
      (info.point.y - HANDLE_OFFSET - window.scrollY) / precisionUnitHeight;
    const resultDurationHour = getNearestPrecision(
      offsetUnit,
      precisionMinute / 60,
      "down"
    );
    // selectorHeight.set(precisionCorrectedY - HANDLE_OFFSET);
    setCurrentDuration(createTimeFromHour(resultDurationHour));
  };

  const onHandleDragEnd = () => {
    // controls.start({
    //   height: selectorHeight.get(),
    // });
    // selectorHeight.set(10);
    // setCurrentFrom(createTime(13, 0));
    // setCurrentDuration(createTime(1, 0));
  };

  // for firing call back
  useEffect(() => {
    onChange(currentFrom, addTime(currentFrom, currentDuration));
  }, [currentDuration, currentFrom]);

  // set number by scrolling
  useEffect(() => {
    let timer;
    let preventFire = false;
    const handleWindowScroll = () => {
      if (preventFire) {
        setTimeout(() => (preventFire = false), 200);
        return;
      }
      // handle window scroll
      const precisionUnitHeight = calculatePrecisionUnitHeight() * 2;
      const offsetUnit =
        (document.body.scrollTop + containerTop) / precisionUnitHeight;
      const resultDurationHour = getNearestPrecision(
        offsetUnit,
        precisionMinute / 60,
        "down"
      );
      // console.log(resultDurationHour);
      setCurrentFrom(
        addTime(initialFrom, createTimeFromHour(resultDurationHour - 0.5))
      );

      // for snapping
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        preventFire = true;
        document.body.scrollTo({
          top: precisionUnitHeight * (resultDurationHour - 0.5),
          behavior: "smooth",
        });
      }, 100);
    };
    document.body.addEventListener("scroll", handleWindowScroll);

    return () => {
      document.body.removeEventListener("scroll", handleWindowScroll);
    };
  }, [containerTop]);

  selectorHeight.set(calculateSelectedHeight());
  // console.log(selectorHeight.get());

  return (
    <div ref={containerRef} className="timeline-selector-scroll-container">
      <motion.div
        className="timeline-selector-scroll h4"
        style={{ height: selectorHeight }}
        // aniamte={controls}
      >
        {get12HourString(currentFrom)} -
        {get12HourString(addTime(currentFrom, currentDuration))} (
        {toHour(currentDuration)} hour)
      </motion.div>
      <motion.div
        // layout
        className="timeline-selector-scroll__handle"
        drag="y"
        dragMomentum={false}
        onDrag={onHandleDrag}
        onDragEnd={onHandleDragEnd}
        style={{ y: 100 }}
        aniamte={{ y: selectorHeight.get() }}
      />
    </div>
  );
};

function getNearestPrecision(val, unitSize, rounding) {
  if (!rounding || rounding === "auto") {
    const nearestPositionCell = Math.round(val / unitSize);
    return nearestPositionCell * unitSize;
  }
  if (rounding === "up") {
    const nearestPositionCell = Math.ceil(val / unitSize);
    return nearestPositionCell * unitSize;
  }
  if (rounding === "down") {
    const nearestPositionCell = Math.floor(val / unitSize);
    return nearestPositionCell * unitSize;
  }
}

export default TimelineSelectorScroll;
