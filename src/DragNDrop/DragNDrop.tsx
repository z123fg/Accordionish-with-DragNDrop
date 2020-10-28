import React, { createRef, FC, ReactElement, useRef, useState } from "react";
import useLongPress from "./useLongPress/useLongPress";
import classes from "./DragNDrop.module.css";

interface Props{
    children:ReactElement[];
    
}

function array_move(arr:any, from:number, to:number) {
    const temp = arr[from];
    arr.splice(from, 1);
    if (from < to) {
      arr.splice(to - 1, 0, temp);
    } else {
      arr.splice(to, 0, temp);
    }
  }

  const DragNDrop:FC<Props> = ({ children }) => {
    const defaultOptions = {
      shouldPreventDefault: true,
      delay: 500,
    };
    const firstDragRef = useRef<any>(null);
    const totalTransitionRef = useRef<any>(0);
    const lastTransitionRef = useRef<any>(0);
    const lastCoordRef = useRef<any>();
    const movementRef = useRef<any>();
    const translateRef = useRef(Array(children.length).fill(0));
    const sectionRef = useRef<any>();
    const lastMouseRef = useRef<any>();
    const dragElRef = useRef<any>();
  
    const containerRef = useRef<any>();
    const dragRef = useRef<any>(false);
    const insertRef = useRef<any>();
    const childrenRef = useRef<any>(
      Array(children.length)
        .fill(null)
        .map((e) => createRef())
    );
    const dimensionsRef = useRef<any>({
      heights: Array(childrenRef.current.length).fill(null),
      edges: Array(childrenRef.current.length).fill(null),
    });
    const [childrenState, setChildrenState] = useState([
      ...children.map((e, i) => {
        return React.cloneElement(e, {
          onDragStart: (ee:any) => {
            ee.preventDefault();
            return false;
          },
          key: i,
          ref: (ele:any) => refHandler(ele, i),
        });
      }),
    ]);
  
    const getStyle = (ele:any, style:any) => {
      return parseInt(
        (document.defaultView as any).getComputedStyle(ele, "").getPropertyValue(style)
      );
    };
  
    const onTranslate = (draggable:any, x:number, y:number) => {
      draggable.style.transform = `translate(${x}px,${y}px)`;
    };
    const handlersRef = useRef({
      onMouseDown: (ee:any) => {
        if (ee.touches)
          childrenRef.current.forEach((e:any, i:any) => {
            e.current.removeEventListener(
              "mousedown",
              handlersRef.current.onMouseDown
            );
          });
        if (dragElRef.current != null && insertRef.current != null) return;
        childrenRef.current.forEach((e:any, i:any) => {
          if (e.current == ee.currentTarget) {
            dragElRef.current = i;
            insertRef.current = i;
          }
        });
  
        getDimensions();
        dimensionsRef.current = {
          ...dimensionsRef.current,
          lastMouse: ee.clientY || ee.touches[0].clientY,
          lastMouseX: ee.clientX || ee.touches[0].clientX,
          eltop: ee.currentTarget.getBoundingClientRect().top,
          elleft: ee.currentTarget.getBoundingClientRect().left,
          mouseY:
            (ee.clientY || ee.touches[0].clientY) -
            ee.currentTarget.getBoundingClientRect().top,
          offsetElTop: ee.target.getBoundingClientRect().top,
          offsetElLeft: ee.target.getBoundingClientRect().left,
        };
        if (ee.touches) {
          console.log("addTouchup");
          document.addEventListener("touchend", handlersRef.current.onMouseUp);
        } else {
          document.addEventListener("mouseup", handlersRef.current.onMouseUp);
        }
      },
      onLongPress: (ee:any) => {
        if (
          dragElRef.current == null ||
          insertRef.current == null ||
          dragRef.current
        )
          return;
  
        getDimensions();
        childrenRef.current.forEach((e:any, i:number) => {
          e.current.classList.add(classes.dropdrop);
        });
        childrenRef.current[dragElRef.current].current.classList.add(
          classes.elevation,
          classes.grab
        );
        dragRef.current = true;
        firstDragRef.current = ee.clientY || ee.touches[0].clientY;
        lastMouseRef.current = ee.clientY || ee.touches[0].clientY;
        if (ee.touches) {
          document.addEventListener(
            "touchmove",
            handlersRef.current.onMouseMove,
            { passive: false }
          );
        } else {
          document.addEventListener("mousemove", handlersRef.current.onMouseMove);
        }
  
        const draggable = childrenRef.current[dragElRef.current].current;
        draggable.classList.remove(classes.dropdrop);
        draggable.style.zIndex = "999";
        onTranslate(
          draggable,
          0,
          (ee.clientY || ee.touches[0].clientY) - dimensionsRef.current.lastMouse
        );
      },
      onMouseEnter: () => {},
  
      onMouseOver: (ee:any, i:number) => {},
      onMouseLeave: (i:any) => {},
      onMouseMove: (ee:any) => {
        if (ee.cancelable) {
          ee.preventDefault();
          ee.stopPropagation();
        }
        const x = ee.clientX || ee.touches[0].clientX;
        const y = ee.clientY || ee.touches[0].clientY;
        if (dragRef.current) {
          edgeDetector(x, y);
          if (x > dimensionsRef.current.left && x < dimensionsRef.current.right) {
            childrenRef.current.forEach((e:any, i:any) => {
              if (i == dragElRef.current) {
                onTranslate(
                  e.current,
                  (ee.clientX || ee.touches[0].clientX) -
                    dimensionsRef.current.lastMouseX,
                  (ee.clientY || ee.touches[0].clientY) -
                    dimensionsRef.current.lastMouse
                );
              } else {
                onTranslate(e.current, 0, translateRef.current[i]);
              }
            });
          }
        }
      },
      onMouseUp: (ee:any) => {
        if (dragElRef.current == null && insertRef.current == null) return;
  
        let draggable = childrenRef.current[dragElRef.current].current;
        draggable.classList.add(classes.dropdrop);
  
        childrenRef.current[dragElRef.current].current.style.zIndex = "";
  
        if (dragRef.current) {
          childrenRef.current[dragElRef.current].current.classList.remove(
            classes.elevation,
            classes.grab
          );
  
          rerenderChildren({
            onClick: (e:any) => {
              e.stopPropagation();
            },
          });
          if (lastMouseRef.current !== firstDragRef.current) {
            dragRef.current = false;
            onDrop();
          } else {
            dragElRef.current = null;
            insertRef.current = null;
            dragRef.current = false;
          }
        } else {
          console.log("noLongPress");
          rerenderChildren({ onClick: null });
          dragElRef.current = null;
          insertRef.current = null;
          dragRef.current = false;
        }
        document.removeEventListener("mouseup", handlersRef.current.onMouseUp);
        document.removeEventListener("touchend", handlersRef.current.onMouseUp);
        document.removeEventListener(
          "mousemove",
          handlersRef.current.onMouseMove
        );
        document.removeEventListener(
          "touchmove",
          handlersRef.current.onMouseMove
        );
        childrenRef.current.forEach((e:any, i:any) => {
          e.current.removeEventListener(
            "mouseover",
            handlersRef.current.onMouseOver
          );
          e.current.removeEventListener(
            "mouseleave",
            handlersRef.current.onMouseLeave
          );
        });
        console.log("reset");
      },
      onTransitionStart: (ee:any) => {
        totalTransitionRef.current = totalTransitionRef.current + 1;
      },
      onTransitionRun: (ee:any) => {
        ee.preventDefault();
      },
      onTransitionCancel: () => {
        totalTransitionRef.current = 0;
      },
      onTransitionEnd: () => {
        lastTransitionRef.current = lastTransitionRef.current + 1;
        if (lastTransitionRef.current >= totalTransitionRef.current) {
          dragRef.current = false;
          lastTransitionRef.current = 0;
          totalTransitionRef.current = 0;
          childrenRef.current.forEach((e:any, i:any) => {
            e.current.classList.remove(classes.dropdrop);
  
            e.current.removeEventListener(
              "transitionend",
              handlersRef.current.onTransitionEnd
            );
            e.current.removeEventListener(
              "transitioncancel",
              handlersRef.current.onTransitionCancel
            );
            e.current.removeEventListener(
              "transitionrun",
              handlersRef.current.onTransitionRun
            );
            e.current.removeEventListener(
              "transitionstart",
              handlersRef.current.onTransitionStart
            );
          });
          rerenderChildren(
            { onClick: () => {} },
            dragElRef.current,
            insertRef.current
          );
          insertRef.current = dragElRef.current;
          dragElRef.current = null;
          insertRef.current = null;
        }
      },
      onClick: () => {},
    });
  
    const onDrop = () => {
      if (insertRef == null) return;
      let insertTranslate = getTranslate();
  
      if (insertRef.current == dragElRef.current + 1) {
        translateRef.current = translateRef.current.map((e) => {
          return 0;
        });
      } else if (insertRef.current > dragElRef.current + 1) {
        translateRef.current = translateRef.current.map((e, i) => {
          if (i == dragElRef.current) return insertTranslate;
          if (i > dragElRef.current) {
            if (dragElRef.current == 0) {
              return (
                e -
                dimGetter("height", dragElRef.current) -
                Math.max(
                  dimGetter("margin-bottom", dragElRef.current),
                  dimGetter("margin-top", dragElRef.current + 1)
                )
              );
            } else {
              return (
                e -
                dimGetter("height", dragElRef.current) -
                Math.max(
                  dimGetter("margin-bottom", dragElRef.current),
                  dimGetter("margin-top", dragElRef.current + 1)
                ) -
                Math.max(
                  dimGetter("margin-top", dragElRef.current),
                  dimGetter("margin-bottom", dragElRef.current - 1)
                ) +
                Math.max(
                  dimGetter("margin-top", dragElRef.current + 1),
                  dimGetter("margin-bottom", dragElRef.current - 1)
                )
              );
            }
          }
  
          return e;
        });
      } else if (insertRef.current < dragElRef.current) {
        translateRef.current = translateRef.current.map((e, i) => {
          if (i == dragElRef.current) return insertTranslate;
          if (i > dragElRef.current) {
            return (
              e -
              dimGetter("height", dragElRef.current) -
              Math.max(
                dimGetter("margin-bottom", dragElRef.current),
                dimGetter("margin-top", dragElRef.current + 1)
              ) -
              Math.max(
                dimGetter("margin-top", dragElRef.current),
                dimGetter("margin-bottom", dragElRef.current - 1)
              ) +
              Math.max(
                dimGetter("margin-top", dragElRef.current + 1),
                dimGetter("margin-bottom", dragElRef.current - 1)
              )
            );
          }
          return e;
        });
      }
  
      childrenRef.current.forEach((e:any, i:any) => {
        e.current.addEventListener(
          "transitionstart",
          handlersRef.current.onTransitionStart
        );
        e.current.addEventListener(
          "transitionrun",
          handlersRef.current.onTransitionRun
        );
        e.current.addEventListener(
          "transitioncancel",
          handlersRef.current.onTransitionCancel
        );
        onTranslate(e.current, 0, translateRef.current[i]);
        e.current.addEventListener(
          "transitionend",
          handlersRef.current.onTransitionEnd
        );
      });
    };
  
    const rerenderChildren = (props:any, dragIndex?:any, insertIndex?:any) => {
      setChildrenState((prev) => {
        if (!dragIndex && !insertIndex) {
          return prev.map((e) => React.cloneElement(e, { ...props }));
        }
        let res = [...prev];
        lastCoordRef.current = translateRef.current;
        translateRef.current = Array(res.length).fill(0);
        array_move(res, dragIndex, insertIndex);
  
        array_move(childrenRef.current, dragIndex, insertIndex);
        res = res.map((e, i) =>
          React.cloneElement(e, {
            ...props,
            onDragStart: (ee:any) => {
              ee.preventDefault();
              return false;
            },
            ref: (ele:any) => refHandler(ele, i),
          })
        );
        return res;
      });
    };
  
    const getTranslate = () => {
      let insertTranslate;
      if (insertRef.current > dragElRef.current + 1) {
        if (dragElRef.current == 0) {
          insertTranslate =
            dimGetter("bottom", insertRef.current - 1) -
            dimGetter("top", dragElRef.current) +
            +Math.max(
              dimGetter("margin-top", dragElRef.current),
              dimGetter("margin-bottom", insertRef.current - 1)
            ) -
            (dimGetter("top", dragElRef.current + 1) -
              dimensionsRef.current.top -
              16);
        } else {
          insertTranslate =
            dimGetter("bottom", insertRef.current - 1) -
            dimGetter("top", dragElRef.current) +
            +Math.max(
              dimGetter("margin-top", dragElRef.current),
              dimGetter("margin-bottom", insertRef.current - 1)
            ) -
            (dimGetter("top", dragElRef.current + 1) -
              dimGetter("bottom", dragElRef.current - 1) -
              Math.max(
                dimGetter("margin-bottom", dragElRef.current - 1),
                dimGetter("margin-top", dragElRef.current + 1)
              ));
        }
      } else if (insertRef.current < dragElRef.current + 1) {
        if (insertRef.current == 0) {
          insertTranslate =
            dimensionsRef.current.top - dimGetter("top", dragElRef.current) + 16;
        } else {
          insertTranslate = -(
            dimGetter("top", dragElRef.current) -
            dimGetter("bottom", insertRef.current - 1) -
            Math.max(
              dimGetter("margin-top", dragElRef.current),
              dimGetter("margin-bottom", insertRef.current - 1)
            )
          );
        }
      }
      return insertTranslate;
    };
  
    const onCross = (arr:any, prev:any, curr:any) => {
      if (prev === false) return false;
      let temp = arr.map((e:any, i:any) => ((prev - e) * (curr - e) <= 0 ? i : -1));
  
      temp = temp.filter((e:any) => e != -1);
      if (temp.length == 0) return false;
      if (movementRef.current == "up") {
        return temp[0];
      } else if (movementRef.current == "down") {
        return temp[temp.length - 1];
      }
      return false;
    };
    const edgeDetector = (x:any, y:any) => {
      const crossInd = onCross(
        dimensionsRef.current.edges,
        movementRef.current == "down"
          ? lastMouseRef.current +
              dimensionsRef.current.heights[dragElRef.current].height -
              dimensionsRef.current.mouseY
          : lastMouseRef.current - dimensionsRef.current.mouseY,
        movementRef.current == "down"
          ? y +
              dimensionsRef.current.heights[dragElRef.current].height -
              dimensionsRef.current.mouseY
          : y - dimensionsRef.current.mouseY
      );
  
      if (crossInd !== false && crossInd !== dragElRef.current) {
        sectionRef.current = crossInd;
        if (movementRef.current == "down") {
          //downward
  
          insertRef.current = sectionRef.current + 1;
          if (sectionRef.current == dragElRef.current - 1) {
            translateRef.current = translateRef.current.map((e, i) => {
              return 0;
            });
          } else {
            translateRef.current = translateRef.current.map((e, i) => {
              if (i > sectionRef.current) {
                return (
                  dimGetter("height", dragElRef.current) +
                  Math.max(
                    dimGetter("margin-top", dragElRef.current),
                    dimGetter("margin-bottom", insertRef.current - 1)
                  ) +
                  Math.max(
                    dimGetter("margin-top", insertRef.current),
                    dimGetter("margin-bottom", dragElRef.current)
                  ) -
                  Math.max(
                    dimGetter("margin-bottom", insertRef.current - 1),
                    dimGetter("margin-top", insertRef.current)
                  )
                );
              }
              return 0;
            });
          }
        } else if (movementRef.current == "up") {
          //upward
          insertRef.current = sectionRef.current;
          if (sectionRef.current == dragElRef.current + 1) {
            translateRef.current = translateRef.current.map((e, i) => {
              return 0;
            });
          } else {
            translateRef.current = translateRef.current.map((e, i) => {
              if (i >= sectionRef.current) {
                if (insertRef.current == 0) {
                  return (
                    dimGetter("height", dragElRef.current) +
                    Math.max(
                      dimGetter("margin-top", insertRef.current),
                      dimGetter("margin-bottom", dragElRef.current)
                    )
                  );
                } else {
                  return (
                    dimGetter("height", dragElRef.current) +
                    Math.max(
                      dimGetter("margin-top", dragElRef.current),
                      dimGetter("margin-bottom", insertRef.current - 1)
                    ) +
                    Math.max(
                      dimGetter("margin-top", insertRef.current),
                      dimGetter("margin-bottom", dragElRef.current)
                    ) -
                    Math.max(
                      dimGetter("margin-bottom", insertRef.current - 1),
                      dimGetter("margin-top", insertRef.current)
                    )
                  );
                }
              }
  
              return 0;
            });
          }
        }
      }
      getEdges();
      if (lastMouseRef.current > y) movementRef.current = "up";
      else if (lastMouseRef.current < y) movementRef.current = "down";
      if (lastMouseRef.current !== y) lastMouseRef.current = y;
    };
  
    const longPressEvent = useLongPress(
      handlersRef.current.onLongPress,
      handlersRef.current.onClick,
      defaultOptions
    );
  
    const refHandler = (ele:any, i:any) => {
      if (!ele) return;
      ele.classList.remove("dropdrop");
      childrenRef.current[i].current = ele;
      onTranslate(ele, 0, 0);
      if (i == 0) ele.classList.add(classes.Acd_rounded);
      if (dimensionsRef.current) {
        dimensionsRef.current.edges[i] =
          ((ele.getBoundingClientRect().top || 0) +
            (ele.getBoundingClientRect().bottom || 0)) /
          2;
        dimensionsRef.current.heights[i] = {
          height: ele.getBoundingClientRect().height,
          marginTop: Math.max(
            getStyle(ele, "margin-top"),
            getStyle(ele, "margin-bottom")
          ),
          marginBottom: Math.max(
            getStyle(ele, "margin-top"),
            getStyle(ele, "margin-bottom")
          ),
          top: ele.getBoundingClientRect().top,
        };
      }
      ele.addEventListener("touchstart", handlersRef.current.onMouseDown);
      ele.addEventListener("mousedown", handlersRef.current.onMouseDown);
    };
    const getDimensions = () => {
      dimensionsRef.current = {
        ...dimensionsRef.current,
        left: containerRef.current?.getBoundingClientRect().left,
        right: containerRef.current?.getBoundingClientRect().right,
        top: containerRef.current?.getBoundingClientRect().top,
        bottom: containerRef.current?.getBoundingClientRect().bottom,
        edges: childrenRef.current.map((e:any) => {
          return (
            ((e.current.getBoundingClientRect().top || 0) +
              (e.current.getBoundingClientRect().bottom || 0)) /
            2
          );
        }),
        heights: childrenRef.current.map((ele:any, i:any) => {
          return {
            height: ele.current.getBoundingClientRect().height,
            marginTop: Math.max(
              getStyle(ele.current, "margin-top"),
              getStyle(ele.current, "margin-bottom")
            ),
            marginBottom: Math.max(
              getStyle(ele.current, "margin-top"),
              getStyle(ele.current, "margin-bottom")
            ),
            top: ele.current.getBoundingClientRect().top,
          };
        }),
      };
    };
    const getEdges = () => {
      dimensionsRef.current = {
        ...dimensionsRef.current,
        edges: childrenRef.current.map((e:any) => {
          return (
            ((e.current.getBoundingClientRect().top || 0) +
              (e.current.getBoundingClientRect().bottom || 0)) /
            2
          );
        }),
      };
    };
  
    const dimGetter = (prop:string, index:number) => {
      if (prop == "top") {
        return dimensionsRef.current.heights[index]?.top;
      } else if (prop == "height") {
        return dimensionsRef.current.heights[index]?.height;
      } else if (prop == "margin-top") {
        return dimensionsRef.current.heights[index]?.marginTop;
      } else if (prop == "margin-bottom") {
        return dimensionsRef.current.heights[index]?.marginBottom;
      } else if (prop == "edge") {
        return dimensionsRef.current.edges[index];
      } else if (prop == "bottom") {
        return (
          dimensionsRef.current.heights[index].top +
          dimensionsRef.current.heights[index].height
        );
      } else if (prop == "total-height") {
        return (
          dimensionsRef.current.heights[index]?.height +
          dimensionsRef.current.heights[index]?.marginTop +
          dimensionsRef.current.heights[index]?.marginBottom
        );
      }
    };
  
    return (
      <div
        ref={containerRef}
        style={{ position: "relative" }}
        {...longPressEvent}
      >
        <div style={{ height: "1px", marginBottom: "16px" }}></div>
        {childrenState}
      </div>
    );
  };
  
  export default DragNDrop;
  

