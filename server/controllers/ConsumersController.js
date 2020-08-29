import queues from "../model/queues";
import validateQueue from "../helpers/validateQueue";
import { v4 as uuidv4 } from "uuid";

class ConsumersController {
  // get all consumers in a queue
  static async getConsumers(req, res) {
    const queueId = req.params.qid;

    const queueExists = queues.find((queue) => queue.id === queueId);

    if (!queueExists)
      return res.status(404).json({ message: "Queue does not exist" });
    const queueIndex = queues.findIndex((queue) => queue.id === queueId);

    res.status(200).json({
      status: "success",
      data: queues[queueIndex].consumers,
      message: "Retrieved All Consumers",
    });
  }

  // Create New Consumer
  static async addConsumer(req, res) {
    const queueId = req.params.qid;

    const { error } = validateQueue(req.body);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }
    const queueExists = queues.find((queue) => queue.id === queueId);
    if (!queueExists)
      return res.status(404).json({ message: "Queue does not exist" });
    const queueIndex = queues.findIndex((queue) => queue.id === queueId);

    const consumerId = uuidv4();
    const consumerObject = {
      id: consumerId,
      name: req.body.name,
    };

    queues[queueIndex].consumers.push(consumerObject);
    res.status(201).json({
      status: "success",
      message: "Consumer Created",
      data: consumerObject,
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

export default ConsumersController;
