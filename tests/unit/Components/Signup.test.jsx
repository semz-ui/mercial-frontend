import React from "react";
import { render, screen } from "@testing-library/react";
import Signup from "../../../src/components/Signup";

describe("Signup", () => {
  it("should render signup page", () => {
    render(<Signup />);

    const heading = screen.getByRole("heading", { name: /Sign up/i });
    const button = screen.getByRole("button", { name: /Sign up/i });
    const email = screen.getByText(/Email address/i);
    const password = screen.getByText(/Password/i);
    expect(heading).toBeInTheDocument();
    expect(button).toBeInTheDocument();
    expect(email).toBeInTheDocument();
    expect(password).toBeInTheDocument();
  });
});
