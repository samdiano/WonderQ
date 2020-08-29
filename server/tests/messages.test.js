import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '../../app';
import { v4 as uuidv4 } from "uuid";
import queues from "../model/queues";

chai.use(chaiHttp);

describe('Messages', () => {
  const queue = {
    name: "A new Queue"
  }

  it('Should create a queue', (done) => {
    chai.request(server)
      .post('/api/v1/queues')
      .send(queue)
      .end((err, res) => {
        expect(res.status).to.equal(201);
        expect(res.body).to.have.property('message').equal('Queue Created');
        done();
      });
  });


  it('Should create a consumer', (done) => {
    const queueId = queues[0].id;
    chai.request(server)
      .post(`/api/v1/queues/${queueId}/consumers`)
      .send({name: "A new consumer"})
      .end((err, res) => {
        expect(res.status).to.equal(201);
        expect(res.body).to.have.property('message').equal('Consumer Created');
        done();
      });
  });

  it('Should create a message', (done) => {
    const queueId = queues[0].id;
    chai.request(server)
      .post(`/api/v1/queues/${queueId}/messages`)
      .send({messageBody: "A new consumer"})
      .end((err, res) => {
        expect(res.status).to.equal(201);
        expect(res.body).to.have.property('message').equal('Message Created');
        done();
      });
  });

  it('Should get a message', (done) => {
    const queueId = queues[0].id;
    const consumerId =queues[0].consumers[0].id
    chai.request(server)
      .get(`/api/v1/queues/${queueId}/messages`)
      .set('consumerid', consumerId )
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('message').equal('Message Created');
        done();
      });
  });

  
});
