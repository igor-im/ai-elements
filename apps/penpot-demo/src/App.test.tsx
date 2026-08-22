import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import design from "../../../penpot/exports/approval-workspace.penpot.json";
import { App } from "./App";

const nativeCopy = design.board.children.flatMap((node) =>
  node.type === "text" && node.text?.characters ? [node.text.characters] : []
);

afterEach(cleanup);

describe("Penpot implementation contract", () => {
  it("renders every native text node from the exported board", () => {
    render(<App />);

    for (const text of nativeCopy) {
      expect(screen.getAllByText(text).length).toBeGreaterThan(0);
    }
  });

  it("renders one design-system alert for each linked instance", () => {
    render(<App />);

    expect(screen.getAllByRole("alert")).toHaveLength(
      design.instances.length
    );
  });

  it("uses accessible page, navigation, and details landmarks", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Approval workspace" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: "Primary" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Workspace" })
    ).toHaveAttribute("aria-current", "page");
    expect(
      screen.getByRole("region", { name: "Run details" })
    ).toBeInTheDocument();
  });

  it("renders the resolved request controls and response states", () => {
    render(<App />);

    expect(screen.getByRole("button", { name: "Reject" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Approve" })).toBeInTheDocument();
    expect(
      screen.getByText("You approved this tool execution")
    ).toBeInTheDocument();
    expect(
      screen.getByText("You rejected this tool execution")
    ).toBeInTheDocument();
  });

  it("keeps each resolved response icon and message in one content row", () => {
    render(<App />);

    for (const message of [
      "You approved this tool execution",
      "You rejected this tool execution",
    ]) {
      const content = screen.getByText(message).closest(".decision-content");

      expect(content).toBeInTheDocument();
      expect(content?.querySelector("svg")).toBeInTheDocument();
    }
  });

  it("imports the pinned Confirmation implementation instead of redrawing it", () => {
    const source = readFileSync(resolve(process.cwd(), "src/App.tsx"), "utf8");

    expect(source).toContain('from "@repo/elements/confirmation"');
  });
});
