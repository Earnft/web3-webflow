import { useAuthModal } from "@account-kit/react";
import { describe, expect, it, Mock, vi } from "vitest";
import { AuthModalButton } from "./auth-modal-button";
import { render } from "@testing-library/react";

vi.mock("@account-kit/react", () => ({
  useAuthModal: vi.fn(),
  useUser: vi.fn(),
}));

const COMPONENT_ID = "web3-auth-modal-button";

describe("AuthModalButton", () => {
  it("should call openAuthModal when the button is clicked", () => {
    const openAuthModal = vi.fn();
    (useAuthModal as Mock).mockReturnValue({ openAuthModal });

    const button = document.createElement("button");
    button.id = COMPONENT_ID;
    document.body.appendChild(button);

    render(<AuthModalButton />);

    button.click();

    expect(openAuthModal).toHaveBeenCalled();
  });

  it("should call openAuthModal more then once", () => {
    const openAuthModal = vi.fn();
    (useAuthModal as Mock).mockReturnValue({ openAuthModal });

    const buttons = [];

    for (let i = 0; i < 2; i++) {
      const button = document.createElement("button");
      button.id = COMPONENT_ID;
      document.body.appendChild(button);

      buttons.push(button);
    }

    render(<AuthModalButton />);

    for (const button of buttons) {
      button.click();
      expect(openAuthModal).toHaveBeenCalled();
    }
  });
});
