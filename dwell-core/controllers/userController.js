const User = require('../models/User');
const Notification = require('../models/Notification');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    res.render('profile', { title: 'My Profile - Dwell Core', user });
  } catch (err) {
    req.flash('error', 'Error loading profile');
    res.redirect('/dashboard');
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, flatNo, floor, familyMembers, department } = req.body;
    const updateData = { name, phone };

    if (req.session.role === 'admin') {
      updateData.department = department || '';
    } else {
      updateData.flatNo = flatNo;
      updateData.floor = floor;
      updateData.familyMembers = familyMembers;
    }

    const updated = await User.findByIdAndUpdate(req.session.userId, updateData, { new: true });
    req.session.user = { ...req.session.user, name: updated.name, flatNo: updated.flatNo };
    req.flash('success', 'Profile updated successfully');
    res.redirect('/profile');
  } catch (err) {
    req.flash('error', 'Update failed');
    res.redirect('/profile');
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    if (newPassword !== confirmPassword) {
      req.flash('error', 'New passwords do not match');
      return res.redirect('/profile');
    }

    const user = await User.findById(req.session.userId);
    const valid = await user.comparePassword(oldPassword);
    if (!valid) {
      req.flash('error', 'Old password is incorrect');
      return res.redirect('/profile');
    }

    user.password = newPassword;
    await user.save();
    req.flash('success', 'Password changed successfully');
    res.redirect('/profile');
  } catch (err) {
    req.flash('error', 'Password change failed');
    res.redirect('/profile');
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.session.userId }).sort('-createdAt');
    await Notification.updateMany({ user: req.session.userId, isRead: false }, { isRead: true });
    res.render('notifications', { title: 'Notifications - Dwell Core', notifications });
  } catch (err) {
    req.flash('error', 'Error');
    res.redirect('/dashboard');
  }
};

exports.clearNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({ user: req.session.userId });
    req.flash('success', 'Notifications cleared');
    res.redirect('/notifications');
  } catch (err) {
    req.flash('error', 'Error');
    res.redirect('/notifications');
  }
};
