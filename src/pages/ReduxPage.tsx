import logo from "../logo.svg";
import Counter from "../features/counter/Counter";
import React from "react";
import { AppTopBar } from "../components";

export function ReduxPage(): JSX.Element {
  return (
    <div className="App">
      <AppTopBar />
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Counter />
        <div style={{ paddingTop: 20 }}>
          <span>Learn </span>
          <a
            className="App-link"
            href="https://reactjs.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            React
          </a>
          <span>, </span>
          <a
            className="App-link"
            href="https://redux.js.org/ReduxPage.tsx"
            target="_blank"
            rel="noopener noreferrer"
          >
            Redux
          </a>
          <span>, </span>
          <a
            className="App-link"
            href="https://redux-toolkit.js.org/ReduxPage.tsx"
            target="_blank"
            rel="noopener noreferrer"
          >
            Redux Toolkit
          </a>
          ,<span> and </span>
          <a
            className="App-link"
            href="https://react-redux.js.org/ReduxPage.tsx"
            target="_blank"
            rel="noopener noreferrer"
          >
            React Redux
          </a>
        </div>
      </header>
    </div>
  );
}
