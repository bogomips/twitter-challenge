import { Directive, ElementRef, Renderer, Input, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[highlight]'
})
export class HighlightDirective implements AfterViewInit {
  @Input() search: string;
  
  constructor(private elementRef: ElementRef, private renderer: Renderer) { }

  ngAfterViewInit() {
    
    let html = this.elementRef.nativeElement.innerHTML;
    
    if (this.search) {
      const regex = new RegExp(this.search,'gi');      
      html = html.replace(regex, `<span class="highlight">${this.search}</span>`);            
    }
           
    this.renderer.setElementProperty(this.elementRef.nativeElement, 'innerHTML', html);

  }

  
}