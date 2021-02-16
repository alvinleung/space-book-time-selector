import React, { useCallback, useRef, useEffect, useState } from "react";
import {
  createTime,
  createTimeFromHour,
  subTime,
  addTime,
  get12HourString,
  toHour,
} from "./time";
import {
  motion,
  useAnimation,
  useMotionValue,
  useTransform,
} from "framer-motion";

import "./TimelineSelector.css";

const TimelineSelector = ({
  initialFrom = createTime(8, 0),
  initialTo = createTime(9, 0),
  hourBegin = 8,
  hourEnd = 20,
  precisionMinute = 30, // 15minsutes
  maxHour = 2,
  minHour = 0.5,
  onChange = (startTime, endTime) => {},
}) => {
  const [currentFrom, setCurrentFrom] = useState(initialFrom);
  const [currentDuration, setCurrentDuration] = useState(
    subTime(initialTo, initialFrom)
  );

  // measure the height
  const containerRef = useRef();
  const [isDragging, setIsDragging] = useState(false);
  const controls = useAnimation();

  const selectY = useMotionValue(0);
  const selectHeight = useMotionValue(0);
  const [initialSelectHeight, setInitialSelectHeight] = useState(0);

  const [containerHeight, setContainerHeight] = useState();
  const [containerTop, setContainerTop] = useState();
  useEffect(() => {
    const containerRect = containerRef.current.getBoundingClientRect();
    setContainerHeight(containerRect.height + window.scrollY);
    setContainerTop(containerRect.top);
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

    return diffHour * hourHeight;
  }, [currentFrom, currentDuration, containerHeight]);

  // for firing call back
  useEffect(() => {
    onChange(currentFrom, addTime(currentFrom, currentDuration));
  }, [currentDuration, currentFrom]);

  // correcting precision when drag stop
  const snapToNearestPrecision = (beginPos) => {
    const precisionUnitHeight = calculatePrecisionUnitHeight();
    const targetPos = getNearestPecision(
      beginPos - containerTop,
      precisionUnitHeight,
      false
    );
    // correct to nearest position
    controls.start({
      y: targetPos,
    });
    selectY.set(targetPos);

    // calculate the hour
    const timeInHour = targetPos / precisionUnitHeight;
    const newFromTime = createTimeFromHour(
      timeInHour / 2 + toHour(initialFrom)
    );
    setCurrentFrom(newFromTime);

    return targetPos;
  };

  const onSelectorDragBegin = (e, info) => {
    setIsDragging(true);
  };
  const onSelectorDragEnd = (e, info) => {
    setIsDragging(false);
    const halfSelectBoxheight = Math.round(calculateSelectedHeight() / 2);
    snapToNearestPrecision(info.point.y - halfSelectBoxheight);
  };

  const onSelectorDrag = (e, info) => {
    const SCROLL_THRESHOLD = 150;
    const SCROLL_SPEED = 3;
    const halfSelectBoxheight = Math.round(calculateSelectedHeight() / 2);
    const currentPos = info.point.y - halfSelectBoxheight;
    // during the selector dragging
    if (window.innerHeight - currentPos < SCROLL_THRESHOLD) {
      // scroll down
      window.scrollTo(0, window.scrollY + SCROLL_SPEED);
      return;
    }

    if (currentPos < SCROLL_THRESHOLD) {
      // scroll up
      window.scrollTo(0, window.scrollY - SCROLL_SPEED);
      return;
    }
  };

  //
  //
  //

  const onHandleDragStart = (e, info) => {
    setInitialSelectHeight(selectHeight.get());
  };

  const onHandleDrag = (e, info) => {
    // attempt to scroll

    // update the selector size
    const diffTime = currentDuration;
    const selectedDuration = toHour(diffTime);

    const precisionUnitHeight = calculatePrecisionUnitHeight() * 2;
    const offsetY = info.offset.y + initialSelectHeight; // - selectHeight.get(); //- calculateSelectedHeight();
    const offsetUnit = offsetY / precisionUnitHeight;

    const resultDurationHour = getNearestPrecisionValue(
      offsetUnit,
      precisionMinute / 60,
      "down"
    );

    // max cap
    if (resultDurationHour > maxHour) {
      setCurrentDuration(createTimeFromHour(maxHour));
      return;
    }
    if (resultDurationHour < minHour) {
      setCurrentDuration(createTimeFromHour(minHour));
      return;
    }
    setCurrentDuration(createTimeFromHour(resultDurationHour));
  };

  const onHandleDragEnd = (e, info) => {
    // snap back to the height of the box
  };

  selectHeight.set(calculateSelectedHeight());
  const handlePosition = useTransform(
    [selectHeight, selectY],
    ([selectHeight, selectY]) => selectHeight + selectY
  );

  return (
    <div ref={containerRef} className="timeline-selector-container">
      <motion.div
        drag="y"
        onDrag={onSelectorDrag}
        onDragStart={onSelectorDragBegin}
        onDragEnd={onSelectorDragEnd}
        dragConstraints={containerRef}
        animate={controls}
        className="timeline-selector h4"
        style={{
          height: selectHeight,
          boxShadow: isDragging
            ? "0px 5px 15px rgba(0, 0, 0, 0.1)"
            : "0px 0px 0px rgba(0, 0, 0, 0.0)",
        }}
        dragMomentum={false}
      >
        {get12HourString(currentFrom)} -
        {get12HourString(addTime(currentFrom, currentDuration))} (
        {toHour(currentDuration)} hour)
      </motion.div>
      <motion.div
        className="timeline-selector__handle"
        drag="y"
        dragMomentum={false}
        animate={{ opacity: isDragging ? 0 : 1, transition: { duration: 0.1 } }}
        style={{ y: handlePosition }}
        onDrag={onHandleDrag}
        onDragStart={onHandleDragStart}
      />
    </div>
  );
};

function getNearestPrecisionValue(val, unitSize, rounding) {
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

function getNearestPecision(relativePositionY, unitSize, rounding) {
  if (!rounding || rounding === "auto") {
    const nearestPositionCell = Math.round(relativePositionY / unitSize);
    return nearestPositionCell * unitSize;
  }
  if (rounding === "up") {
    const nearestPositionCell = Math.ceil(relativePositionY / unitSize);
    return nearestPositionCell * unitSize;
  }
  if (rounding === "down") {
    const nearestPositionCell = Math.floor(relativePositionY / unitSize);
    return nearestPositionCell * unitSize;
  }
}

export default TimelineSelector;
