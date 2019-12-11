/**
 * @jest-environment jsdom
 */

import * as UTILS from '../src/utils'

describe('Function tests', () => {
  it('An input is a string', () => {
    expect(UTILS.isString('a string')).toBeTruthy()
  })
  it('An input is not a string', () => {
    expect(UTILS.isString(500)).toBeFalsy()
  })

  it('Make 10 to "10px"', () => {
    expect(UTILS.pixelize(10)).toEqual('10px')
  })

  it('Add class or classes to an element', () => {
    const element = document.createElement('div')
    UTILS.addClasses(element, 'class1')
    expect(element.classList.length).toEqual(1)
    UTILS.addClasses(element, ['class2', 'class3'])
    expect(element.classList.length).toEqual(3)
  })

  it('Remove class or classes to an element', () => {
    const element = document.createElement('div')
    UTILS.addClasses(element, ['class1', 'class2', 'class3'])
    UTILS.removeClasses(element, 'class1')
    expect(element.classList.length).toEqual(2)
    UTILS.removeClasses(element, ['class2', 'class3'])
    expect(element.classList.length).toEqual(0)
  })

  it.each([
    [UTILS.RulerUnitType.INCHES, 300],
    [UTILS.RulerUnitType.PIXELS, 100],
    [UTILS.RulerUnitType.CENTIMETERS, 300 / 2.54],
    [UTILS.RulerUnitType.MILLIMETERS, 3000 / 25.4],
    [UTILS.RulerUnitType.POINTS, 300],
    [UTILS.RulerUnitType.PICAS, 300],
    [UTILS.RulerUnitType.UNKNOWN, 100],
    ['INCHES', 300],
  ])('Get the default interval length in pixels in 300 dpi', (unit, expected) => {
    expect(UTILS.getDefaultIntervalLengthInPixel(unit, 300)).toEqual(expected)
    expect(UTILS.getDefaultIntervalLengthInPixel(unit)).toEqual(expected)
  })

  it.each([
    [UTILS.RulerUnitType.INCHES, 1],
    [UTILS.RulerUnitType.PIXELS, 100],
    [UTILS.RulerUnitType.CENTIMETERS, 1],
    [UTILS.RulerUnitType.MILLIMETERS, 10],
    [UTILS.RulerUnitType.POINTS, 72],
    [UTILS.RulerUnitType.PICAS, 6],
    [UTILS.RulerUnitType.UNKNOWN, 100],
    ['INCHES', 1],
  ])('Get the default interval step', (unit, expected) => {
    expect(UTILS.getDefaultIntervalStep(unit)).toEqual(expected)
  })

  it.each([
    [UTILS.RulerUnitType.INCHES, 300, 1],
    [UTILS.RulerUnitType.PIXELS, 1, 1],
    [UTILS.RulerUnitType.CENTIMETERS, 1, 2.54 / 300],
    [UTILS.RulerUnitType.MILLIMETERS, 1, 25.4 / 300],
    [UTILS.RulerUnitType.POINTS, 1, 72 / 300],
    [UTILS.RulerUnitType.PICAS, 1, 6 / 300],
    [UTILS.RulerUnitType.UNKNOWN, 1, 1],
    ['INCHES', 300, 1],
  ])('Convert pixel to any unit', (unit, value, expected) => {
    expect(UTILS.pixelsToUnit(value as number, 300, unit).toFixed(2)).toBe(
      (expected as number).toFixed(2)
    )
  })

  it.each([
    [UTILS.RulerUnitType.INCHES, 1, 300],
    [UTILS.RulerUnitType.PIXELS, 300, 300],
    [UTILS.RulerUnitType.CENTIMETERS, 1, 300 / 2.54],
    [UTILS.RulerUnitType.MILLIMETERS, 1, 300 / 25.4],
    [UTILS.RulerUnitType.POINTS, 24, 100],
    [UTILS.RulerUnitType.PICAS, 2, 100],
    [UTILS.RulerUnitType.UNKNOWN, 300, 300],
    ['INCHES', 1, 300],
  ])('Convert any unit to pixeles', (unit, value, expected) => {
    expect(UTILS.toPixel(value as number, 300, unit)).toBe(expected)
  })
})
