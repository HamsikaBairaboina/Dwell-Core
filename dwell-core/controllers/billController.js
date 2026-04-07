const Bill = require('../models/Bill');
const Payment = require('../models/Payment');
const User = require('../models/User');
const Notification = require('../models/Notification');

// Admin
exports.getAllBills = async (req, res) => {
  try {
    const { search, status } = req.query;
    const query = {};
    if (search) query.flatNo = { $regex: search, $options: 'i' };
    if (status) query.status = status;

    const bills = await Bill.find(query).populate('user', 'name').sort('-createdAt');
    res.render('admin/bills', { title: 'Bills - Dwell Core', bills, search: search || '', status: status || '' });
  } catch (err) {
    req.flash('error', 'Error loading bills');
    res.redirect('/dashboard');
  }
};

exports.getAddBill = async (req, res) => {
  const residents = await User.find({ role: 'resident' }).sort('flatNo');
  res.render('admin/addBill', { title: 'Add Bill - Dwell Core', residents });
};

exports.postAddBill = async (req, res) => {
  try {
    const { flatNo, month, year, maintenance, water, power } = req.body;
    const user = await User.findOne({ flatNo, role: 'resident' });
    const bill = await Bill.create({
      user: user ? user._id : null,
      flatNo, month, year: parseInt(year),
      maintenance: parseFloat(maintenance) || 0,
      water: parseFloat(water) || 0,
      power: parseFloat(power) || 0,
      dueDate: new Date(parseInt(year), new Date(`${month} 1`).getMonth() + 1, 10)
    });

    if (user) {
      await Notification.create({
        user: user._id,
        title: 'New Bill Generated 💰',
        message: `Your bill for ${month} ${year} is ₹${bill.totalAmount}. Please pay by due date.`,
        type: 'bill',
        link: '/bills'
      });
    }
    req.flash('success', 'Bill created successfully');
    res.redirect('/admin/bills');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to create bill');
    res.redirect('/admin/bills/add');
  }
};

exports.deleteBill = async (req, res) => {
  try {
    await Bill.findByIdAndDelete(req.params.id);
    req.flash('success', 'Bill deleted');
    res.redirect('/admin/bills');
  } catch (err) {
    req.flash('error', 'Delete failed');
    res.redirect('/admin/bills');
  }
};

// Resident
exports.getMyBills = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    const { status } = req.query;
    const query = { flatNo: user.flatNo };
    if (status) query.status = status;
    const bills = await Bill.find(query).sort('-createdAt');
    res.render('resident/bills', { title: 'My Bills - Dwell Core', bills, status: status || '' });
  } catch (err) {
    req.flash('error', 'Error loading bills');
    res.redirect('/dashboard');
  }
};

exports.payBill = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);
    if (!bill || bill.status === 'Paid') {
      req.flash('error', 'Bill not found or already paid');
      return res.redirect('/bills');
    }

    bill.status = 'Paid';
    bill.paidAt = new Date();
    await bill.save();

    const payment = await Payment.create({
      user: req.session.userId,
      bill: bill._id,
      amount: bill.totalAmount,
      method: req.body.method || 'Online',
      transactionId: 'TXN' + Date.now(),
      flatNo: bill.flatNo,
      month: bill.month,
      year: bill.year
    });

    await Notification.create({
      user: req.session.userId,
      title: 'Payment Successful ✅',
      message: `Payment of ₹${bill.totalAmount} for ${bill.month} ${bill.year} received. Txn: ${payment.transactionId}`,
      type: 'payment',
      link: '/bills'
    });

    req.flash('success', `Payment of ₹${bill.totalAmount} successful! Transaction ID: ${payment.transactionId}`);
    res.redirect('/bills');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Payment failed');
    res.redirect('/bills');
  }
};

exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.session.userId }).sort('-paidAt');
    res.render('resident/payments', { title: 'Payment History - Dwell Core', payments });
  } catch (err) {
    req.flash('error', 'Error loading payments');
    res.redirect('/dashboard');
  }
};

exports.getAdminPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate('user', 'name flatNo').sort('-paidAt');
    const total = payments.reduce((sum, p) => sum + p.amount, 0);
    res.render('admin/payments', { title: 'All Payments - Dwell Core', payments, total });
  } catch (err) {
    req.flash('error', 'Error loading payments');
    res.redirect('/dashboard');
  }
};
