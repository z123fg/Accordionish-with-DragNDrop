import React, { FC, ReactElement, useEffect, useRef, useState } from "react";
import classes from "./ExpandIcon.module.css";

interface Props{
    expanded?:boolean;
    icon?:ReactElement
}

const ExpandIcon:FC<Props> = (props) => {
    const [expanded, setExpanded] = useState<any>(false);
  const [rippless, setRippless] = useState<any>([]);
  const countRef = useRef(0);
  useEffect(()=>{console.log(props.expanded);setExpanded(props.expanded)},[props.expanded])
  const clickHandler = (e:any) => {
    /* setExpanded((prev:any) => !prev); */
    const key = countRef.current++;
    const {
      left,
      bottom,
      width,
      height,
    } = e.currentTarget.getBoundingClientRect();
    const coord = { y: bottom - e.clientY, x: e.clientX - left };
    setRippless((prev:any) => [
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

  const transitionEndHandler = (e:any) => {
    console.log(e);
    setRippless((prev:any) =>
      prev.filter((item:any) => {
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
}

export default ExpandIcon;
