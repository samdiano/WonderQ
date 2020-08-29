import queues from "../controllers/QueuesController";

const routes = (app) => {
  app.get("/api/v1", (req, res) => {
    res.status(200).json({
      status: "Success",
      message: "Welcome to WonderQ Api v1.0.0",
    });
  });
  // Entry routes
  app.get("/api/v1/queues", queues.getQueues);
};

export default routes;