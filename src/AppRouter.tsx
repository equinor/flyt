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
import { NewVSMPage } from "./pages/NewVSMPage";
import { LoginPage } from "./pages/LoginPage";

export function AppRouter(): JSX.Element {
  return (
    <Router>
      <Switch>
        <Route path="/redux">
          <ReduxPage />
        </Route>
        <Route path="/user">
          <UserPage />
        </Route>
        <Route path="/login">
          <LoginPage />
        </Route>
        <Route path="/rabbits">
          <RabbitsPage />
        </Route>
        <GuardedRoute path="/vsm" component={VSMPage} />
        <GuardedRoute path="/new_vsm" component={NewVSMPage} />
        <GuardedRoute path="/overview" component={OverviewPage} />
        {/*<GuardedRoute path="/user" component={UserPage} />*/}
        <Route path="/">
          <OverviewPage />
        </Route>
      </Switch>
    </Router>
  );
}
