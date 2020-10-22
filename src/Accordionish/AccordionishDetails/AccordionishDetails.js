import React from "react";
import classes from './AccordionishDetails.module.css'



const AccordionishDetails = React.forwardRef(({children},ref) => {
  
  return (
    <div ref={ref}>
      <div className={classes.innerContainer}>
        <p className={classes.typography}>{children}</p>
      </div>
    </div>
  );
});

export default AccordionishDetails;
