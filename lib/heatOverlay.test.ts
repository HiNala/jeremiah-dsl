import { latLonToUnitVec } from "./heatOverlay";

describe("latLonToUnitVec", () => {
  it("returns unit vector for equator lon=0", () => {
    const v = latLonToUnitVec(0, 0);
    expect(Math.abs(v.length() - 1)).toBeLessThan(1e-7);
    expect(v.x).toBeCloseTo(1, 6);
    expect(v.y).toBeCloseTo(0, 6);
    expect(v.z).toBeCloseTo(0, 6);
  });

  it("maps lat=90 to north pole", () => {
    const v = latLonToUnitVec(90, 123);
    expect(v.x).toBeCloseTo(0, 6);
    expect(v.y).toBeCloseTo(1, 6);
    expect(v.z).toBeCloseTo(0, 6);
  });

  it("maps lon=90 on equator to +Z axis", () => {
    const v = latLonToUnitVec(0, 90);
    expect(v.x).toBeCloseTo(0, 6);
    expect(v.y).toBeCloseTo(0, 6);
    expect(v.z).toBeCloseTo(1, 6);
  });
});


