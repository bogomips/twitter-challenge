import config from 'config';
//import dbApi from 'dbApi';
import { jcompose } from 'helpers/jcompose';
//import * as _ from 'lodash';

const root_get = async (ctx) => { 
      
  ctx.status = 200;
  ctx.body = jcompose(ctx.status,{},'welcome to the jungle');

};

export default root_get;
