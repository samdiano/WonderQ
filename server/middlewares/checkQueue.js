import queues from "../model/queues";
export default (req, res, next) => {
  const queueId = req.params.id || req.params.qid;

  const queueExists = queues.find((queue) => queue.id === queueId);

  if (queueExists) return next();

  return res.status(404).json({ message: "Queue does not exist" });
};
