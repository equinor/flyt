import { calculateCardWidth } from "./cardWidthCalculator";
import { vsmObjectTypes } from "../../types/vsmObjectTypes";

describe("Card-width calculator", function () {
  it("should calculate the correct width for a MainActivity-card", () => {
    expect(calculateCardWidth(0, vsmObjectTypes.mainActivity)).toEqual(126);
    //  1-4 task => 126 + 42 = 168
    expect(calculateCardWidth(1, vsmObjectTypes.mainActivity)).toEqual(168);
    expect(calculateCardWidth(2, vsmObjectTypes.mainActivity)).toEqual(168);
    expect(calculateCardWidth(3, vsmObjectTypes.mainActivity)).toEqual(168);
    expect(calculateCardWidth(4, vsmObjectTypes.mainActivity)).toEqual(168);

    //  5-8 task => 126 + 42*2 = 210
    expect(calculateCardWidth(5, vsmObjectTypes.mainActivity)).toEqual(210);
    expect(calculateCardWidth(6, vsmObjectTypes.mainActivity)).toEqual(210);
    expect(calculateCardWidth(7, vsmObjectTypes.mainActivity)).toEqual(210);
    expect(calculateCardWidth(8, vsmObjectTypes.mainActivity)).toEqual(210);
    //  9-12 task => 126 + 42*3 = 252
    expect(calculateCardWidth(9, vsmObjectTypes.mainActivity)).toEqual(252);
    expect(calculateCardWidth(10, vsmObjectTypes.mainActivity)).toEqual(252);
    expect(calculateCardWidth(11, vsmObjectTypes.mainActivity)).toEqual(252);
    expect(calculateCardWidth(12, vsmObjectTypes.mainActivity)).toEqual(252);
    //  13-16 task =>  126 + 42*4 = 294
    expect(calculateCardWidth(13, vsmObjectTypes.mainActivity)).toEqual(294);
    expect(calculateCardWidth(14, vsmObjectTypes.mainActivity)).toEqual(294);
    expect(calculateCardWidth(15, vsmObjectTypes.mainActivity)).toEqual(294);
    expect(calculateCardWidth(16, vsmObjectTypes.mainActivity)).toEqual(294);
    //  17-20 task => 126 + 42*5 = 336
    expect(calculateCardWidth(17, vsmObjectTypes.mainActivity)).toEqual(336);
    expect(calculateCardWidth(18, vsmObjectTypes.mainActivity)).toEqual(336);
    expect(calculateCardWidth(19, vsmObjectTypes.mainActivity)).toEqual(336);
    expect(calculateCardWidth(20, vsmObjectTypes.mainActivity)).toEqual(336);
  });
  it("should calculate the correct width for a SubActivity-card", () => {
    expect(calculateCardWidth(0, vsmObjectTypes.subActivity)).toEqual(126);
    //  1-4 task => 126 + 42 = 168
    expect(calculateCardWidth(1, vsmObjectTypes.subActivity)).toEqual(168);
    expect(calculateCardWidth(2, vsmObjectTypes.subActivity)).toEqual(168);
    expect(calculateCardWidth(3, vsmObjectTypes.subActivity)).toEqual(168);
    expect(calculateCardWidth(4, vsmObjectTypes.subActivity)).toEqual(168);

    //  5-8 task => 126 + 42*2 = 210
    expect(calculateCardWidth(5, vsmObjectTypes.subActivity)).toEqual(210);
    expect(calculateCardWidth(6, vsmObjectTypes.subActivity)).toEqual(210);
    expect(calculateCardWidth(7, vsmObjectTypes.subActivity)).toEqual(210);
    expect(calculateCardWidth(8, vsmObjectTypes.subActivity)).toEqual(210);
    //  9-12 task => 126 + 42*3 = 252
    expect(calculateCardWidth(9, vsmObjectTypes.subActivity)).toEqual(252);
    expect(calculateCardWidth(10, vsmObjectTypes.subActivity)).toEqual(252);
    expect(calculateCardWidth(11, vsmObjectTypes.subActivity)).toEqual(252);
    expect(calculateCardWidth(12, vsmObjectTypes.subActivity)).toEqual(252);
    //  13-16 task =>  126 + 42*4 = 294
    expect(calculateCardWidth(13, vsmObjectTypes.subActivity)).toEqual(294);
    expect(calculateCardWidth(14, vsmObjectTypes.subActivity)).toEqual(294);
    expect(calculateCardWidth(15, vsmObjectTypes.subActivity)).toEqual(294);
    expect(calculateCardWidth(16, vsmObjectTypes.subActivity)).toEqual(294);
    //  17-20 task => 126 + 42*5 = 336
    expect(calculateCardWidth(17, vsmObjectTypes.subActivity)).toEqual(336);
    expect(calculateCardWidth(18, vsmObjectTypes.subActivity)).toEqual(336);
    expect(calculateCardWidth(19, vsmObjectTypes.subActivity)).toEqual(336);
    expect(calculateCardWidth(20, vsmObjectTypes.subActivity)).toEqual(336);
  });
  it("should calculate the correct width for a waiting-card ", () => {
    expect(calculateCardWidth(0, vsmObjectTypes.waiting)).toEqual(126);
    //  1-2 task => 126 + 42 = 168
    expect(calculateCardWidth(1, vsmObjectTypes.waiting)).toEqual(168);
    expect(calculateCardWidth(2, vsmObjectTypes.waiting)).toEqual(168);

    //  3-4 task => 126 + 42*2 = 210
    expect(calculateCardWidth(3, vsmObjectTypes.waiting)).toEqual(210);
    expect(calculateCardWidth(4, vsmObjectTypes.waiting)).toEqual(210);

    //  5-6 task => 126 + 42*3 = 252
    expect(calculateCardWidth(5, vsmObjectTypes.waiting)).toEqual(252);
    expect(calculateCardWidth(6, vsmObjectTypes.waiting)).toEqual(252);

    //  7-8 task => 126 + 42*4 = 294
    expect(calculateCardWidth(7, vsmObjectTypes.waiting)).toEqual(294);
    expect(calculateCardWidth(8, vsmObjectTypes.waiting)).toEqual(294);

    //  9-10 task => 126 + 42*5 = 336
    expect(calculateCardWidth(9, vsmObjectTypes.waiting)).toEqual(336);
    expect(calculateCardWidth(10, vsmObjectTypes.waiting)).toEqual(336);

    //  11-12 task => 126 + 42*6 = 378
    expect(calculateCardWidth(11, vsmObjectTypes.waiting)).toEqual(378);
    expect(calculateCardWidth(12, vsmObjectTypes.waiting)).toEqual(378);

    //  13-14 task => 126 + 42*7 = 420
    expect(calculateCardWidth(13, vsmObjectTypes.waiting)).toEqual(420);
    expect(calculateCardWidth(14, vsmObjectTypes.waiting)).toEqual(420);

    //  15-16 task => 126 + 42*8 = 462
    expect(calculateCardWidth(15, vsmObjectTypes.waiting)).toEqual(462);
    expect(calculateCardWidth(16, vsmObjectTypes.waiting)).toEqual(462);

    //  17-18 task => 126 + 42*9 = 504
    expect(calculateCardWidth(17, vsmObjectTypes.waiting)).toEqual(504);
    expect(calculateCardWidth(18, vsmObjectTypes.waiting)).toEqual(504);

    //  19-20 task => 126 + 42*10 = 546
    expect(calculateCardWidth(19, vsmObjectTypes.waiting)).toEqual(546);
    expect(calculateCardWidth(20, vsmObjectTypes.waiting)).toEqual(546);
  });

  it("should return the default width for any other type of card (no matter if it has tasks or not, because they are not supported atm)", () => {
    for (let i = 0; i <= 20; i++) {
      expect(calculateCardWidth(i, vsmObjectTypes.process)).toEqual(126);
      expect(calculateCardWidth(i, vsmObjectTypes.input)).toEqual(126);
      expect(calculateCardWidth(i, vsmObjectTypes.output)).toEqual(126);
      expect(calculateCardWidth(i, vsmObjectTypes.customer)).toEqual(126);
      expect(calculateCardWidth(i, vsmObjectTypes.supplier)).toEqual(126);
      expect(calculateCardWidth(i, vsmObjectTypes.error)).toEqual(126);
    }
  });
});
