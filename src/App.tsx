import React, { useEffect, useRef } from "react";

import "./App.css";

import Accordionish from "./Accordionish/Accordionish";
import AccordionishSummary from "./Accordionish/AccordionishSummary/AccordionishSummary";
import AccordionishDetails from "./Accordionish/AccordionishDetails/AccordionishDetails";
import ExpandIcon from "./ExpandIcon/ExpandIcon";
import DragNDrop from "./DragNDrop/DragNDrop";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';


function App() {
  
  return (
    <div style={{ width: "60%", padding: "5%", margin: "auto" }}>
      <h2 className={"header"}>Accordionish Demo</h2>
      <DragNDrop>
        <Accordionish>
          <AccordionishSummary expandIcon={<ExpandMoreIcon/>}>
            Accordion 1{" "}
          </AccordionishSummary>
          <AccordionishDetails>
            1Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.
          </AccordionishDetails>
        </Accordionish>
        <Accordionish>
          <AccordionishSummary expandIcon={<ExpandMoreIcon/>}>
            Accordion 2{" "}
          </AccordionishSummary>
          <AccordionishDetails>
            1Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.
          </AccordionishDetails>
        </Accordionish>
        <Accordionish>
          <AccordionishSummary expandIcon={<ExpandMoreIcon/>}>
            Accordion 3{" "}
          </AccordionishSummary>
          <AccordionishDetails>
            1Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.
          </AccordionishDetails>
        </Accordionish>
        <Accordionish>
          <AccordionishSummary expandIcon={<ExpandMoreIcon/>}>
            Accordion 4{" "}
          </AccordionishSummary>
          <AccordionishDetails>
            1Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.
          </AccordionishDetails>
        </Accordionish>
        <Accordionish>
          <AccordionishSummary expandIcon={<ExpandMoreIcon/>}>
            Accordion 5{" "}
          </AccordionishSummary>
          <AccordionishDetails>
            1Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.
          </AccordionishDetails>
        </Accordionish>
        <Accordionish>
          <AccordionishSummary expandIcon={<ExpandMoreIcon/>}>
            Accordion 6{" "}
          </AccordionishSummary>
          <AccordionishDetails>
            1Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.
          </AccordionishDetails>
        </Accordionish>
        <Accordionish>
          <AccordionishSummary expandIcon={<ExpandMoreIcon/>}>
            Accordion 7{" "}
          </AccordionishSummary>
          <AccordionishDetails>
            1Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.
          </AccordionishDetails>
        </Accordionish>
        <Accordionish>
          <AccordionishSummary expandIcon={<ExpandMoreIcon/>}>
            Accordion 8{" "}
          </AccordionishSummary>
          <AccordionishDetails>
            1Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.
          </AccordionishDetails>
        </Accordionish>
      </DragNDrop>
    </div>
  );
}

export default App;
