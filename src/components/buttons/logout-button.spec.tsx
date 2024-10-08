import { useLogout, useUser } from "@account-kit/react";
import { render } from "@testing-library/react";
import { describe, expect, it, Mock, vi } from "vitest";
import { LogoutButton } from "./logout-button";
import { useStore } from "../../contexts/use-store";

vi.mock("@account-kit/react", () => ({
  useUser: vi.fn(),
  useLogout: vi.fn(),
}));

vi.mock("../../contexts/use-store", () => ({
  useStore: vi.fn(),
}));

const COMPONENT_ID = "web3-logout-button";

describe("LogoutButton", () => {
  it("should hide the button when no user is present", () => {
    (useUser as Mock).mockReturnValue(null);
    (useLogout as Mock).mockReturnValue({ logout: vi.fn() });
    (useStore as Mock).mockReturnValue({ clearStore: vi.fn() });

    const button = document.createElement("button");
    button.id = COMPONENT_ID;
    document.body.appendChild(button);

    render(<LogoutButton />);

    expect(button.style.display).toBe("none");

    document.body.removeChild(button);
  });

  it("should show the button and call logout when clicked", () => {
    const logout = vi.fn();
    const clearStore = vi.fn();

    (useUser as Mock).mockReturnValue({ address: "0x1234567890abcdef" });
    (useLogout as Mock).mockReturnValue({ logout });
    (useStore as Mock).mockReturnValue({ clearStore });

    const button = document.createElement("button");
    button.id = COMPONENT_ID;
    document.body.appendChild(button);

    render(<LogoutButton />);

    expect(button.style.display).toBe("block");

    button.click();

    expect(logout).toHaveBeenCalled();
    expect(clearStore);

    document.body.removeChild(button);
  });
});
