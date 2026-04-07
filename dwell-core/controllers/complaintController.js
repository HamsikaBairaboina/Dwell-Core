const Complaint = require('../models/Complaint');
const Notification = require('../models/Notification');
const User = require('../models/User');

// Admin
exports.getAllComplaints = async (req, res) => {
  try {
    const { status, priority } = req.query;
    const query = {};
    if (status) query.status = status;
    if (priority) query.priority = priority;

    const complaints = await Complaint.find(query).populate('user', 'name flatNo').sort('-createdAt');
    res.render('admin/complaints', { title: 'Complaints - Dwell Core', complaints, status, priority });
  } catch (err) {
    req.flash('error', 'Error loading complaints');
    res.redirect('/dashboard');
  }
};

exports.updateComplaintStatus = async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(req.params.id, {
      status, adminNote,
      resolvedAt: status === 'Resolved' ? new Date() : null
    }, { new: true });

    if (complaint && status === 'Resolved') {
      await Notification.create({
        user: complaint.user,
        title: 'Complaint Resolved ✅',
        message: `Your complaint "${complaint.title}" has been resolved.`,
        type: 'complaint',
        link: '/complaints'
      });
    }
    req.flash('success', 'Complaint updated');
    res.redirect('/admin/complaints');
  } catch (err) {
    req.flash('error', 'Update failed');
    res.redirect('/admin/complaints');
  }
};

exports.deleteComplaint = async (req, res) => {
  try {
    await Complaint.findByIdAndDelete(req.params.id);
    req.flash('success', 'Complaint deleted');
    res.redirect('/admin/complaints');
  } catch (err) {
    req.flash('error', 'Delete failed');
    res.redirect('/admin/complaints');
  }
};

// Resident
exports.getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.session.userId }).sort('-createdAt');
    res.render('resident/complaints', { title: 'My Complaints - Dwell Core', complaints });
  } catch (err) {
    req.flash('error', 'Error loading complaints');
    res.redirect('/dashboard');
  }
};

exports.getAddComplaint = (req, res) => {
  res.render('resident/addComplaint', { title: 'New Complaint - Dwell Core' });
};

exports.postAddComplaint = async (req, res) => {
  try {
    const { title, description, category, priority } = req.body;
    const user = await User.findById(req.session.userId);
    await Complaint.create({ user: req.session.userId, title, description, category, priority, flatNo: user.flatNo });
    req.flash('success', 'Complaint submitted successfully');
    res.redirect('/complaints');
  } catch (err) {
    req.flash('error', 'Failed to submit complaint');
    res.redirect('/complaints/new');
  }
};

exports.deleteMyComplaint = async (req, res) => {
  try {
    await Complaint.findOneAndDelete({ _id: req.params.id, user: req.session.userId });
    req.flash('success', 'Complaint removed');
    res.redirect('/complaints');
  } catch (err) {
    req.flash('error', 'Delete failed');
    res.redirect('/complaints');
  }
};
