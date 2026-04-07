const User = require('../models/User');
const Notification = require('../models/Notification');

exports.getAllResidents = async (req, res) => {
  try {
    const search = req.query.search || '';
    const query = { role: 'resident' };
    if (search) query.flatNo = { $regex: search, $options: 'i' };

    const residents = await User.find(query).sort('flatNo');
    res.render('admin/residents', { title: 'Residents - Dwell Core', residents, search });
  } catch (err) {
    req.flash('error', 'Error fetching residents');
    res.redirect('/dashboard');
  }
};

exports.getAddResident = (req, res) => {
  res.render('admin/addResident', { title: 'Add Resident - Dwell Core' });
};

exports.postAddResident = async (req, res) => {
  try {
    const { name, email, password, flatNo, floor, phone, familyMembers } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      req.flash('error', 'Email already in use');
      return res.redirect('/admin/residents/add');
    }
    const user = await User.create({ name, email, password, flatNo, floor, phone, familyMembers: familyMembers || 1, role: 'resident' });
    await Notification.create({ user: user._id, title: 'Welcome to Dwell Core!', message: `Hello ${name}, your account has been created. Flat: ${flatNo}`, type: 'general' });
    req.flash('success', 'Resident added successfully');
    res.redirect('/admin/residents');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to add resident');
    res.redirect('/admin/residents/add');
  }
};

exports.deleteResident = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    req.flash('success', 'Resident deleted');
    res.redirect('/admin/residents');
  } catch (err) {
    req.flash('error', 'Delete failed');
    res.redirect('/admin/residents');
  }
};

exports.getResidentDetail = async (req, res) => {
  try {
    const resident = await User.findById(req.params.id);
    if (!resident) { req.flash('error', 'Resident not found'); return res.redirect('/admin/residents'); }
    res.render('admin/residentDetail', { title: `${resident.name} - Dwell Core`, resident });
  } catch (err) {
    req.flash('error', 'Error');
    res.redirect('/admin/residents');
  }
};
