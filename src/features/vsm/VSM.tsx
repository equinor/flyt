import React from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   decrement,
//   increment,
//   incrementAsync,
//   incrementByAmount,
//   selectCount,
// } from "./vsmSlice";
// import styles from "./VSM.module.css";
import ReactJson from "react-json-view";

export default function VSM(props: { json: any }) {
  // const count = useSelector(selectCount);
  // const dispatch = useDispatch();
  // const [incrementAmount, setIncrementAmount] = useState("2");
  // console.log({ count, dispatch, incrementAmount, setIncrementAmount });
  if (Object.values(props.json).length > 0) {
    return (
      <div className={"vsmSideMenu"}>
        <ReactJson src={props.json} theme={"apathy:inverted"} />
      </div>
    );
  }
  return <div />;
}
