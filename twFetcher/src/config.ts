
const config:any = {

  startupDelay: 12000,
  twitter: {
    credentials: {
      apiKey:null,
      apiSecret:null
    },
    search: {
      //query:'#meinunterricht',
      query:'#blockchain',
      result_type:'recent',
      count:100,
      fetchInterval:3000
    }
  },

  mongo: {    
    host:'mongoStorage',
    port:27017,
    dbNames:{
      main:'klabChallange',      
    },
    tables: {
      tweets: {
        name:'tweets',
        capped:true,
        cappedDocsLimit:101,
        cappedSizeLimit: 2048000,
        indexes: [
           [{id:1}, {unique:true}]
        ]        
        
      }        
    }
  },

  elasticsearch: {
    host: 'elasticsearch',
    syncTime:3000,
    index:'twitter',
    type:'tweets',
    mapping: {
      properties: {              
        created_at: {
          format: "EEE MMM dd HH:mm:ss Z YYYY",
          type: "date",       
        }          
      }
    }
  },

  /*rabbitmq: {
    host: 'rabbitmq',
    channel: 'twitts'
  }*/

};

export default config;
