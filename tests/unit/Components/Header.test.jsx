import React from "react";
import { render, screen } from "@testing-library/react";
import Header from "../../../src/components/Header";
import { RecoilRoot } from "recoil";
import { BrowserRouter } from "react-router-dom";

describe("Header", () => {
  it("should render header", () => {
    render(
      <RecoilRoot>
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      </RecoilRoot>
    );

    const heading = screen.getByRole("paragraph", { name: /M/i });
    expect(heading).toBeInTheDocument();
  });
});
