import 'app-module-path/register';
import config from 'config';
import { tw } from 'helpers/tw';
import mongo from 'helpers/mongo';
//import rabbitmq from 'helpers/rabbitmq';
import { Observable } from 'rxjs/Observable';
import elasticsearch from 'helpers/elasticsearch';


const startMsg = `
*************************************************************
Launched at ${new Date()}
Env: ${process.env.NODE_ENV}
*************************************************************\n\n`;

const main = async () => {

  await mongo.connect();
  await elasticsearch.connect();
  
  //await rabbitmq.connect();
  
  tw.fetch().subscribe(async (tweets:any) => { 
        
    console.log("Trying to insert titts... ",tweets.statuses.length);
    
    //I can assume tweets.status is always present and it is an Array,  the Observer sends tweets only if 'statuses' in tweets === true    
    if (tweets.statuses.length) {
            
      //rabbitmq.publish(JSON.stringify(tweets.statuses));
      //rabbitmq.publish(tweets.statuses);

      try {                
        await mongo.insertMany(config.mongo.tables.tweets.name,tweets.statuses,false);
      }
      catch(e) {

        //if (e.code == 11000)
        //console.log("Insert skipped: tweets",);        
      }

    }

  });

  setInterval(async ()=>{
    
    let mtweet_cur = await mongo.getDocs(config.mongo.tables.tweets.name);
    /*Since the collections is always 100 I don't need to loop over the cursors, I just put everything in array*/
    let mtweet = await mtweet_cur.toArray();
    let toEsIndex = mtweet.reduce((p,c,i,t)=> p.push({ index:  { _index: config.elasticsearch.index, _type: config.elasticsearch.type, _id: c.id } }, {id:c.id,text:c.text,created_at:c.created_at}) && p,[]);    
    await elasticsearch.resetIndex(config.elasticsearch.index);
    await elasticsearch.bulkIndex(toEsIndex);
    
  },config.elasticsearch.syncTime)

}

if (!config.twitter.credentials.apiKey || !config.twitter.credentials.apiSecret) {
    console.error("You MUST set config.twitter.credentials.apiSecret and config.twitter.credentials.apiKey");
    process.exit(1);
}

setTimeout(()=>{

  main().then(()=>{
    console.log(startMsg);
  })

},config.startupDelay);







