import { PrismaClient } from "@prisma/client";
import amqp from "amqplib";
const prisma = new PrismaClient();
export async function consumeEvent(eventType: string) {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  const exchange = "events_exchange";
  const queue = `queue_${eventType}`;

  await channel.assertExchange(exchange, "direct", { durable: true });
  await channel.assertQueue(queue, { durable: true });

  await channel.bindQueue(queue, exchange, eventType);

  channel.consume(queue, (message) => {
    if (message) {
      const event = JSON.parse(message.content.toString());
      handleEvent(event);

      channel.ack(message);
    }
  });

  console.log(`Listening for ${eventType} events...`);
}
async function handleEvent(event: { eventType: string; eventData: any }) {
  switch (event.eventType) {
    case "user_profile_updated":
      console.log(
        `Handling user registration for userId: `,
        event.eventData.userId
      );
      const order = await prisma.order.findFirst({
        where: {
          userId: event.eventData.userId,
        },
      });
      console.log(order, "order .. .");
      if (order) {
        await prisma.order.update({
          where: {
            id: order.id,
          },
          data: {
            shippingAddress: event.eventData.shippingAddress,
            pincode: event.eventData.pincode,
            city: event.eventData.city,
            phoneNumber: event.eventData.phoneNumber,
            country: event.eventData.country,
          },
        });
      }
      break;

    default:
      console.log(`Unknown event type: ${event.eventType}`);
  }
}
