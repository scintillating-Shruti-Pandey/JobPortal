const Job = require('../models/Job');
const Application = require('../models/Application');

// @desc    Get all jobs with filters
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res) => {
  try {
    const {
      keyword, location, type, category, experience,
      salaryMin, salaryMax, isRemote, page = 1, limit = 12, sortBy = 'newest',
    } = req.query;

    const query = { isActive: true };

    if (keyword) {
      query.$text = { $search: keyword };
    }
    if (location) query.location = { $regex: location, $options: 'i' };
    if (type) query.type = type;
    if (category) query.category = { $regex: category, $options: 'i' };
    if (experience) query.experience = experience;
    if (isRemote === 'true') query.isRemote = true;
    if (salaryMin) query.salaryMin = { $gte: Number(salaryMin) };
    if (salaryMax) query.salaryMax = { $lte: Number(salaryMax) };

    const sortOptions = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      salary_high: { salaryMax: -1 },
      salary_low: { salaryMin: 1 },
    };

    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .sort(sortOptions[sortBy] || { createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('postedBy', 'name companyName companyLogo');

    res.json({
      success: true,
      count: jobs.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: Number(page),
      jobs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
const getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('postedBy', 'name email companyName companyLogo companyWebsite companyDescription');

    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

    job.views += 1;
    await job.save();

    res.json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create job
// @route   POST /api/jobs
// @access  Private (Employer)
const createJob = async (req, res) => {
  try {
    const job = await Job.create({
      ...req.body,
      postedBy: req.user._id,
      company: {
        name: req.user.companyName || req.body.company?.name,
        logo: req.user.companyLogo || req.body.company?.logo || '',
        website: req.user.companyWebsite || req.body.company?.website || '',
        description: req.user.companyDescription || req.body.company?.description || '',
        size: req.user.companySize || req.body.company?.size || '',
        industry: req.user.companyIndustry || req.body.company?.industry || '',
      },
    });

    res.status(201).json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (Employer - owner)
const updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (Employer - owner)
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await Job.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get employer's jobs
// @route   GET /api/jobs/my-jobs
// @access  Private (Employer)
const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get featured jobs (latest 6)
// @route   GET /api/jobs/featured
// @access  Public
const getFeaturedJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(6)
      .populate('postedBy', 'companyName companyLogo');
    res.json({ success: true, jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get job stats
// @route   GET /api/jobs/stats
// @access  Public
const getStats = async (req, res) => {
  try {
    const totalJobs = await Job.countDocuments({ isActive: true });
    const totalCompanies = await Job.distinct('company.name');
    const totalApplications = await Application.countDocuments();
    const categories = await Job.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 },
    ]);

    res.json({
      success: true,
      stats: {
        totalJobs,
        totalCompanies: totalCompanies.length,
        totalApplications,
        categories,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getJobs, getJob, createJob, updateJob, deleteJob, getMyJobs, getFeaturedJobs, getStats };
