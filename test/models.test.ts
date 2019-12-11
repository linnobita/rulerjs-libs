/**
 * @jest-environment jsdom
 */

import * as MODELS from '../src/models'
import { RulerUnitType, CornerAlignment, RulerDirection } from '../src/utils'

describe('Options tests', () => {
  it('Options is instantiable', () => {
    expect(new MODELS.Options()).toBeInstanceOf(MODELS.Options)
  })

  it('Change ruler height to 20', () => {
    const options = new MODELS.Options({ rulerHeight: 20 })
    expect(options.rulerHeight).toBe(20)
  })
})

describe('Corner tests', () => {
  it('Corner is instantiable', () => {
    expect(new MODELS.Corner(new MODELS.Options())).toBeInstanceOf(MODELS.Corner);
  })

  it('Draw a corner', () => {
    const container = document.createElement('div');
    const corner = new MODELS.Corner(new MODELS.Options());
    corner.drawCorner(container, CornerAlignment.LEFT_TOP);

    expect(container.children[0].classList.length).toEqual(2);
    expect(container.children[0].classList[1]).toBe('ljl_rulerjs_corner_lt');
  })

  it('Remove a corner', () => {
    const container = document.createElement('div');
    const corner = new MODELS.Corner(new MODELS.Options());
    corner.drawCorner(container, CornerAlignment.LEFT_TOP);

    corner.destroy();

    expect(container.children.length).toEqual(0);
  })
})

describe('Ruler mark tests', () => {
  it.each([
    [RulerUnitType.INCHES, MODELS.RulerMark.BASE_2_MARK_OFFSETS],
    [RulerUnitType.PIXELS, MODELS.RulerMark.TENTH_MARK_OFFSETS],
    [RulerUnitType.CENTIMETERS, MODELS.RulerMark.TENTH_MARK_OFFSETS],
    [RulerUnitType.MILLIMETERS, MODELS.RulerMark.TENTH_MARK_OFFSETS],
    [RulerUnitType.POINTS, MODELS.RulerMark.BASE_2_MARK_OFFSETS],
    [RulerUnitType.PICAS, MODELS.RulerMark.TENTH_MARK_OFFSETS],
    [RulerUnitType.UNKNOWN, MODELS.RulerMark.TENTH_MARK_OFFSETS]
  ])('Get offset of the mark in any unit', (setUnit, expected) => {
    expect(MODELS.RulerMark.getMarkOffsetsByUnit(setUnit as RulerUnitType)).toBe(expected);
  })

  it('Get offset of the mark in any unit as string', () => {
    expect(MODELS.RulerMark.getMarkOffsetsByUnit('INCHES')).toBe(MODELS.RulerMark.BASE_2_MARK_OFFSETS);
  })
})

describe('Ruler tests', () => {
  it('Ruler is instantiable', () => {
    expect(new MODELS.Ruler(new MODELS.Options())).toBeInstanceOf(MODELS.Ruler);
  })

  it('Draw a ruler', () => {
    const ruler = new MODELS.Ruler(new MODELS.Options());
    ruler.drawRuler(500, 15);
    expect(ruler.length).toBe(1000);
  })

  it('Draw a ruler in vertical', () => {
    const ruler = new MODELS.Ruler(new MODELS.Options(), { direction: RulerDirection.VERTICAL });
    ruler.drawRuler(500, 15);
    expect(ruler.length).toBe(1000);
  })

  it('Draw a ruler with custom mesuring target', () => {
    const ruler = new MODELS.Ruler(new MODELS.Options({ measuringTarget: document.createElement('div') }));
    ruler.drawRuler(500, 15);
    expect(ruler.length).toBe(1000);
  })

  it('Draw a ruler without tracker', () => {
    const ruler = new MODELS.Ruler(new MODELS.Options({ enableMouseTracking: false }));
    ruler.drawRuler(500, 15);
    expect(ruler.length).toBe(1000);
  })

  it('Set unit to a ruler', () => {
    const ruler = new MODELS.Ruler(new MODELS.Options());
    ruler.drawRuler(500, 15);
    ruler.setUnit(RulerUnitType.INCHES);
    expect(ruler.unit.name).toBe(RulerUnitType.INCHES);
  })

  it('Set scale of a ruler', () => {
    const ruler = new MODELS.Ruler(new MODELS.Options());
    ruler.drawRuler(500, 15);
    ruler.setScale(2);
    expect(ruler.scale).toBe(2);
  })

  it('Set color to a ruler', () => {
    const ruler = new MODELS.Ruler(new MODELS.Options());
    ruler.drawRuler(500, 15);
    ruler.setColor('#008000');
    expect(ruler.context.fillStyle).toBe('#008000');
  })

  it('Set dpi to a ruler unit', () => {
    const ruler = new MODELS.Ruler(new MODELS.Options());
    ruler.drawRuler(500, 15);
    ruler.setDPI(72);
    expect(ruler.unit.dpi).toBe(72);
  })
})

