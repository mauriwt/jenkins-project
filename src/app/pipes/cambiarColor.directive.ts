import { Directive, ElementRef, Renderer2, HostListener } from '@angular/core';

@Directive({
  selector: '[appCambiarColor]',
})

export class CambiarColorDirective {
  constructor(private elementRef: ElementRef, private renderer: Renderer2) {
  }

  setBgColor(color: string) {
    this.renderer.setStyle(
      this.elementRef.nativeElement,
      'color',
      color
    );
  }

  @HostListener('mouseover') onMouseOver() {
    this.setBgColor('#f5a623');
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.setBgColor('black');
  }
}
