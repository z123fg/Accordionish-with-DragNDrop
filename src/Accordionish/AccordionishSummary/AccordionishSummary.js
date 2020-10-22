import React/* , { useState } */ from "react";
import classes from "./AccordionishSummary.module.css";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandIcon from '../../ExpandIcon/ExpandIcon'



const AccordionishSummary = ({ children, expandIcon,expanded }) => {
  /* const [expanded, setExpanded] = useState(false); */
 /*  const handleClick = () => {
    setExpanded((expanded) => !expanded);
  }; */
  return (
    <div
      className={
        expanded
          ? [classes.expanded, classes.AcdSummary_root].join(" ")
          : classes.AcdSummary_root
      }
      style={{ overflow: "auto" }}
      /* onClick={handleClick} */
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
          <ExpandIcon expanded={expanded} icon={<ExpandMoreIcon/>}/>
        </div>
      )}
    </div>
  );
};

export default AccordionishSummary;