describe('Guideline tests', () => {
  it('Guideline is instantiable', () => {
    expect(new MODELS.GuideLine(new MODELS.Options())).toBeInstanceOf(MODELS.GuideLine);
  })

  it('Create a vertical guideline', () => {
    const guideline = new MODELS.GuideLine(new MODELS.Options(), { direction: RulerDirection.VERTICAL });
    expect(guideline.direction).toBe(RulerDirection.VERTICAL);
  })

  it('Start moving the guideline', () => {
    const guideline = new MODELS.GuideLine(new MODELS.Options());
    const mouseMove = new Event('mouseMove');

    guideline.line.dispatchEvent(mouseMove);

    guideline.startMoving(mouseMove as MouseEvent);

    expect(guideline.line.className.indexOf('ljl_rulerjs_line_dragged')).toBeGreaterThan(-1);
    expect(guideline.line.className.indexOf('ljl_rulerjs_tooltip')).toBeGreaterThan(-1);
  })

  it('Stop moving the guideline', () => {
    const guideline = new MODELS.GuideLine(new MODELS.Options());
    guideline.stopMoving();

    expect(guideline.line.className.indexOf('ljl_rulerjs_line_dragged')).toBe(-1);
  })

  it('Hide the guideline', () => {
    const guideline = new MODELS.GuideLine(new MODELS.Options());
    guideline.hide();

    expect(guideline.line.style.display).toBe('none');
  })

  it('Show the guideline', () => {
    const guideline = new MODELS.GuideLine(new MODELS.Options());
    guideline.show();

    expect(guideline.line.style.display).toBe('block');
    guideline.show('inline');
    expect(guideline.line.style.display).toBe('inline');
  })
})

describe('Unit tests', () => {
  it('Unit is instantiable', () => {
    expect(new MODELS.RulerUnit()).toBeInstanceOf(MODELS.RulerUnit)
  })

  it('Change default dpi to 400', () => {
    const unit = new MODELS.RulerUnit({ dpi: 400 })
    expect(unit.dpi).toBe(400)
  })

  it('Set unit to inch', () => {
    const unit = new MODELS.RulerUnit()
    unit.setUnit(RulerUnitType.INCHES)
    expect(unit.name).toBe(RulerUnitType.INCHES)
  })

  it('Convert 300 px in 300 dpi to 1 inch', () => {
    const unit = new MODELS.RulerUnit({ value: 300 })
    expect(unit.toUnit(RulerUnitType.INCHES)).toBe(1)
  })

  it('Convert unrecognized unit', () => {
    const unit = new MODELS.RulerUnit({ value: 300 })
    expect(unit.toUnit(-2)).toBe(300)
  })

  it.each([
    [RulerUnitType.INCHES, 'in'],
    [RulerUnitType.PIXELS, 'px'],
    [RulerUnitType.CENTIMETERS, 'cm'],
    [RulerUnitType.MILLIMETERS, 'mm'],
    [RulerUnitType.POINTS, 'pt'],
    [RulerUnitType.PICAS, 'p'],
    [RulerUnitType.UNKNOWN, 'px'],
  ])('Get formatted short name', (setUnit, expected) => {
    const unit = new MODELS.RulerUnit()
    unit.setUnit(setUnit as RulerUnitType)
    expect(unit.getFormattedName(true)).toBe(expected)
  })

  it.each([
    [RulerUnitType.INCHES, 'Inches'],
    [RulerUnitType.PIXELS, 'Pixels'],
    [RulerUnitType.CENTIMETERS, 'Centimeters'],
    [RulerUnitType.MILLIMETERS, 'Millimeters'],
    [RulerUnitType.POINTS, 'Points'],
    [RulerUnitType.PICAS, 'Picas'],
    [RulerUnitType.UNKNOWN, 'Pixels'],
  ])('Get formatted full name', (setUnit, expected) => {
    const unit = new MODELS.RulerUnit()
    unit.setUnit(setUnit as RulerUnitType)
    expect(unit.getFormattedName()).toBe(expected)
  })
})
