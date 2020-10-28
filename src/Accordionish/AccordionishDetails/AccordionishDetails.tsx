import React, { FC, ReactNode } from "react";
import classes from './AccordionishDetails.module.css'

interface Props{
    children?:ReactNode;
}

const AccordionishDetails:FC<Props> = ({children}) =>{
    return (
        <div>
          <div className={classes.innerContainer}>
            <p className={classes.typography}>{children}</p>
          </div>
        </div>
      );
}

export default AccordionishDetails;
