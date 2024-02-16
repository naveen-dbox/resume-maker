const sinon = require('sinon');
const { expect } = require('chai');
const rewire = require('rewire');
const csurf = require('csurf');
// Import the functions to test
const { ObjectId } = require('mongodb');

const controller = rewire('../controllers/users.controller');


const messages_dao = {
  delete: sinon.stub()
};
controller.__set__('messages_dao', messages_dao);

describe('users.controller.js', () => {

  describe('logout route', () => {
    it('should respond with status 200', (done) => {
      const req = {};
      const res = {
        clearCookie: () => {},
        sendStatus: (status) => {
          try {
            expect(status).to.equal(200);
            done();
          } catch (error) {
            done(error);
          }
        }
      };
  
      controller.logout(req, res);
    });
  });

  describe('delete_id function', () => {
    let req, res;

    beforeEach(() => {
      let validObjectId = new ObjectId().toHexString();
      req = { params: { id: validObjectId } };
      res = { sendStatus: sinon.spy() };
    });

    afterEach(() => {
      sinon.restore();
    });

    it('should respond with status 200 if deletedCount is 1', async () => {
      messages_dao.delete.resolves({ deletedCount: 1 });

      await controller.delete_id(req, res);

      expect(res.sendStatus.calledOnceWith(200)).to.be.true;
    });

    it('should respond with status 403 if deletedCount is 0', async () => {
      messages_dao.delete.resolves({ deletedCount: 0 });
    
      await controller.delete_id(req, res);
    
      setTimeout(() => {
        expect(res.sendStatus.calledOnceWith(403)).to.be.true;
        done();
      }, 10); 
    });
  });

});
