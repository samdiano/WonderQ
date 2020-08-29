import chai, { expect } from 'chai';
import jwt from 'jsonwebtoken';
import chaiHttp from 'chai-http';
import server from '../../app';
import db from '../middleware/connectdb';

chai.use(chaiHttp);
const token = jwt.sign({ id: 1 }, 'oiraid', { expiresIn: 86400 });
const token2 = jwt.sign({ id: 7777 }, 'oiraid', { expiresIn: 86400 });

describe('Entries', () => {
  const entry = {
    userid: 2,
    title: 'The day I first ....',
    body: 'Paragraph ...'
  };
  before('truncating db', () => db.none('TRUNCATE entries RESTART IDENTITY'));

  it('should return welcome message', (done) => {
    chai.request(server)
      .get('/api/v1/')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal('Welcome to Diario Api v1.0.0');
        done();
      });
  });
  it('Should post an entry', (done) => {
    chai.request(server)
      .post('/api/v1/entries')
      .set('x-auth-token', token)
      .send(entry)
      .end((err, res) => {
        expect(res.status).to.equal(201);
        expect(res.body).to.have.property('message').equal('Inserted one Entry');
        done();
      });
  });
  it('Should not post an entry with incomplete fields', (done) => {
    chai.request(server)
      .post('/api/v1/entries')
      .set('x-auth-token', token)
      .send({
        userId: 1,
        title: 'The day I first ....',
      })
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('message');
        done();
      });
  });
  it('Should update an entry', (done) => {
    chai.request(server)
      .put('/api/v1/entries/1')
      .set('x-auth-token', token)
      .send({
        title: 'The school of Law ....',
        body: 'Paragraph ...'
      })
      .end((err, res) => {
        expect(res.body.message).to.equal('Updated one entry');
        expect(res.status).to.equal(200);
        done();
      });
  });
  it('Should not update an entry with an invalid ID', (done) => {
    chai.request(server)
      .put('/api/v1/entries/3500')
      .set('x-auth-token', token)
      .send({
        title: 'The day I first ....',
        body: 'Paragraph ...',
      })
      .end((err, res) => {
        expect(res.status).to.equal(404);
        done();
      });
  });
  it('Should not update an entry with incomplete fields', (done) => {
    chai.request(server)
      .put('/api/v1/entries/1')
      .set('x-auth-token', token)
      .send({
        title: 'The day I first ....'
      })
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('message');
        done();
      });
  });
  it('should throw an exception when token is invalid', (done) => {
    chai.request(server)
      .get('/api/v1/entries')
      .set('x-auth-token', 'djdjdjk')
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.message).to.equal('Invalid token');
        done();
      });
  });
  it('should throw an exception when no token is provided', (done) => {
    chai.request(server)
      .get('/api/v1/entries')
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body.message).to.equal('Access denied, no token provided');
        done();
      });
  });
  it('should return all entries ', (done) => {
    chai.request(server)
      .get('/api/v1/entries')
      .set('x-auth-token', token)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body.entries[0]).to.have.property('id');
        expect(res.body.entries[0]).to.have.property('title');
        expect(res.body.entries[0]).to.have.property('body');
        expect(res.body.entries[0]).to.have.property('userid');
        done();
      });
  });
  it('should return error if no entries posted ', (done) => {
    chai.request(server)
      .get('/api/v1/entries')
      .set('x-auth-token', token2)
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');

        done();
      });
  });
  it('should return an entry if a valid id is passed', (done) => {
    chai.request(server)
      .get('/api/v1/entries/1')
      .set('x-auth-token', token)
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.status).to.equal(200);
        expect(res.body.entry[0]).to.have.property('title');
        expect(res.body.entry[0]).to.have.property('body');
        expect(res.body.entry[0]).to.have.property('userid');
        expect(res.body.entry[0]).to.have.property('id').equal(1);
        done();
      });
  });
  it('should not return an entry with an invalid id', (done) => {
    chai.request(server)
      .get('/api/v1/entries/255')
      .set('x-auth-token', token)
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.status).to.equal(404);
        expect(res.body).to.have.property('message');
        done();
      });
  });
  it('Should delete the entry with the specified id', (done) => {
    chai.request(server)
      .delete('/api/v1/entries/1')
      .set('x-auth-token', token)
      .end((err, res) => {
        expect(res.body.message).to.equal('Entry deleted successfully');
        expect(res.status).to.equal(200);
        done();
      });
  });
  it('Should not delete an entry with an invalid ID', (done) => {
    chai.request(server)
      .delete('/api/v1/entries/3500')
      .set('x-auth-token', token)
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(res.body).to.have.property('message').equal('Entry does not exist');
        done();
      });
  });
});
