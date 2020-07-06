import { render } from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import * as React from "react";
import { SnackbarProvider } from "notistack";
import HomePage from "./pages/Home/HomePage";
import "./index.css";

const rootEl = document.getElementById("root");

render(
  <SnackbarProvider maxSnack={3}>
    <BrowserRouter>
      <Switch>
        <Route exact={true} path="/progress" component={HomePage} />
      </Switch>
    </BrowserRouter>
  </SnackbarProvider>,
  rootEl
);
