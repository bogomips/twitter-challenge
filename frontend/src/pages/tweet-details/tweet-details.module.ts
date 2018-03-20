import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TweetDetailsPage } from './tweet-details';

import { DirectivesModule } from '../../directives/directives.module';

@NgModule({
  declarations: [
    TweetDetailsPage,
  ],
  imports: [
    DirectivesModule,
    IonicPageModule.forChild(TweetDetailsPage),
  ],
})
export class TweetDetailsPageModule {}
