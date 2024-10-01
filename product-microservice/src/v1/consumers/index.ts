import { PrismaClient } from "@prisma/client";
import amqp from "amqplib";
const prisma = new PrismaClient();
export async function consumeEvent(eventType: string) {
  const connection = await amqp.connect("amqp://guest:guest@rabbitmq:5672");
  const channel = await connection.createChannel();
  const exchange = "events";

  await channel.assertExchange(exchange, "fanout", { durable: false });
  const queue = await channel.assertQueue("", { exclusive: true });

  await channel.bindQueue(queue.queue, exchange, "");

  console.log("Waiting for events...");

  channel.consume(
    queue.queue,
    (msg: any) => {
      if (msg.content) {
        const event = JSON.parse(msg.content.toString());
        console.log(event, "event is consumed by product service");
        handleEvent(event);
      }
    },
    { noAck: true }
  );
  console.log(`Listening for ${eventType} events...`);
}
async function handleEvent(event: { eventType: string; data: any }) {
  switch (event.eventType) {
    case "USER_REGISTERED":
      console.log(
        `Handling user registration for userId: ${event.data.userId}`
      );

      break;
    case "ORDER_PLACED":
      console.log(`Handling order placed for orderId: ${event.data.orderId}`);
      const items = event.data.items;

      items.forEach(async (item: any) => {
        console.log(
          `Updating inventory for item: ${item.productId}, Quantity: ${item.quantity}`
        );
        try {
          await prisma.product.update({
            where: {
              id: item.productId,
            },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });
        } catch (err) {
          console.log(err);
        }
      });
      break;

    default:
      console.log(`Unknown event type: ${event.eventType}`);
  }
}
