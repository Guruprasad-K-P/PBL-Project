const mongoose = require('mongoose');

const campSchema = new mongoose.Schema({
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  campName: {
    type: String,
    required: [true, 'Please provide camp name'],
    trim: true,
    maxlength: [100, 'Camp name cannot be more than 100 characters']
  },
  location: {
    village: {
      type: String,
      required: [true, 'Please provide village name']
    },
    district: {
      type: String,
      required: [true, 'Please provide district name']
    },
    address: {
      type: String,
      required: [true, 'Please provide full address']
    },
    landmark: {
      type: String,
      required: false
    }
  },
  date: {
    type: Date,
    required: [true, 'Please provide camp date and time']
  },
  doctorName: {
    type: String,
    required: [true, 'Please provide doctor name']
  },
  doctorSpecialization: {
    type: String,
    required: false
  },
  services: [{
    type: String,
    required: [true, 'Please provide services offered']
  }],
  maxParticipants: {
    type: Number,
    required: [true, 'Please provide maximum participants'],
    min: [1, 'Maximum participants must be at least 1'],
    max: [1000, 'Maximum participants cannot exceed 1000']
  },
  currentParticipants: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  isFree: {
    type: Boolean,
    default: true
  },
  contactNumber: {
    type: String,
    required: [true, 'Please provide contact number']
  },
  organizerName: {
    type: String,
    required: [true, 'Please provide organizer name']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
campSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Camp', campSchema);