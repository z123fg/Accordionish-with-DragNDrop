import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import classes from "./AcdCollapse.module.css";


function useWindowSize() {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
}

const AcdCollapse = (props) => {
  const size = useWindowSize();
  const [enterState, setEnterState] = useState("exited");
  const containerRef = useRef(null);
  const heightRef = useRef(null);
  const {
    collapseHeight = 0,
    timeout = 300,
    onEntering = () => {},
    onEntered = () => {},
    onExiting = () => {},
    onExited = () => {},
  } = props;

  useEffect(() => {
    if(enterState!=='exited'){
      heightRef.current = containerRef.current.clientHeight + 'px'
    }
  }, [size])



  const inHanlder = () => {
    if (props.in && enterState !== "entered") {
      setEnterState("entering");
      heightRef.current = containerRef.current
        ? containerRef.current.clientHeight + "px"
        : "auto";
      onEntering();
    } else if (!props.in && enterState !== "exited") {
      setEnterState( "exiting"); 
      heightRef.current = `${collapseHeight}px`;
      
      
      onExiting();
    }
  };
  useEffect(() => {
    inHanlder();
  }, [props.in, inHanlder]);

  const transitionEndHandler = () => {
    if (enterState === "entering") {
      setEnterState("entered");
      onEntered();
    } else if (enterState === "exiting") {
      setEnterState("exited");
      onExited();
    }
  };
  return (
    <div
    
      onClick={props.onClick}
      className={classes.AcdCollapse_root}
      style={{
        height: heightRef.current ? heightRef.current : `${collapseHeight}px`,
        transition: `height ${timeout}ms cubic-bezier(0.4, 0, 0.2, 1) 0ms`,
      }}
      onTransitionEnd={transitionEndHandler}
    >
      <div ref={containerRef}>{props.children}</div>
    </div>
  );
};

export default AcdCollapse;
