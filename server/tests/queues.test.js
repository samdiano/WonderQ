import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '../../app';
import { v4 as uuidv4 } from "uuid";
import queues from "../model/queues";

chai.use(chaiHttp);

describe('Queues', () => {
  const queue = {
    name: "A new Queue"
  }

  it('should return welcome message', (done) => {
    chai.request(server)
      .get('/api/v1/')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal('Welcome to WonderQ Api v1.0.0');
        done();
      });
  });
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

  it('Should get queues', (done) => {
    chai.request(server)
      .get('/api/v1/queues')
      .send(queue)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('message').equal('Retrieved All Queues');
        done();
      });
  });

 
  it('Should get a single queue', (done) => {
    const queueId = queues[0].id;
    chai.request(server)
      .get(`/api/v1/queues/${queueId}`)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('message').equal('Queue retirevd successfully');
        done();
      });
  });

  it('Should not get an invalid queue', (done) => {
    chai.request(server)
      .get(`/api/v1/queues/blablabla`)
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(res.body).to.have.property('message').equal('Queue does not exist');
        done();
      });
  });

  it('Should update a queue', (done) => {
    const queueId = queues[0].id;
    chai.request(server)
      .put(`/api/v1/queues/${queueId}`)
      .send({name: "A new name"})
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('message').equal('Queue updated successfully');
        done();
      });
  });

 

});
