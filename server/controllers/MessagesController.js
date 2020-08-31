import queues from "../model/queues";
import validateMessages from "../helpers/validateMessages";
import { v4 as uuidv4 } from "uuid";

class MessagesController {
  // get all consumers in a queue
  static async getMessages(req, res) {
    const queueId = req.params.qid;
    const consumerId = req.headers.consumerid;

    const queueIndex = queues.findIndex((queue) => queue.id === queueId);

    const queueExists = queues.find((queue) => queue.id === queueId);

    const consumerExists = queueExists.consumers.find(
      (consumer) => consumer.id === consumerId
    );
    if (!consumerExists)
      return res.status(404).json({ message: "Consumer does not exist" });

    if (
      queues[queueIndex].messages.length === 0 ||
      (queues[queueIndex].processing &&
        queues[queueIndex].processingId !== consumerId)
    )
      return res.status(404).json({ message: "No messages available" });

    queues[queueIndex].processingId = consumerId;
    queues[queueIndex].processing = true;
    setTimeout(() => {
      queues.splice(queueIndex, 1);
    }, process.env.VISIBILITY_PERIOD);
    res.status(200).json({
      status: "success",
      data: queues[queueIndex].messages,
      message: "messages received",
    });
  }

  // get all consumers in a queue
  static async markMessagesProcessed(req, res) {
    const queueId = req.params.qid;
    const consumerId = req.headers.consumerid;

    const queueIndex = queues.findIndex((queue) => queue.id === queueId);

    const consumerExists = queueExists.consumers.find(
      (consumer) => consumer.id === consumerId
    );
    if (!consumerExists)
      return res.status(404).json({ message: "Consumer does not exist" });

    if (
      queues[queueIndex].messages.length === 0 ||
      queues[queueIndex].processing
    )
      return res.status(404).json({ message: "No messages available" });

    queues.splice(queueIndex, 1);
    res.status(200).json({
      status: "success",
      data: queues[queueIndex].messages,
      message: "messages processed ",
    });
  }

  // Create New Message
  static async writeMessage(req, res) {
    const queueId = req.params.qid;
    const { consumerId, messageBody } = req.body;
    const { error } = validateMessages(req.body);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    const queueIndex = queues.findIndex((queue) => queue.id === queueId);
    console.log(process.env.VISIBILITY_PERIOD);
    const messageObject = {
      id: uuidv4(),
      message: messageBody,
    };

    queues[queueIndex].messages.push(messageObject);
    res.status(201).json({
      status: "success",
      message: "Message Created",
      data: messageObject,
    });
  }
}

export default MessagesController;
