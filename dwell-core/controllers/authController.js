const User = require('../models/User');

exports.getLogin = (req, res) => {
  if (req.session.userId) return res.redirect('/dashboard');
  res.render('auth/login', { title: 'Login - Dwell Core' });
};

exports.postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      req.flash('error', 'Please provide email and password');
      return res.redirect('/auth/login');
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      req.flash('error', 'Invalid email or password');
      return res.redirect('/auth/login');
    }

    if (!user.isActive) {
      req.flash('error', 'Your account has been deactivated. Contact admin.');
      return res.redirect('/auth/login');
    }

    req.session.userId = user._id;
    req.session.role = user.role;
    req.session.user = { id: user._id, name: user.name, email: user.email, role: user.role, flatNo: user.flatNo, avatar: user.avatar };
    req.flash('success', `Welcome back, ${user.name}!`);
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong. Try again.');
    res.redirect('/auth/login');
  }
};

exports.getRegister = (req, res) => {
  if (req.session.userId) return res.redirect('/dashboard');
  res.render('auth/register', { title: 'Register - Dwell Core' });
};

exports.postRegister = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, flatNo, floor, phone, familyMembers } = req.body;

    if (password !== confirmPassword) {
      req.flash('error', 'Passwords do not match');
      return res.redirect('/auth/register');
    }

    const existing = await User.findOne({ email });
    if (existing) {
      req.flash('error', 'Email already registered');
      return res.redirect('/auth/register');
    }

    const user = await User.create({ name, email, password, flatNo, floor, phone, familyMembers: familyMembers || 1, role: 'resident' });
    req.session.userId = user._id;
    req.session.role = user.role;
    req.session.user = { id: user._id, name: user.name, email: user.email, role: user.role, flatNo: user.flatNo, avatar: user.avatar };
    req.flash('success', 'Account created! Welcome to Dwell Core.');
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Registration failed. Try again.');
    res.redirect('/auth/register');
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login');
  });
};

exports.getRegisterAdmin = (req, res) => {
  if (req.session.userId) return res.redirect('/dashboard');
  res.render('auth/register-admin', { title: 'Register Admin - Dwell Core' });
};

exports.postRegisterAdmin = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, phone, department, adminSecret } = req.body;

    // Validate secret key
    const correctSecret = process.env.ADMIN_SECRET || 'dwellcore_admin_2024';
    if (adminSecret !== correctSecret) {
      req.flash('error', 'Invalid Admin Secret Key. Access denied.');
      return res.redirect('/auth/register-admin');
    }

    if (password !== confirmPassword) {
      req.flash('error', 'Passwords do not match');
      return res.redirect('/auth/register-admin');
    }

    const existing = await User.findOne({ email });
    if (existing) {
      req.flash('error', 'Email already registered');
      return res.redirect('/auth/register-admin');
    }

    const admin = await User.create({
      name, email, password, phone,
      department: department || 'Society Management',
      role: 'admin',
      flatNo: 'ADMIN',
      isActive: true
    });

    req.session.userId = admin._id;
    req.session.role = admin.role;
    req.session.user = { id: admin._id, name: admin.name, email: admin.email, role: admin.role, flatNo: admin.flatNo, avatar: admin.avatar };
    req.flash('success', `Admin account created! Welcome, ${admin.name}.`);
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Registration failed. Try again.');
    res.redirect('/auth/register-admin');
  }
};
