import * as elasticsearch  from 'elasticsearch';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import config from 'config';

const elasticsearchObj:any = {  
	state:{
    connected:false,    
		client:null
	}
};

elasticsearchObj.connect = async () => {

  try {
        
    elasticsearchObj.state.client = new elasticsearch.Client({
      host: config.elasticsearch.host+':9200',
      //log: 'trace'
    });     

    const indexExists = await elasticsearchObj.state.client.indices.exists({
      index:config.elasticsearch.index
    });
    
    if (!indexExists) {
      await elasticsearchObj.state.client.indices.create({
        index:config.elasticsearch.index
      });

      const map = {
        index: config.elasticsearch.index,   
        type: config.elasticsearch.type,         
        body: config.elasticsearch.mapping              
      };

      await elasticsearchObj.state.client.indices.putMapping(map);
    }
    
    elasticsearchObj.state.connected=true;            
  }
  catch(e) {
    console.log("elasticsearch.connect -> ",e);
  }
  
}


elasticsearchObj.bulkIndex = async (bodyArray) => {

  if (!elasticsearchObj.state.connected) {
    await elasticsearchObj.connect();
    return;
  }

  try {
      
    const res = await elasticsearchObj.state.client.bulk({
      body:bodyArray
    });
     
  }
  catch(e) {
    console.log("Elastic search -> bulkIndex error:  ",e);
  }

}

elasticsearchObj.resetIndex = async (index) => {

  if (!elasticsearchObj.state.connected) {
    await elasticsearchObj.connect();    
    return;
  }
        
  try {
    const res = await elasticsearchObj.state.client.deleteByQuery({
      index: index      
    });
    
  }
  catch(e) {
    console.log("Elastic search -> resetIndex error:  ",e);
  }

}

export default elasticsearchObj;
