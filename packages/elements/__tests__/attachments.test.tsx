import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import {
  Attachment,
  AttachmentEmpty,
  AttachmentInfo,
  AttachmentPreview,
  AttachmentRemove,
  Attachments,
  getAttachmentLabel,
  getMediaCategory,
} from "../src/attachments";

const imageAttachment = {
  filename: "diagram.png",
  id: "image-1",
  mediaType: "image/png",
  type: "file" as const,
  url: "data:image/png;base64,AA==",
};

describe("attachments", () => {
  it("classifies and labels pinned attachment data", () => {
    expect(getMediaCategory(imageAttachment)).toBe("image");
    expect(getAttachmentLabel(imageAttachment)).toBe("diagram.png");
    expect(
      getAttachmentLabel({
        id: "source-1",
        mediaType: "text/html",
        sourceId: "source",
        title: "AI Elements",
        type: "source-document",
      })
    ).toBe("AI Elements");
  });

  it.each(["grid", "inline", "list"] as const)(
    "renders the %s visual variant",
    (variant) => {
      render(
        <Attachments variant={variant}>
          <Attachment data={imageAttachment}>
            <AttachmentPreview />
            <AttachmentInfo showMediaType />
          </Attachment>
        </Attachments>
      );

      expect(screen.getByAltText("diagram.png")).toBeInTheDocument();
      expect(screen.queryByText("diagram.png") !== null).toBe(
        variant !== "grid"
      );
    }
  );

  it("invokes the item removal callback", async () => {
    const onRemove = vi.fn();
    const user = userEvent.setup();
    render(
      <Attachments variant="list">
        <Attachment data={imageAttachment} onRemove={onRemove}>
          <AttachmentInfo />
          <AttachmentRemove />
        </Attachment>
      </Attachments>
    );

    await user.click(screen.getByRole("button", { name: "Remove" }));
    expect(onRemove).toHaveBeenCalledOnce();
  });

  it("renders the explicit empty state", () => {
    render(<AttachmentEmpty />);
    expect(screen.getByText("No attachments")).toBeInTheDocument();
  });
});
