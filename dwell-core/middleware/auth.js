const Notification = require('../models/Notification');

exports.isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) return next();
  req.flash('error', 'Please login to access this page');
  res.redirect('/auth/login');
};

exports.isAdmin = (req, res, next) => {
  if (req.session && req.session.role === 'admin') return next();
  req.flash('error', 'Access denied. Admin only.');
  res.redirect('/dashboard');
};

exports.isResident = (req, res, next) => {
  if (req.session && req.session.userId) return next();
  req.flash('error', 'Please login first.');
  res.redirect('/auth/login');
};

exports.setLocals = async (req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.role = req.session.role || null;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.unreadCount = 0;

  if (req.session.userId) {
    try {
      const count = await Notification.countDocuments({ user: req.session.userId, isRead: false });
      res.locals.unreadCount = count;
    } catch (e) {}
  }
  next();
};
