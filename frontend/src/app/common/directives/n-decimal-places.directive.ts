import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appNDecimalPlaces]',
})
export class NDecimalPlacesDirective {
  @Input() appNDecimalPlaces: number | undefined = 2;

  private specialKeys: string[] = ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete'];

  constructor(private elementRef: ElementRef<HTMLInputElement>) {}

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // Allow Backspace, tab, end, and home keys
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }

    // Allow decimal numbers and negative values
    const regex: RegExp = new RegExp('^\\d*\\.?\\d{0,' + this.appNDecimalPlaces + '}$');

    const currentValue: string = this.elementRef.nativeElement.value;
    const cursorPosition = this.elementRef.nativeElement.selectionStart || 0;
    const nextValue: string = [
      currentValue.slice(0, cursorPosition),
      event.key == 'Decimal' ? '.' : event.key,
      currentValue.slice(cursorPosition),
    ].join('');
    if (nextValue && !String(nextValue).match(regex)) {
      event.preventDefault();
    }
  }
}
