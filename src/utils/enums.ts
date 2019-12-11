export enum RulerAlignment {
  LEFT = 'left',
  TOP = 'top',
  RIGHT = 'right',
  BOTTOM = 'bottom'
}

export enum CornerAlignment {
  LEFT_TOP = 'lt',
  LEFT_BOTTOM = 'lb',
  RIGHT_TOP = 'rt',
  RIGHT_BOTTOM = 'rb'
}

export enum RulerTheme {
  DARK_THEME = 'dark',
  LIGHT_THEME = 'light'
}

export enum RulerDirection {
  VERTICAL,
  HORIZONTAL
}

export enum RulerUnitType {
  UNKNOWN = -1,
  PIXELS = 0,
  INCHES = 1,
  CENTIMETERS = 2,
  MILLIMETERS = 3,
  POINTS = 4,
  PICAS = 5,
  PERCENT = 6
}
