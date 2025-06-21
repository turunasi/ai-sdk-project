import { render, screen } from "@testing-library/react";
import { Sidebar } from "../Sidebar";

describe("Sidebar", () => {
  it("renders its children correctly", () => {
    render(
      <Sidebar>
        <div>Sidebar Child 1</div>
        <p>Sidebar Child 2</p>
      </Sidebar>,
    );

    expect(screen.getByText("Sidebar Child 1")).toBeInTheDocument();
    expect(screen.getByText("Sidebar Child 2")).toBeInTheDocument();
  });
});
