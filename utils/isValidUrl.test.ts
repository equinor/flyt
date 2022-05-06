import { isValidUrl } from "./isValidUrl";

describe("isValidUrl", () => {
  it("should return true if url is valid", () => {
    expect(isValidUrl("https://www.equinor.com")).toBe(true);
    expect(isValidUrl("http://www.equinor.com")).toBe(true);
    expect(isValidUrl("www.equinor.com")).toBe(true);
    expect(isValidUrl("insight.equinor.com")).toBe(true);
    expect(isValidUrl("equinor.com")).toBe(true);
  });
  it("should return false if url is invalid", () => {
    expect(isValidUrl("equinor")).toBe(false);
    expect(isValidUrl(".falseURl")).toBe(false);
    expect(isValidUrl(".com")).toBe(false);
  });
});
