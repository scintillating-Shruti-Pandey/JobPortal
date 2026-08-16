const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');

// @desc    Apply for a job
// @route   POST /api/applications/:jobId
// @access  Private (Seeker)
const applyForJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    if (!job.isActive) return res.status(400).json({ success: false, message: 'Job is no longer active' });

    const existing = await Application.findOne({ job: req.params.jobId, applicant: req.user._id });
    if (existing) return res.status(400).json({ success: false, message: 'Already applied for this job' });

    const application = await Application.create({
      job: req.params.jobId,
      applicant: req.user._id,
      coverLetter: req.body.coverLetter || '',
      resumeUrl: req.body.resumeUrl || req.user.resumeUrl || '',
    });

    job.applicants.push(application._id);
    await job.save();

    res.status(201).json({ success: true, application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get seeker's applications
// @route   GET /api/applications/me
// @access  Private (Seeker)
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate('job', 'title company location type salaryMin salaryMax isActive')
      .sort({ createdAt: -1 });

    res.json({ success: true, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get applicants for a job
// @route   GET /api/applications/job/:jobId
// @access  Private (Employer)
const getJobApplicants = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const applications = await Application.find({ job: req.params.jobId })
      .populate('applicant', 'name email avatar headline skills location resumeUrl')
      .sort({ createdAt: -1 });

    res.json({ success: true, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private (Employer)
const updateApplicationStatus = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id).populate('job');
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });

    if (application.job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    application.status = req.body.status;
    if (req.body.notes) application.notes = req.body.notes;
    await application.save();

    res.json({ success: true, application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Save/unsave a job
// @route   POST /api/applications/save/:jobId
// @access  Private (Seeker)
const toggleSaveJob = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const jobId = req.params.jobId;
    const isSaved = user.savedJobs.includes(jobId);

    if (isSaved) {
      user.savedJobs = user.savedJobs.filter((id) => id.toString() !== jobId);
    } else {
      user.savedJobs.push(jobId);
    }

    await user.save();
    res.json({ success: true, saved: !isSaved, message: isSaved ? 'Job unsaved' : 'Job saved' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { applyForJob, getMyApplications, getJobApplicants, updateApplicationStatus, toggleSaveJob };
