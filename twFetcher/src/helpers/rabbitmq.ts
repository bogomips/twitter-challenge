import * as amqp from 'amqplib';
import * as _ from 'lodash';
import config from 'config';

const rabbitmq:any = {  
	state:{
    connected:false,
    channel:null,
		//collections:[]
	}
};

rabbitmq.connect = async () => {

  try {

    const amqpConn = await  amqp.connect(`amqp://${config.rabbitmq.host}`);
    rabbitmq.state.connected = true;    
    rabbitmq.state.channel = await amqpConn.createChannel();          
    rabbitmq.state.channel.assertExchange(config.rabbitmq.channel, 'fanout', {durable: false});                    

  }
  catch(e) {
    console.log("Rabbitmq.connect -> ",e);
  }
  
}

rabbitmq.publish = (payload) => {  
  rabbitmq.state.channel.publish(config.rabbitmq.channel, '',  Buffer.from(JSON.stringify(payload)));
}

export default rabbitmq;
