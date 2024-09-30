import amqp from "amqplib"
export async function consumeEvent(eventType: string) {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    const exchange = 'events_exchange';
    const queue = `queue_${eventType}`; // Unique queue for each event type

    await channel.assertExchange(exchange, 'direct', { durable: true });
    await channel.assertQueue(queue, { durable: true });
    
    // Bind queue to the exchange with a routing key
    await channel.bindQueue(queue, exchange, eventType);

    // Consume messages from the queue
    channel.consume(queue, (message) => {
        if (message) {
            const event = JSON.parse(message.content.toString());
            console.log(`Event received: ${eventType}`, event);

            // Acknowledge the message
            channel.ack(message);
        }
    });

    console.log(`Listening for ${eventType} events...`);
}