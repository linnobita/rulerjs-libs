/**
 * @jest-environment jsdom
 */

import RulerLib from '../src/rulerjs-libs'
import { Options } from '../src/models';
import { RulerUnitType, RulerTheme } from '../src/utils';

describe('Library test', () => {
  it('RulerLib is instantiable', () => {
    expect(new RulerLib()).toBeInstanceOf(RulerLib);
  })

  it('Set unit', () => {
    const lib = new RulerLib(new Options());
    lib.setUnit(RulerUnitType.INCHES);
    expect(lib.rulers[0].unit.name).toBe(RulerUnitType.INCHES);
  })

  it('Set theme', () => {
    const lib = new RulerLib(new Options());
    lib.setTheme(RulerTheme.DARK_THEME);
    expect(lib.rulers[0].context.fillStyle).toBe('#fcfcfc');
  })

  it('Set scale', () => {
    const lib = new RulerLib(new Options());
    lib.setScale(1.2);
    expect(lib.rulers[0].scale).toBe(1.2);
  })
})
