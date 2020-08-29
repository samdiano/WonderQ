import queues from "../model/queues";
import validateQueue from "../helpers/validateQueue";
import { v4 as uuidv4 } from "uuid";
class QueuesController {
  // get all queues
  static async getQueues(req, res) {
    if (queues.length === 0) {
      return res
        .status(404)
        .json({ data: queues, message: "No queues to be displayed" });
    }
    res.status(200).json({
      status: "success",
      data: queues.map((queue) => {
        return {
          id: queue.id,
          name: queue.name,
        };
      }),
      message: "Retrieved All Queues",
    });
  }

  // Get single queue
  static async getQueue(req, res) {
    const queueId = req.params.id;

    const queueExists = queues.find((queue) => queue.id === queueId);

    if (!queueExists)
      return res.status(404).json({ message: "Queue does not exist" });
    const queueIndex = queues.findIndex((queue) => queue.id === queueId);

    res.status(200).json({
      status: "success",
      data: queues[queueIndex],
      message: "Queue retirevd successfully",
    });
  }

  // Create New Queue
  static async addQueue(req, res) {
    const { error } = validateQueue(req.body);
    const queueId = uuidv4();
    const queueObject = {
      id: queueId,
      name: req.body.name,
      consumers: [],
      messages: [],
    };
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }
    queues.push(queueObject);
    res
      .status(201)
      .json({ status: "success", message: "Queue Created", data: queueObject });
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

export default QueuesController;
