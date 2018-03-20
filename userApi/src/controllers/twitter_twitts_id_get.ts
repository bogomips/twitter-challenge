
import * as _get from 'lodash/get';
import config from 'config';
import mongo from 'helpers/mongo';
import { jcompose } from 'helpers/jcompose';

const twitter_twitts_id_get = async (ctx) => { 
          
  try {
            
    if (/^\+?\d+$/.test(ctx.params.id)) {
      
      const tweetId = Number(ctx.params.id);
      const tweet = await mongo.getDoc(config.mongo.tables.tweets.name,{id:tweetId});

      ctx.status = (tweet) ? 200 : 404;
      ctx.body = jcompose(ctx.status,tweet);

    }
    else {
      ctx.status = 400;
      ctx.body = jcompose(ctx.status,null,'The request is not well formed');
    }
        
  }
  catch(e) {
    ctx.body = jcompose(500); 
  }

};

export default twitter_twitts_id_get;
