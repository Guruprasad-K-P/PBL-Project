const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  camp: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Camp',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please provide your name']
  },
  age: {
    type: Number,
    required: [true, 'Please provide your age'],
    min: [1, 'Age must be at least 1'],
    max: [120, 'Age cannot be more than 120']
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: [true, 'Please provide your gender']
  },
  phone: {
    type: String,
    required: [true, 'Please provide your phone number']
  },
  village: {
    type: String,
    required: [true, 'Please provide your village name']
  },
  symptoms: {
    type: String,
    required: [true, 'Please describe your symptoms or health concerns']
  },
  emergencyContact: {
    type: String,
    required: [true, 'Please provide emergency contact number']
  },
  status: {
    type: String,
    enum: ['registered', 'attended', 'cancelled'],
    default: 'registered'
  },
  registeredAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent duplicate registrations
registrationSchema.index({ user: 1, camp: 1 }, { unique: true });

// Update camp participant count when registration is created
registrationSchema.post('save', async function() {
  const Camp = mongoose.model('Camp');
  await Camp.findByIdAndUpdate(this.camp, { 
    $inc: { currentParticipants: 1 } 
  });
});

// Update camp participant count when registration is deleted
registrationSchema.post('findOneAndDelete', async function(doc) {
  if (doc) {
    const Camp = mongoose.model('Camp');
    await Camp.findByIdAndUpdate(doc.camp, { 
      $inc: { currentParticipants: -1 } 
    });
  }
});

module.exports = mongoose.model('Registration', registrationSchema);