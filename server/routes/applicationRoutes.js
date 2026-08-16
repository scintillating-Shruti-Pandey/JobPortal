const express = require('express');
const router = express.Router();
const { applyForJob, getMyApplications, getJobApplicants, updateApplicationStatus, toggleSaveJob } = require('../controllers/applicationController');
const { protect, isSeeker, isEmployer } = require('../middleware/auth');

router.get('/me', protect, isSeeker, getMyApplications);
router.post('/save/:jobId', protect, isSeeker, toggleSaveJob);
router.get('/job/:jobId', protect, isEmployer, getJobApplicants);
router.post('/:jobId', protect, isSeeker, applyForJob);
router.put('/:id/status', protect, isEmployer, updateApplicationStatus);

module.exports = router;
