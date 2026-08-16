const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    requirements: [{ type: String }],
    responsibilities: [{ type: String }],
    skills: [{ type: String }],
    type: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance', 'Remote'],
      required: true,
    },
    location: { type: String, required: true },
    isRemote: { type: Boolean, default: false },
    salaryMin: { type: Number },
    salaryMax: { type: Number },
    salaryCurrency: { type: String, default: 'INR' },
    salaryPeriod: { type: String, enum: ['hourly', 'monthly', 'yearly'], default: 'yearly' },
    experience: {
      type: String,
      enum: ['Entry Level', 'Mid Level', 'Senior Level', 'Lead', 'Manager', 'Director', 'Any'],
      default: 'Any',
    },
    category: { type: String, required: true },
    company: {
      name: { type: String, required: true },
      logo: { type: String, default: '' },
      website: { type: String, default: '' },
      description: { type: String, default: '' },
      size: { type: String, default: '' },
      industry: { type: String, default: '' },
    },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Application' }],
    isActive: { type: Boolean, default: true },
    deadline: { type: Date },
    views: { type: Number, default: 0 },
    tags: [{ type: String }],
    perks: [{ type: String }],
  },
  { timestamps: true }
);

jobSchema.index({ title: 'text', description: 'text', skills: 'text' });

module.exports = mongoose.model('Job', jobSchema);
