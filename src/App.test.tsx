import React from "react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { store } from "./app/store";
import App from "./App";

test("Navigates to redux page and renders learn react link", () => {
  const { getByText } = render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  userEvent.click(getByText("Redux"));
  expect(getByText(/learn/i)).toBeInTheDocument();
});
