const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, select: false },
    role: { type: String, enum: ['seeker', 'employer'], default: 'seeker' },
    avatar: { type: String, default: '' },
    googleId: { type: String },
    isGoogleAuth: { type: Boolean, default: false },

    // Seeker fields
    headline: { type: String, default: '' },
    bio: { type: String, default: '' },
    skills: [{ type: String }],
    location: { type: String, default: '' },
    resumeUrl: { type: String, default: '' },
    experience: [
      {
        title: String,
        company: String,
        from: Date,
        to: Date,
        current: Boolean,
        description: String,
      },
    ],
    education: [
      {
        degree: String,
        institution: String,
        year: String,
      },
    ],
    savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],

    // Employer fields
    companyName: { type: String, default: '' },
    companyWebsite: { type: String, default: '' },
    companyDescription: { type: String, default: '' },
    companyLogo: { type: String, default: '' },
    companyIndustry: { type: String, default: '' },
    companySize: { type: String, default: '' },
  },
  { timestamps: true }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
