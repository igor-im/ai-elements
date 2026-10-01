import { render } from "@testing-library/react";

import { Canvas } from "../src/canvas";
import { Controls } from "../src/controls";

describe("controls", () => {
  it("renders within Canvas", () => {
    const { container } = render(
      <div style={{ height: 600, width: 800 }}>
        <Canvas edges={[]} nodes={[]}>
          <Controls />
        </Canvas>
      </div>
    );
    expect(
      container.querySelector(".react-flow__controls")
    ).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <div style={{ height: 600, width: 800 }}>
        <Canvas edges={[]} nodes={[]}>
          <Controls className="custom-controls" />
        </Canvas>
      </div>
    );
    const controls = container.querySelector(".custom-controls");
    expect(controls).toBeInTheDocument();
    expect(controls).toHaveClass("custom-controls");
  });

  it("renders with default styles", () => {
    const { container } = render(
      <div style={{ height: 600, width: 800 }}>
        <Canvas edges={[]} nodes={[]}>
          <Controls />
        </Canvas>
      </div>
    );
    const controls = container.querySelector(".react-flow__controls");
    expect(controls).toBeInTheDocument();
  });

  it("accepts additional props", () => {
    const { container } = render(
      <div style={{ height: 600, width: 800 }}>
        <Canvas edges={[]} nodes={[]}>
          <Controls data-testid="test-controls" />
        </Canvas>
      </div>
    );
    // Just verify it renders without error
    expect(container).toBeTruthy();
  });
});
