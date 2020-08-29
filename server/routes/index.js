import queuesController from "../controllers/QueuesController";
import ConsumersController from "../controllers/ConsumersController";

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
  app.put("/api/v1/queues/:id", queuesController.updateQueue);
  app.get("/api/v1/queues/:id", queuesController.getQueue);

  // Consumer routes
  app.get("/api/v1/queues/:qid/consumers", ConsumersController.getConsumers);
  app.post("/api/v1/queues/:qid/consumers", ConsumersController.addConsumer);


};

export default routes;
