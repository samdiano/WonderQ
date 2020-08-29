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
      data: queues,
      message: "Retrieved All Queues",
    });
  }

  // // Get single entry
  // static async getEntry(req, res) {
  //   const entryId = parseInt(req.params.id, 10);
  //   if ((Number(req.params.id) !== parseInt(req.params.id, 10)) || Math.sign(entryId) === -1) {
  //     return res.status(401).json({ message: 'Given ID is not a number' });
  //   }
  //   const entry = await db.any(
  //     'SELECT * FROM entries where id = $1 and userid =$2',
  //     [entryId, req.user.id]
  //   );
  //   if (entry.length === 0) {
  //     return res.status(404).json({
  //       message: 'Entry does not exist'
  //     });
  //   }
  //   res.status(200).json({ entry, message: 'Retrieved ONE entry' });
  // }

  // Create New Queue
  static async addQueue(req, res) {
    const { error } = validateQueue(req.body);
    const queueId = uuidv4();
    const queueObject = {
      id: queueId,
      name: req.body.name,
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

  // // modify fields in an entry
  // static async updateEntry(req, res) {
  //   const today = new Date();
  //   const { error } = validateEntry(req.body);
  //   if (error) return res.status(400).json({ message: error.details[0].message });
  //   const entryId = parseInt(req.params.id, 10);
  //   if ((Number(req.params.id) !== parseInt(req.params.id, 10)) || Math.sign(entryId) === -1) {
  //     return res.status(401).json({ message: 'Given ID is not a number' });
  //   }
  //   const date = await db.any(
  //     'SELECT * FROM entries where id = $1 and userid = $2',
  //     [entryId, req.user.id]
  //   );
  //   if (date.length === 0) return res.status(404).json({ message: 'Entry does not exist' });
  //   const time = new Date(date[0].created_at);
  //   time.setHours(time.getHours() + 24);
  //   if (today >= time) {
  //     return res.status(403).json({ message: 'You cannot update your entry after 24 hours' });
  //   }
  //   await db.result(
  //     'update entries set title=$1, body=$2 where id=$3 and userid=$4',
  //     [req.body.title, req.body.body, entryId, req.user.id]
  //   );
  //   res.status(200).json({ date, message: 'Updated one entry' });
  // }

  // // remove entry
  // static async removeEntry(req, res) {
  //   const entryId = parseInt(req.params.id, 10);
  //   if ((Number(req.params.id) !== parseInt(req.params.id, 10)) || Math.sign(entryId) === -1) {
  //     return res.status(401).json({ message: 'Given ID is not a number' });
  //   }
  //   const result = await db.result(
  //     'delete from entries where id = $1 and userid= $2',
  //     [entryId, req.user.id]
  //   );
  //   if (result.rowCount === 0) {
  //     return res.status(404).json({ message: 'Entry does not exist' });
  //   }
  //   res.status(200).json({ message: 'Entry deleted successfully' });
  // }
}

export default QueuesController;
