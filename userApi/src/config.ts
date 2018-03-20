
const config:any = {
  startupDelay: 12000,
  server: {
    address:'localhost',
    port:8081,
    cors: {
      allowedHeaders:'Origin, Content-Type, Authorization',
      allowedMethods:'GET,PUT,POST,DELETE,PATCH'
    },    
    ssl: {
      cert: '/path/fullchain.pem',
      privkey: '/path/privkey.pem',
      active:false
    }
  },
  api: {
    prefix: '/v1'
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
        capped:false,
        cappedDocsLimit:101,
        cappedSizeLimit: 2048000,
        indexes: [
        //  [{id:1}, {unique:true}]
        ]                
      }        
    }
  },
  elasticsearch: {
    host: 'elasticsearch',
    syncTime:3000,
    index:'twitter',
    type:'tweets',
    search: {
      size:100
    }
  },
  
};

export default config;