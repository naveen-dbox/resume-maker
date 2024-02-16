const { expect } = require('chai');
const sinon = require('sinon');
const express = require('express');
const supertest = require('supertest');

// Import the controller and DAOs
const controller = require('../controllers/index.controller');
const MessagesDAO = require('../models/dao/messages_dao');
const Resumes_DAO = require('../models/dao/resumes_dao');



describe('Index Controller', () => {
  let app;

  // Before each test case, initialize express app and stub DAO methods
  beforeEach(() => {
    app = express();
  });

  // After each test case, restore stubs
  afterEach(() => {
    sinon.restore();
  });

  describe('GET /', () => {
    it('should render index page successfully', (done) => {
      const res = {
        render: sinon.stub()
      };

      controller.base({}, res);

      expect(res.render.calledOnce).to.be.true;
      expect(res.render.calledWith('index', { title: 'Express' })).to.be.true;
      done();
    });
  });

  describe('POST /send_message', () => {
    it('should send message successfully', async () => {
      const req = { body: { message: 'Test Message' } };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub()
      };
      sinon.stub(MessagesDAO.prototype, 'insert').resolves({ acknowledged: true, insertedId: '123' });

      await controller.send_message(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({ status: 'success', message: 'Message sent successfully.' })).to.be.true;
    });

    it('should handle error if message sending fails', async () => {
      const req = { body: { message: 'Test Message' } };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub()
      };
      sinon.stub(MessagesDAO.prototype, 'insert').rejects(new Error('Error Sending Message'));

      await controller.send_message(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ status: 'error', message: 'Internal server error.' })).to.be.true;
    });
  });

  describe('GET /resumes', () => {
    it('should render the resumes page successfully', async () => {
      // Mock request and response objects
      const req = {
        query: {
          filter: 'sampleFilter', // Add sample filter for testing
          page: 2 // Add sample page number for testing pagination
        }
      };
      const res = {
        render: sinon.stub()
      };
  
      // Stub Resumes_DAO method to resolve with sample data
      sinon.stub(Resumes_DAO.prototype, 'get_all_resume_ids').resolves([{ _id: '1', name: 'Resume 1' }, { _id: '2', name: 'Resume 2' }]);
  
      // Call the controller function
      await controller.resumes(req, res);
  
      // Assertions
      expect(Resumes_DAO.prototype.get_all_resume_ids.calledOnceWith({ tags: 'sampleFilter' })).to.be.true; // Verify DAO method call with correct filter
      expect(res.render.calledOnce).to.be.true; // Check if render function is called
      expect(res.render.args[0][0]).to.equal('resumes'); // Check if the correct view is rendered
      expect(res.render.args[0][1]).to.have.property('currentPage').to.equal(2); // Check if currentPage is correctly passed to the view
      // Add more assertions to validate pagination logic, totalPages, and other properties passed to the view
    }).timeout(10000);
  });
  

  // Similarly, you can write tests for other routes and controller methods
});
