import config from 'config';
import * as _ from 'lodash';
//import util from 'util';

interface JcomposeResponse {
  status:string,
  code:number,
  data:any,
  message?:string
}

const jcompose = (code,data,message?) => {

  const response:JcomposeResponse = {
    status:'',
    code:code,
    data:data,        
  };

  if (message)
      response.message=message;
  
  if (code < 600 && code >= 500) 
    response.status='error';
  else 
    response.status = (code < 300 && code >= 200) ? 'success' : 'fail';          
    
  return response;
}

export { jcompose }