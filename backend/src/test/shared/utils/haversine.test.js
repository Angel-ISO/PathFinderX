import { distance } from '../../../shared/utils/haversine.js';

describe('distance (Haversine)', () => {
  it('should return 0 for the same coordinates', () => {
    const d = distance(10, 20, 10, 20);
    expect(d).toBeCloseTo(0, 5);
  });

  it('Bogotá to Medellín should be around 237 km', () => {
  const bogota = { lat: 4.711, lon: -74.0721 };
  const medellin = { lat: 6.2518, lon: -75.5636 };

  const result = distance(
    bogota.lat,
    bogota.lon,
    medellin.lat,
    medellin.lon
  );

  expect(result).toBeGreaterThan(237920);
  expect(result).toBeLessThan(340000);
});



  it('should be symmetric (A to B == B to A)', () => {
    const d1 = distance(1, 2, 3, 4);
    const d2 = distance(3, 4, 1, 2);

    expect(d1).toBeCloseTo(d2, 5);
  });

  it('should return values in meters', () => {
    const pointA = { lat: 0, lon: 0 };
    const pointB = { lat: 0.001, lon: 0 };

    const result = distance(
      pointA.lat,
      pointA.lon,
      pointB.lat,
      pointB.lon
    );

    expect(result).toBeGreaterThan(100);
    expect(result).toBeLessThan(120);
  });
});
