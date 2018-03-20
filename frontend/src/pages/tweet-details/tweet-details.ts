import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApisProvider } from '../../providers/apis/apis';

@IonicPage({
  segment:'tweet-details/:id',
})
@Component({
  selector: 'page-tweet-details',
  templateUrl: 'tweet-details.html',
})
export class TweetDetailsPage {

  tweet;
  loading:boolean=true;

  constructor(public navCtrl: NavController, public navParams: NavParams,public apis:ApisProvider) {
  }
 
  async ionViewDidEnter() {
    
    this.loading=true;
    const id = this.navParams.get('id');
    
    if (id) {

      const tweetRes = await this.apis.call({method:'get',url:`twitter/tweets/${id}`}).toPromise();       

      if ( tweetRes.status == 200 ) {  
        this.tweet = tweetRes['body'].data;  
        //console.log(this.tweet);
      }
      
       this.loading=false;          
    }

  }

  goToProfile() {

    if (this.tweet)
      window.open('https://twitter.com/'+this.tweet.user.screen_name);
  }

}
