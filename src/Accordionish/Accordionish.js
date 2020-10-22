import React, {  useState } from "react";
import classes from "./Accordionish.module.css";
//import Collapse from '@material-ui/core/Collapse';
import AcdCollapse from  '../transition-component/AcdCollapse';




const Accordionish = React.forwardRef(({ children, style ,onClick,onDragStart},ref) => {
  const [expanded, setExpanded] = useState(false);
  const handleClick = (ee) => {
    console.log(1)
    if(onClick) {
      ee.stopPropagation()
      onClick(ee);
      return
    }
    setExpanded((prevExpanded) => !prevExpanded);
  };
  const AccordionSummary = children[0];
  const AccordionDetails = children.slice(1);

  const unexpandedClasses = [
   
    classes.Acd_root,
    classes.Paper_elevation2,
    classes.Paper_rounded,
    classes.Paper_root, 
    classes.Acd_rounded,
  ].join(" ");

  

  const expandedClasses = unexpandedClasses + " " + classes.expanded;

  return (
    <div ref={ref}
    style={{...style}}
      onDragStart={onDragStart}
      
      className={expanded ? expandedClasses : unexpandedClasses}
      
    >
      <div  onClickCapture={handleClick} >{React.cloneElement(AccordionSummary,{expanded:expanded})}</div>
      
      

        <AcdCollapse in={expanded} timeout={300} onClick={(e)=>e.stopPropagation()}>
          {AccordionDetails}
        </AcdCollapse>
      </div>
  );
});

export default Accordionish;
