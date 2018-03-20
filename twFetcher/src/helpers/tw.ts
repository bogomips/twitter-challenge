import * as request from 'request-promise-native';
import * as twitter from 'twitter-lite';
import  * as _get  from 'lodash/get';
import  * as  differenceInMilliseconds from 'date-fns/difference_in_milliseconds'
import { Observable } from 'rxjs/Observable';
import { retryWhen, delayWhen } from 'rxjs/operators';
import { timer } from 'rxjs/observable/timer';


import config from 'config';

interface TwHelper {
  init:Function,
  getToken:Function,
  fetch:Function,
  twClient:twitter
}

const tw:TwHelper={};

const _getAuthToken = async () => {  

  try {

    const encoded_secret = new Buffer(`${config.twitter.credentials.apiKey}:${config.twitter.credentials.apiSecret}`).toString('base64');

    const requestOpts = {
      url: 'https://api.twitter.com/oauth2/token',
      headers: {
        'Authorization': `Basic ${encoded_secret}`,
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
      body: 'grant_type=client_credentials'
    };

    const responsePlain = await request.post(requestOpts);
    return JSON.parse(responsePlain);
  }

  catch(e) {
    
    switch (e.statusCode) {
      case 403:
        console.log('Error 403, Please check the twitter setting in your config file');
      break;
    }

    return e.statusCode;

  }

}

const _setTwClient = async () => {

  const token = await _getAuthToken();

  if (token) {
    
    tw.twClient =  new twitter({
      subdomain: 'api',    
      bearer_token: token.access_token
    });

    return true;
  }

  return null;

}

tw.init = async () => {   
  return (!tw.twClient) ? await _setTwClient() : true;  
}

const fetchIntervalCalculator = async () => { 

  const searchLimits = await tw.twClient.get('application/rate_limit_status', {resources: 'search'});
  console.log("Limits ->",JSON.stringify(searchLimits));
  const remainingQuery = Number(_get(searchLimits,'resources.search["/search/tweets"].remaining'));
  const nextReset = Number(_get(searchLimits,'resources.search["/search/tweets"].reset'))*1000;      

  if (remainingQuery) {

    const reqWindowMs = differenceInMilliseconds(nextReset,new Date());
    let FetchIntervalMin = Math.ceil(1/(remainingQuery/reqWindowMs))+100;
    
    /*do I really need updates under the second?*/
    if (FetchIntervalMin < 1000) 
      FetchIntervalMin=1000;
        
    const FetchInterval = (config.twitter.search.fetchInterval >= FetchIntervalMin) ? config.twitter.search.fetchInterval : FetchIntervalMin;
    console.log("Fetch Interval -> ",FetchInterval);
    return (remainingQuery > 0) ? {interval:FetchInterval} : {nextAttempt:reqWindowMs+1500};
      
  }

  return {nextAttempt: 120000};
}

const startFetchCycle = () => { 

  return Observable.create(async (observer:any) => {

    const fetchIntervalObj = await fetchIntervalCalculator();
    const fetchInterval =  _get(fetchIntervalObj,'interval');

    if (fetchInterval) {
      const intervalId = setInterval(async ()=>{
        
        let searchResults = await tw.twClient.get('search/tweets', {q: config.twitter.search.query, result_type:config.twitter.search.result_type, count:config.twitter.search.count});

        if ('statuses' in searchResults) {            
          observer.next(searchResults);    	  					            
        }
        else
          observer.error(120000);
        
          
      },fetchInterval);
    }
    else {
      const nextAttempt = _get(fetchIntervalObj,'nextAttempt');            
      observer.error(nextAttempt);
    }
        
  }).pipe(
    retryWhen(errors =>      
      errors.pipe(        
        delayWhen(val => timer(val))
      )
    )
  );
  
}

tw.fetch = ():Observable<any> => {
      
  return Observable.create(async (observer:any) => {

    if (await tw.init()) {  

      startFetchCycle().subscribe(searchResults => {        
        observer.next(searchResults)
      });
                                    
    }
    
  });
}

export { tw };
