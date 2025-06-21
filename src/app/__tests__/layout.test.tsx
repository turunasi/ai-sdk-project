import { render, screen } from "@testing-library/react";
import RootLayout from "@/app/layout";

describe("RootLayout", () => {
  it("renders children correctly", () => {
    render(
      <RootLayout>
        <h1>Test Child</h1>
      </RootLayout>,
    );
    expect(screen.getByText("Test Child")).toBeInTheDocument();
  });
});
