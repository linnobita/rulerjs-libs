# rulerjs-libs

[![Travis](https://img.shields.io/travis/linnobita/rulerjs-libs.svg)](https://travis-ci.org/linnobita/rulerjs-libs) [![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE) [![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier) [![Dev Dependencies](https://david-dm.org/linnobita/rulerjs-libs/dev-status.svg)](https://david-dm.org/linnobita/rulerjs-libs?type=dev) [![npm version](https://img.shields.io/npm/v/rulerjs-libs.svg)](https://www.npmjs.com/package/rulerjs-libs)

A typeScript library for [ruler.js](https://github.com/MrFrankel/ruler)

## Background

`rulerjs-libs` is the typescript library for [ruler.js](https://github.com/MrFrankel/ruler) and designed for easily using in Angular porjects or Vue.js projects.

## Installation

### npm

```bash
npm install rulerjs-libs --save
```

Add `rulerjs-libs.scss` to your main scss file

```scss
@import "rulerjs-libs/dist/rulerjs-libs.scss";
```

Add a `div` as the container to your page

```html
<div id="RulerWrapper"></div>
```

Add `RulerjsLib` and `Options` to your component

```typescript
import { RulerjsLib } from 'rulerjs-libs';
import { Options } from 'rulerjs-libs/dist/types/models';

const options = new Options();
options.container = document.getElementById('RulerWrapper') as HTMLElement;
const myRuler = new RulerjsLib(options);
```

## Functions

Change the unit for the rulers. Default is `RulerUnitType.PIXELS`

```typescript
...
import { RulerUnitType } from 'rulerjs-libs/dist/types/utils';
...

...
myRuler.setUnit(RulerUnitType.INCHES);
...
```

Change the theme of the rulers. Default is `RulerTheme.LIGHT_THEME`

```typescript
...
import { RulerTheme } from 'rulerjs-libs/dist/types/utils';
...

...
myRuler.setTheme(RulerTheme.DARK_THEME);
...
```

Change the scale of the rulers to match measure target scale in current unit

```typescript
...
myRuler.setScale(2);
...
```

## API

### Options

The options for generating rulers

```typescript
container // The container for rulers
measuringTarget default: null // Optional. If your measure target has different size from the container
rulerHeight default: 15 // The height of the ruler
fontFamily default: 'arial' // The font family for the display texts
fontSize default: 8 // The font size of the display texts
fontColor default: '#333' // The font color of the display texts
strokeStyle default: 'gray' // The stroke style for the rulers
rulerAlignments default: [RulerAlignment.TOP, RulerAlignment.LEFT] // The positions of rulers
conerAlignments default: [CornerAlignment.LEFT_TOP] // The positions of corners
lineWidth default: 1 // The line width for the context
enableMouseTracking default: true // Is showing the mouse trackers
enableTooltip default: true // Is showing the tooltip
```

## Todo List

+ Set custom start point of the ruler other than (0, 0)
+ Show negative values when start point is not at (0, 0)
