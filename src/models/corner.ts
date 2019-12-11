import { IOptions } from '.'
import { addClasses, pixelize, CornerAlignment } from '../utils'

export class Corner {
  public corner: HTMLElement;

  private options: IOptions;

  constructor(options: IOptions) {
    this.corner = document.createElement('div');
    this.options = options;
  }

  public drawCorner(container: HTMLElement, side: CornerAlignment): void {
    const cornerStyle = 'rulerjs_corner_' + side;
    const cornerDom = document.createElement('div');
    cornerDom.title = 'Clear Guide Lines';
    addClasses(cornerDom, ['rulerjs_corner', cornerStyle]);
    cornerDom.style.width = pixelize(this.options.rulerHeight - 1);
    cornerDom.style.height = pixelize(this.options.rulerHeight);
    this.corner = container.appendChild(cornerDom);
  }

  public destroy() {
    this.corner.parentNode && this.corner.parentNode.removeChild(this.corner);
  }
}
