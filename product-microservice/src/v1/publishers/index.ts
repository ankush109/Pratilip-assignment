import amqp  from "amqplib"

export async function publishEvent(event: any, eventType: string) {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    
    const exchange = 'events_exchange'; // Define an exchange
    const routingKey = eventType; // Use the event type as the routing key

    await channel.assertExchange(exchange, 'direct', { durable: true });

    channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(event)));
    console.log(`Event published: ${eventType}`, event);

    await channel.close();
    await connection.close();
}

