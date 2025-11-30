const Camp = require('../models/Camp');
const Registration = require('../models/Registration');

// @desc    Create a new health camp
// @route   POST /api/camps
// @access  Private (Organizer/Admin)
exports.createCamp = async (req, res) => {
  try {
    const {
      campName,
      location,
      date,
      doctorName,
      doctorSpecialization,
      services,
      maxParticipants,
      description,
      contactNumber,
      organizerName
    } = req.body;

    const camp = await Camp.create({
      organizer: req.user.id,
      campName,
      location,
      date,
      doctorName,
      doctorSpecialization,
      services,
      maxParticipants,
      description,
      contactNumber,
      organizerName
    });

    const populatedCamp = await Camp.findById(camp._id).populate('organizer', 'name email');

    res.status(201).json({
      success: true,
      message: 'Health camp created successfully',
      data: populatedCamp
    });
  } catch (error) {
    console.error('Create camp error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all camps
// @route   GET /api/camps
// @access  Public
exports.getAllCamps = async (req, res) => {
  try {
    const camps = await Camp.find({ status: 'upcoming' })
      .populate('organizer', 'name email village district')
      .sort({ date: 1 });

    res.status(200).json({
      success: true,
      count: camps.length,
      data: camps
    });
  } catch (error) {
    console.error('Get camps error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single camp
// @route   GET /api/camps/:id
// @access  Public
exports.getCamp = async (req, res) => {
  try {
    const camp = await Camp.findById(req.params.id)
      .populate('organizer', 'name email phone village district');

    if (!camp) {
      return res.status(404).json({
        success: false,
        message: 'Camp not found'
      });
    }

    res.status(200).json({
      success: true,
      data: camp
    });
  } catch (error) {
    console.error('Get camp error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Register for a camp
// @route   POST /api/camps/:id/register
// @access  Private (Patient)
exports.registerForCamp = async (req, res) => {
  try {
    const campId = req.params.id;
    const {
      name,
      age,
      gender,
      phone,
      village,
      symptoms,
      emergencyContact
    } = req.body;

    // Check if camp exists
    const camp = await Camp.findById(campId);
    if (!camp) {
      return res.status(404).json({
        success: false,
        message: 'Camp not found'
      });
    }

    // Check if camp is full
    if (camp.currentParticipants >= camp.maxParticipants) {
      return res.status(400).json({
        success: false,
        message: 'Camp is full. No more registrations accepted.'
      });
    }

    // Check if user already registered
    const existingRegistration = await Registration.findOne({
      user: req.user.id,
      camp: campId
    });

    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered for this camp'
      });
    }

    // Create registration
    const registration = await Registration.create({
      user: req.user.id,
      camp: campId,
      name,
      age,
      gender,
      phone,
      village,
      symptoms,
      emergencyContact
    });

    const populatedRegistration = await Registration.findById(registration._id)
      .populate('user', 'name email')
      .populate('camp', 'campName date location doctorName');

    res.status(201).json({
      success: true,
      message: 'Successfully registered for the health camp',
      data: populatedRegistration
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user's registrations
// @route   GET /api/camps/my-registrations
// @access  Private
exports.getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ user: req.user.id })
      .populate('camp', 'campName date location doctorName services')
      .sort({ registeredAt: -1 });

    res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrations
    });
  } catch (error) {
    console.error('Get registrations error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};