import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ApisProvider } from '../../providers/apis/apis';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  searchbarModel;
  tweets:Array<any>=[];
  loading:boolean=false;

  constructor(public navCtrl: NavController,public apis:ApisProvider) {

  }

  async ionViewDidEnter() {
    this.searchTweets();    
  }

  async searchTweets() {    

    this.loading=true;
    this.tweets=[];
    const paramsObj = {};

    if (this.searchbarModel)      
      paramsObj['q']= this.searchbarModel;

    const tweetsRes = await this.apis.call({method:'get',url:'search',paramsObj:paramsObj}).toPromise(); 
    this.loading=false;
    
    if ( tweetsRes.status == 200 ) {  
      this.tweets = tweetsRes['body'].data;      
    }
    
  }

  getDetails(id:string) {          
    this.navCtrl.push('TweetDetailsPage', {id:id});                  
  }
}
