import React, { useEffect, useState } from 'react';
import Acd from '../acd/acd';
const swapElement = (arr, a, b) => {
    const arr1 = [...arr];
    const el1 = arr1[a];
    arr1[a] = arr1[b];
    arr1[b] = el1;
    return arr1;
};

const Dnd = ({ children }) => {
    const [state, setState] = useState(1);
    const colorRef = useRef('red');
    const divRef = useRef();
    const [childrenState, setChildrenState] = useState([...children.map((e,i)=>React.cloneElement(e,{children:132,key:i}))])
    const RenderChildren = (state) => {
        console.log(childrenState);

        const Child1 = React.cloneElement(children[0], { children: state });

        return Child1
    }
    useEffect(()=>{
        divRef.current.style.backgroundColor='col'
    },[])
    const clickHandler = () => {
        divRef.current.style.trans
        /* setChildrenState(prev => {
            console.log(111)
            const res = prev.map((e,i)=>React.cloneElement(e,{}))
            return res
        }) */
        /* setState(prev=>{
            return prev+1;
        }) */
    }
    return (
        <div ref={divRef} onClick={clickHandler}>
            {childrenState}
        </div>
    )
}


export default Dnd;