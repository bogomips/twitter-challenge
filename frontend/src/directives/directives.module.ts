import { NgModule } from '@angular/core';
import { HighlightDirective } from './highlight/highlight';
import { LinkRenderDirective } from './link-render/link-render';
@NgModule({
	declarations: [HighlightDirective,
    LinkRenderDirective],
	imports: [],
	exports: [HighlightDirective,
    LinkRenderDirective]
})
export class DirectivesModule {}
