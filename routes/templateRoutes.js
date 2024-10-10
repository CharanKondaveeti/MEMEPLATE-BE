const express = require('express');
const templateController = require('../controllers/templateController');

const router = express.Router();

router
  .route('/getAlltemplates')
  .get(templateController.getTemplates);
  
router
  .route('/uploadTemplate')
  .post(templateController.uploadTemplate);

router
  .route('/bulkUpload')
  .post(templateController.bulkUpload);

module.exports = router;