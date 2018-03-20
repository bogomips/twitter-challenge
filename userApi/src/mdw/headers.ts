import config from 'config';

const headers =  async (ctx, next) => {
  
  ctx.set({    
    'Access-Control-Allow-Origin': '*',    //TODO     
    'Access-Control-Allow-Methods': config.server.cors.allowedMethods,
    'Access-Control-Allow-Headers': config.server.cors.allowedHeaders,    
  });

  await next()
}

export default headers;
