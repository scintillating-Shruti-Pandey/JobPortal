const express = require('express');
const router = express.Router();
const { getJobs, getJob, createJob, updateJob, deleteJob, getMyJobs, getFeaturedJobs, getStats } = require('../controllers/jobController');
const { protect, isEmployer } = require('../middleware/auth');

router.get('/featured', getFeaturedJobs);
router.get('/stats', getStats);
router.get('/my-jobs', protect, isEmployer, getMyJobs);
router.get('/', getJobs);
router.get('/:id', getJob);
router.post('/', protect, isEmployer, createJob);
router.put('/:id', protect, isEmployer, updateJob);
router.delete('/:id', protect, isEmployer, deleteJob);

module.exports = router;
