import React from "react";
import { render, screen } from "@testing-library/react";
import Login from "../../../src/components/Login";

describe("Login", () => {
  it("should render login page", () => {
    render(<Login />);

    const heading = screen.getByRole("heading", {
      name: /Sign in to your account/i,
    });
    const button = screen.getByRole("button", { name: /Sign in/i });
    const username = screen.getByText(/User name/i);
    const password = screen.getByText(/Password/);
    expect(heading).toBeInTheDocument();
    expect(button).toBeInTheDocument();
    expect(username).toBeInTheDocument();
    expect(password).toBeInTheDocument();
  });
});
