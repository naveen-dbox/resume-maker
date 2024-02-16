var express = require('express');
var router = express.Router();
const controller = require("../controllers/index.controller");

router.get('/', controller.base);
router.post('/send_message', controller.send_message);
router.get('/resumes',controller.resumes);
router.get('/resume',controller.resume);

module.exports = router;