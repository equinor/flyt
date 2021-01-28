import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import {
  OverviewPage,
  RabbitsPage,
  ReduxPage,
  UserPage,
  VSMPage,
} from "./pages";
import React from "react";
import { GuardedRoute } from "./utils/GuardedRoute";
import { LoginPage } from "./pages/LoginPage";

export function AppRouter(): JSX.Element {
  return (
    <Router>
      <Switch>
        <Route path="/user">
          <UserPage />
        </Route>
        <Route path="/login">
          <LoginPage />
        </Route>
        <GuardedRoute path="/vsm" component={VSMPage} />
        <GuardedRoute path="/overview" component={OverviewPage} />
        {/*Extras*/}
        <Route path="/redux">
          <ReduxPage />
        </Route>
        <Route path="/rabbits">
          <RabbitsPage />
        </Route>
        {/*Catch all*/}
        <GuardedRoute path="/" component={OverviewPage} />
        {/*<Route path="/">*/}
        {/*  <HomePage />*/}
        {/*</Route>*/}
      </Switch>
    </Router>
  );
}
