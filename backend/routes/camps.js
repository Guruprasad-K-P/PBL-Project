const express = require('express');
const {
  createCamp,
  getAllCamps,
  getCamp,
  registerForCamp,
  getMyRegistrations
} = require('../controllers/campController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(getAllCamps)
  .post(protect, authorize('organizer', 'admin'), createCamp);

router.route('/my-registrations')
  .get(protect, getMyRegistrations);

router.route('/:id')
  .get(getCamp);

router.route('/:id/register')
  .post(protect, authorize('patient'), registerForCamp);

module.exports = router;