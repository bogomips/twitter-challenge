import { Directive, ElementRef, Renderer,  AfterViewInit } from '@angular/core';

@Directive({
  selector: '[link-render]' 
})
export class LinkRenderDirective implements AfterViewInit{

  constructor(private elementRef: ElementRef, private renderer: Renderer) { }

  ngAfterViewInit() {
    
    let html = this.elementRef.nativeElement.innerHTML;

    const regexHttp = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi);
    const linkArray = html.match(regexHttp);

    if (linkArray) {
      linkArray.map((l)=>{
        let regex = new RegExp(l,'ig');
        html = html.replace(regex, `<a href="${l}">${l}</a>`);
      })
    }

    const regexUsers = new RegExp(/\@[a-zA-Z0-9_]{1,15}/gi);
    const userArray = html.match(regexUsers);
    
    if (userArray) {
      userArray.map((u)=>{
        let regex = new RegExp(u,'ig');      
        let ul = u.replace('@','');  
        html = html.replace(regex, `<a class="nickname" href="https://twitter.com/${ul}">${u}</a>`);
      })
    }

    this.renderer.setElementProperty(this.elementRef.nativeElement, 'innerHTML', html);
  }
}
