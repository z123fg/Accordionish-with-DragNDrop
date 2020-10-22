import React, { ReactElement, useEffect, useRef, useState } from "react";
import classes from "./ExpandIcon.module.css";

const ExpandIcon = (props) => {
  const [expanded, setExpanded] = useState(false);
  const [rippless, setRippless] = useState([]);
  const countRef = useRef(0);
  useEffect(()=>{setExpanded(props.expanded)},[props.expanded])
  const clickHandler = (e) => {
    setExpanded((prev) => !prev);
    const key = countRef.current++;
    const {
      left,
      bottom,
      width,
      height,
    } = e.currentTarget.getBoundingClientRect();
    const coord = { y: bottom - e.clientY, x: e.clientX - left };
    console.log(coord);
    setRippless((prev) => [
      ...prev,
      <div
        key={key}
        className={classes.ripple}
        style={{
          left: coord.x - width / 2 + "px",
          bottom: coord.y - height / 2 + "px",
        }}
        onAnimationEnd={() => transitionEndHandler(key)}
      ></div>,
    ]);
  };

  const transitionEndHandler = (e) => {
    console.log(e);
    setRippless((prev) =>
      prev.filter((item) => {
        return item.key != e;
      })
    );
  };

  return (
    <div
      className={classes.IconContainer}
      style={{ padding: 0, overflow: "hidden" }}
      onClick={(e) => clickHandler(e)}
    >
      <div
        style={{ position: "initial" }}
        className={
          expanded
            ? [classes.IconContainer, classes.expanded].join(" ")
            : classes.IconContainer
        }
      >
        <span className={classes.InnerContainer}>
          {props.icon}
        </span>
      </div>
      <span className={classes.rippleContainer}>{rippless}</span>
    </div>
  );
};

export default ExpandIcon;
