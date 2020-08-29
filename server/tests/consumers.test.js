import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '../../app';
import { v4 as uuidv4 } from "uuid";
import queues from "../model/queues";

chai.use(chaiHttp);

describe('Consumers', () => {
  const queue = {
    name: "A new Queue"
  }

  it('Should return 404 for empty queues', (done) => {
    chai.request(server)
      .get('/api/v1/queues')
      .send(queue)
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(res.body).to.have.property('message').equal('No queues to be displayed');
        done();
      });
  });

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

  it('Should get all consumers', (done) => {
    const queueId = queues[0].id;
    chai.request(server)
      .get(`/api/v1/queues/${queueId}/consumers`)
      .send({name: "A new consumer"})
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('message').equal('Retrieved All Consumers');
        done();
      });
  });

  
});
