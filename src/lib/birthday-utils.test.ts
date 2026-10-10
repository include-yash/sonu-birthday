import { describe, expect, it } from "vitest";
import { isPlaceholder, timeUntil, txt } from "./birthday-utils";
import { birthday } from "@/content/birthday";

describe("birthday rules", () => {
  it("unlocks on October 11, 2026", () => {
    expect(timeUntil(birthday.birthdayISO, new Date("2026-10-10T23:59:00")).done).toBe(false);
    expect(timeUntil(birthday.birthdayISO, new Date("2026-10-11T00:00:01")).done).toBe(true);
  });
  it("never shows raw placeholder tokens", () => {
    expect(isPlaceholder("[ADD_FINAL_LETTER]")).toBe(true);
    expect(txt("[ADD_FINAL_LETTER]", "fallback")).toBe("fallback");
    expect(txt("Real words", "fallback")).toBe("Real words");
  });
});
