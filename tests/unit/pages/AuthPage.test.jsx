import React from "react";
import { render, screen } from "@testing-library/react";
import AuthPage from "../../../src/pages/AuthPage";

describe("AuthPage", () => {
  it("should render login page", () => {
    render(<AuthPage />);

    expect(screen.getByText(/Sign in to your account/i)).toBeInTheDocument();
  });

  it("shoydle toggle to signup page", () => {
    render(<AuthPage />);

    const toggleButton = screen.getByTestId("toggle-button");
    toggleButton.click();

    expect(screen.getByText(/Sign up/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/user name/i)).toBeInTheDocument();
  });
});
