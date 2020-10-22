
import { useCallback, useRef, useState } from "react";
 
const useLongPress = (
    onLongPress,
    onClick,
    { shouldPreventDefault = true, delay = 300 } = {},
    
    ) => {
    const [longPressTriggered, setLongPressTriggered] = useState(false);
    const timeout = useRef();
    const target = useRef();

    const start = useCallback(
        event => { 
        event.persist()
            if (shouldPreventDefault && event.target) {
                    event.target.addEventListener("touchend", preventDefault, {
                    passive: false
                });
                target.current = event.target;
            }
            timeout.current = setTimeout(() => {
                onLongPress(event);
                setLongPressTriggered(true);
            }, delay);
        },
        [onLongPress, delay, shouldPreventDefault]
    );

    const clear = useCallback(
        (e, shouldTriggerClick = true) => {
            timeout.current && clearTimeout(timeout.current);
            shouldTriggerClick && !longPressTriggered && onClick(e);
            setLongPressTriggered(false);
            if (shouldPreventDefault && target.current) {
                target.current.removeEventListener("touchend", preventDefault);
            }
        },
        [shouldPreventDefault, onClick, longPressTriggered]
    );

    return {
        onMouseDown: (e) => start(e),
        onTouchStart: (e) => start(e),
        onMouseUp: (e) => {clear(e)},
        onMouseLeave: (e) => clear(e, false),
        onTouchEnd: (e) => clear(e)
    };
};

const isTouchEvent = (e) => {
return "touches" in e;
};

const preventDefault = (e) => {
if (!isTouchEvent(e)) return;

if (e.touches.length < 2 && e.preventDefault) {
    //e.preventDefault();
}
};

export default useLongPress;