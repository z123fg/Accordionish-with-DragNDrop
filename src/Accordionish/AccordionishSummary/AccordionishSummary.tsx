import React, { FC, ReactElement, ReactNode, useEffect }/* , { useState } */ from "react";
import classes from "./AccordionishSummary.module.css";
import ExpandIcon from '../../ExpandIcon/ExpandIcon';


interface Props{
    children?:ReactNode;
    expandIcon?:ReactElement;
}

const AccordionishSummary:FC<Props> = ({children,expandIcon,...rest}) => {
    const expanded = (rest as {expanded:boolean}).expanded;
   

    return (
        <div
          className={
            expanded
              ? [classes.expanded, classes.AcdSummary_root].join(" ")
              : classes.AcdSummary_root
          }
          style={{ overflow: "auto" }}
        >
          <div
            className={
              expanded
                ? [classes.AcdSummary_content, classes.expanded].join(" ")
                : classes.AcdSummary_content
            }
          >
            <p className={classes.typography}>{children}</p>
          </div>
          {expandIcon && (
            <div style={{ marginRight: "-12px" }}>
              <ExpandIcon expanded={expanded} icon={expandIcon}/>
            </div>
          )}
        </div>
      );
}

export default AccordionishSummary;
