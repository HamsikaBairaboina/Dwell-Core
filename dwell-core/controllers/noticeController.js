const Notice = require('../models/Notice');
const Notification = require('../models/Notification');
const User = require('../models/User');

exports.getNotices = async (req, res) => {
  try {
    const notices = await Notice.find({ isActive: true }).populate('author', 'name').sort('-createdAt');
    res.render('notices', { title: 'Notice Board - Dwell Core', notices });
  } catch (err) {
    req.flash('error', 'Error loading notices');
    res.redirect('/dashboard');
  }
};

exports.getAdminNotices = async (req, res) => {
  try {
    const notices = await Notice.find().populate('author', 'name').sort('-createdAt');
    res.render('admin/notices', { title: 'Notices - Dwell Core', notices });
  } catch (err) {
    req.flash('error', 'Error');
    res.redirect('/dashboard');
  }
};

exports.getAddNotice = (req, res) => {
  res.render('admin/addNotice', { title: 'Add Notice - Dwell Core' });
};

exports.postAddNotice = async (req, res) => {
  try {
    const { title, content, category, priority } = req.body;
    await Notice.create({ title, content, category, priority, author: req.session.userId });

    // Notify all residents
    const residents = await User.find({ role: 'resident' });
    const notifications = residents.map(r => ({
      user: r._id,
      title: `📢 New Notice: ${title}`,
      message: content.substring(0, 100) + (content.length > 100 ? '...' : ''),
      type: 'notice',
      link: '/notices'
    }));
    if (notifications.length) await Notification.insertMany(notifications);

    req.flash('success', 'Notice posted');
    res.redirect('/admin/notices');
  } catch (err) {
    req.flash('error', 'Failed to post notice');
    res.redirect('/admin/notices/add');
  }
};

exports.deleteNotice = async (req, res) => {
  try {
    await Notice.findByIdAndDelete(req.params.id);
    req.flash('success', 'Notice deleted');
    res.redirect('/admin/notices');
  } catch (err) {
    req.flash('error', 'Delete failed');
    res.redirect('/admin/notices');
  }
};
