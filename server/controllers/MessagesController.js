import queues from "../model/queues";
import validateMessages from "../helpers/validateMessages";
import { v4 as uuidv4 } from "uuid";

class MessagesController {
  // get all consumers in a queue
  static async getMessages(req, res) {
    const queueId = req.params.qid;
    const consumerId = req.headers.consumerid;

    const queueExists = queues.find((queue) => queue.id === queueId);

    if (!queueExists)
      return res.status(404).json({ message: "Queue does not exist" });
    const queueIndex = queues.findIndex((queue) => queue.id === queueId);

    const consumerExists = queueExists.consumers.find(
      (consumer) => consumer.id === consumerId
    );
    if (!consumerExists)
      return res.status(404).json({ message: "Consumer does not exist" });

    res.status(200).json({
      status: "success",
      data: queues[queueIndex].messages,
      message: "messages received",
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
    const queueExists = queues.find((queue) => queue.id === queueId);
    if (!queueExists)
      return res.status(404).json({ message: "Queue does not exist" });

    const queueIndex = queues.findIndex((queue) => queue.id === queueId);

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

  // modify fields in a queue
  static async updateQueue(req, res) {
    const { error } = validateQueue(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });
    const queueId = req.params.id;

    const queueExists = queues.find((queue) => queue.id === queueId);

    if (!queueExists)
      return res.status(404).json({ message: "Queue does not exist" });
    const queueIndex = queues.findIndex((queue) => queue.id === queueId);
    queues[queueIndex].name = req.body.name;

    res.status(200).json({
      status: "success",
      data: queues[queueIndex],
      message: "Queue updated successfully",
    });
  }
}

export default MessagesController;
