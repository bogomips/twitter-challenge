
import * as _get from 'lodash/get';
import config from 'config';
import elasticsearch from 'helpers/elasticsearch';
import { jcompose } from 'helpers/jcompose';

const search_get = async (ctx) => { 
      
  const _query = _get(ctx.request.query,'q');

  let _queryBody = {
    sort: [
      { created_at: {order : "desc"}},
    ],
    size: config.elasticsearch.search.size                 
  }

  if (_query) {

   _queryBody['query'] = {      
      match_phrase: {
        text: _query
      }          
    }

  }

  try {

    const esRes = await elasticsearch.search('twitter','tweets',_queryBody);
    const docs = _get(esRes,'hits.hits') || [];    
    ctx.status = 200; //(docs) ? 200 : 204;
    ctx.body = jcompose(ctx.status, docs);
    
  }
  catch(e) {
    ctx.status = 500;
    ctx.body = jcompose(ctx.status,e);
  }
};

export default search_get;
