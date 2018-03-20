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

    elasticsearchObj.state.client.ping({      
      requestTimeout: 3000
    }, (error) => {

      if (error) 
        console.trace('Elasticsearch -> Cannot send ping');
      else 
        elasticsearchObj.state.connected=true;        
      
    });
    
  }
  catch(e) {
    console.log("elasticsearch.connect -> ",e);
  }
  
}


elasticsearchObj.bulkIndex = async (bodyArray) => {

  try {
    const res = await elasticsearchObj.state.client.bulk({
      body:bodyArray
    })
  }
  catch(e) {
    console.log("Elastic search -> bulkIndex error:  ",e);
  }

}

elasticsearchObj.resetIndex = async (index) => {

  try {
    return await elasticsearchObj.state.client.deleteByQuery({
      index: index      
    });
  }
  catch(e) {
    console.log("Elastic search -> resetIndex error:  ",e);
  }

}

elasticsearchObj.search = async (_index,_type,_body) => {

  try {    

    return elasticsearchObj.state.client.search({
      index: _index,
      type: _type,
      body: _body,
      filter_path:'hits.hits._source'
      
    });

  }
  catch(e) {
    console.log("Elastic search -> search error:  ",e);
  }

}

export default elasticsearchObj;
