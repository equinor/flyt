import { transformLink } from "./transformLink";

const equinorUrl = "https://equinor.com";
const insightUrl = "https://insight.equinor.com";

describe("transforming a link", () => {
  it("should prepend https:// to a link without protocol", () => {
    expect(transformLink("equinor.com")).toBe(equinorUrl);
    expect(transformLink("insight.equinor.com")).toBe(insightUrl);
  });
  it("should not prepend https:// to a link with protocol", () => {
    expect(transformLink("http://equinor.com")).toBe("http://equinor.com");
    expect(transformLink(equinorUrl)).toBe(equinorUrl);
    expect(transformLink("http://insight.equinor.com")).toBe(
      "http://insight.equinor.com"
    );
    expect(transformLink(insightUrl)).toBe(insightUrl);
  });
});
