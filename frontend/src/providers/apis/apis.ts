import { Injectable } from '@angular/core';
import { HttpClient,HttpParams, HttpRequest } from '@angular/common/http';
import { of } from 'rxjs/observable/of';
import { catchError } from 'rxjs/operators/catchError';

interface ItemsResponse {
  body: any,
  status:string
}

interface ConfigCall {
  method:string,
  url?:string,
  final_url?:string,
  progress?:boolean,
  body?:object,
  paramsObj?:object,
  headersObj?:object  
  responseType?:string
}

@Injectable()
export class ApisProvider {

  api_base;

  constructor(public http: HttpClient) {  
            
      const port = 8081;      
      this.api_base = `http://localhost:${port}/v1/`;      
     
  }

  call(config:ConfigCall) { 

    let { url, final_url, body, method, paramsObj,headersObj,progress,responseType } = config;

    let reqOptObj={};

    if (paramsObj) {

      let httpParams = new HttpParams();
      for (let prop in paramsObj) {        
        httpParams = httpParams.append(prop, paramsObj[prop]);   
      }

      reqOptObj['params'] = httpParams;
    }

    if (headersObj) {           
    }

    if (progress)
      reqOptObj['reportProgress'] = true;

    if (responseType)
      reqOptObj['responseType'] = responseType;

    const  _final_url = (url) ? this.api_base+url : final_url;
    const req = new HttpRequest(method, _final_url, body, reqOptObj);

    return this.http.request<ItemsResponse>(req).pipe(      
      catchError(error =>of(error))
    );                   
    
  }
}
