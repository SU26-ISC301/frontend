import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders the home page", () => {
  render(<App />);

  expect(
    screen.getByRole("heading", {
      name: /Sàn thương mại điện tử thông minh, tiện lợi cho mọi nhà/i,
    }),
  ).toBeInTheDocument();
});
