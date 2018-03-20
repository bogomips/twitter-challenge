import config from 'config';
import { MongoClient } from 'mongodb';
import * as _ from 'lodash';

const mongo:any = {
  dbName:null,
  dbNames:null,
	state:{
    connected:false,
    connRef:null,
		//collections:[]
	}
};

mongo.connect = async () => {

	const {host,port,dbNames} = config.mongo;

	if  (!mongo.state.connected) {	

		try {			      
      
      mongo.state.connRef = await MongoClient.connect(`mongodb://${host}:${port}`);      						      
      mongo.dbName = dbNames.main; //set the first db as default			
			mongo.state.connected=true;
      
      const collections = Object.keys(config.mongo.tables).map((key)=>config.mongo.tables[key]);			
      
      console.log(`************************************************************* \ndb name -> ${Object.keys(dbNames)}`);
      for (let collection of collections) {

        console.log('\nCollection -> ',collection.name);
        console.log('Indexes ->');

        if (collection.capped) {
          //await mongo.createCapped(config.mongo.tables.tweets.name,config.mongo.tables.tweets.cappedSizeLimit,config.mongo.tables.tweets.capped.docsLimit);
          await mongo.state.connRef.db(mongo.dbName).createCollection(config.mongo.tables.tweets.name, { 
            capped : true, 
            size : config.mongo.tables.tweets.cappedSizeLimit, 
            max : config.mongo.tables.tweets.cappedDocsLimit 
          });
        }
        
        for (let index of collection.indexes) {                                        
          mongo.state.connRef.db(mongo.dbName).collection(collection.name).createIndex.apply(mongo.state.connRef.db(mongo.dbName).collection(collection.name),index);      
        }        
      }
      console.log(`************************************************************* \n`);
			            
			//if (process.env.NODE_ENV != 'test')  				

		}
		catch(e) {			
			throw new Error(e);
		}
			
	} else
		console.log('already connected');	
};


mongo.getDoc = async (collection:string, searchObj,projectObj) =>  mongo.state.connRef.db(mongo.dbName).collection(collection).findOne(searchObj,projectObj);





export default mongo;
