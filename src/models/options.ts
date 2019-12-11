import { IOptions } from "./interfaces";
import { CornerAlignment, RulerAlignment } from "../utils";

export class Options implements IOptions {
  public container: HTMLElement;
  public measuringTarget: HTMLElement | null;
  public rulerHeight: number;
  public fontFamily: string;
  public fontSize: number;
  public fontColor: string;
  public strokeStyle: string;
  public rulerAlignments: Array<RulerAlignment>;
  public conerAlignments: Array<CornerAlignment>;
  public lineWidth: number;
  public enableMouseTracking: boolean;
  public enableTooltip: boolean;

  constructor(options?: Partial<IOptions>) {
      this.container = document.createElement('div');
      this.measuringTarget = null;
      this.rulerHeight = 15;
      this.fontFamily = 'arial';
      this.fontSize = 8;
      this.fontColor = '#333';
      this.strokeStyle = 'gray';
      this.rulerAlignments = [RulerAlignment.TOP, RulerAlignment.LEFT];
      this.conerAlignments = [CornerAlignment.LEFT_TOP];
      this.lineWidth = 1;
      this.enableMouseTracking = true;
      this.enableTooltip = true;

      this.assign(options);
  }

  private assign(options: Partial<IOptions> = {}) {
      for (const option in options) {
          (this[option as keyof Options] as any) = options[option as keyof IOptions];
      }
  }
}
