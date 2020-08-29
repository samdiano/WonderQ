import queuesController from "../controllers/QueuesController";
import ConsumersController from "../controllers/ConsumersController";
import MessagesController from "../controllers/MessagesController";
import checkQueue from "../middlewares/checkQueue";
const routes = (app) => {
  app.get("/api/v1", (req, res) => {
    res.status(200).json({
      status: "Success",
      message: "Welcome to WonderQ Api v1.0.0",
    });
  });
  // Queue routes
  app.get("/api/v1/queues", queuesController.getQueues);
  app.post("/api/v1/queues", queuesController.addQueue);
  app.put("/api/v1/queues/:id", checkQueue, queuesController.updateQueue);
  app.get("/api/v1/queues/:id", checkQueue, queuesController.getQueue);

  // Consumer routes
  app.get("/api/v1/queues/:qid/consumers", checkQueue, ConsumersController.getConsumers);
  app.post("/api/v1/queues/:qid/consumers", checkQueue, ConsumersController.addConsumer);

  // Messages Routes
  app.post("/api/v1/queues/:qid/messages", checkQueue,  MessagesController.writeMessage);
  app.get("/api/v1/queues/:qid/messages", checkQueue, MessagesController.getMessages);
};

export default routes;
