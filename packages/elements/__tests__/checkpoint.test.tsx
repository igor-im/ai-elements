import { render, screen } from "@testing-library/react";

import {
  Checkpoint,
  CheckpointIcon,
  CheckpointTrigger,
} from "../src/checkpoint";

describe("checkpoint", () => {
  it("renders the checkpoint label and default icon", () => {
    const { container } = render(
      <Checkpoint>
        <CheckpointIcon data-testid="checkpoint-icon" />
        <CheckpointTrigger>Restore checkpoint</CheckpointTrigger>
      </Checkpoint>
    );

    expect(screen.getByTestId("checkpoint-icon")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Restore checkpoint" })
    ).toHaveAttribute("type", "button");
    expect(container.firstChild).toHaveClass("text-muted-foreground");
  });

  it("preserves explicit trigger styling", () => {
    render(
      <Checkpoint>
        <CheckpointTrigger className="checkpoint-action">
          Restore
        </CheckpointTrigger>
      </Checkpoint>
    );

    expect(screen.getByRole("button", { name: "Restore" })).toHaveClass(
      "checkpoint-action"
    );
  });
});
