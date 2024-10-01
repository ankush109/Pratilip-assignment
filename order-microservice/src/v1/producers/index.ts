import amqp  from "amqplib"

export async function publishEvent(eventData: any, eventType: string) {
    const connection = await amqp.connect('amqp://guest:guest@rabbitmq:5672');
    const channel = await connection.createChannel();
    
    const exchange = 'events'; 

    await channel.assertExchange(exchange, 'fanout', { durable: false });

    const message = JSON.stringify({eventType,data:eventData})
    channel.publish(exchange,'',Buffer.from(message))
    console.log(`Published event: ${eventType}`);
    await channel.close();
    await connection.close();
}

