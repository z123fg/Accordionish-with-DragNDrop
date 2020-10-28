import React, { FC, ReactElement, ReactNode, useEffect, useState } from "react";
import classes from "./Accordionish.module.css";
import AcdCollapse from "../transition-component/AcdCollapse";

interface Props {
  children: ReactNode[];
  defaultExpanded?: boolean;
  disable?: boolean;
  expand?: boolean;
  onChange?: Function;
  square?: boolean;
  TransitionComponent?: FC;
  onClick?: Function;
  onDragStart?: (event: any) => void;
}

const Accordionish = React.forwardRef<HTMLDivElement, Props>(
  (
    {
      children,
      defaultExpanded = false,
      disable = false,
      expand = false,
      onChange,
      square = false,
      TransitionComponent = AcdCollapse,
      onClick,
      onDragStart,
    },
    ref
  ) => {
    const [expanded, setExpanded] = useState<boolean>(defaultExpanded);
    const [unexpandedClasses, setUnexpandedClasses] = useState<any>();
    const AccordionSummary = children[0] as ReactElement;
    const AccordionDetails = children.slice(1);

    useEffect(() => {
      if (!disable) {
        setExpanded(expand);
        onChange && onChange();
      }
    }, [expand]);
    

    useEffect(() => {
      setUnexpandedClasses(
        [
          classes.Acd_root,
          classes.Paper_elevation2,
          classes.Paper_rounded,

          classes.Paper_root,
          square ? "" : classes.Acd_rounded,
          expanded ? classes.expanded : "",
          disable ? classes.disabled : "",
        ].join(" ")
      );
    }, [square, disable, expanded]);
    
    const handleClick = (ee: any) => {
      if (onClick) {
        onClick(ee);
        ee.stopPropagation();
        return;
      }
      if (disable) {
        ee.stopPropagation();
        return;
      }

      setExpanded((prevExpanded) => !prevExpanded);

      onChange && onChange();
    };

    return (
      <div ref={ref} onDragStart={onDragStart} className={unexpandedClasses}>
        <div onClickCapture={handleClick}>
          {React.cloneElement(AccordionSummary, { expanded: expanded })}
        </div>

        <TransitionComponent
          in={expanded}
          timeout={300}
          onClick={(e) => e.stopPropagation()}
        >
          {AccordionDetails}
        </TransitionComponent>
      </div>
    );
  }
);

export default Accordionish;
