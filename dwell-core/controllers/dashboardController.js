const User = require('../models/User');
const Complaint = require('../models/Complaint');
const Bill = require('../models/Bill');
const Payment = require('../models/Payment');
const Notice = require('../models/Notice');
const Notification = require('../models/Notification');

exports.getDashboard = async (req, res) => {
  try {
    if (req.session.role === 'admin') {
      const totalResidents = await User.countDocuments({ role: 'resident' });
      const totalComplaints = await Complaint.countDocuments();
      const pendingComplaints = await Complaint.countDocuments({ status: 'Pending' });
      const totalBills = await Bill.countDocuments();
      const totalPayments = await Payment.countDocuments();

      // Monthly revenue - last 6 months
      const months = [];
      const revenueData = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const monthName = d.toLocaleString('default', { month: 'short' });
        const year = d.getFullYear();
        months.push(`${monthName} ${year}`);
        const payments = await Payment.find({
          paidAt: {
            $gte: new Date(year, d.getMonth(), 1),
            $lt: new Date(year, d.getMonth() + 1, 1)
          }
        });
        revenueData.push(payments.reduce((sum, p) => sum + p.amount, 0));
      }

      const monthlyRevenue = revenueData[revenueData.length - 1];
      const resolvedComplaints = await Complaint.countDocuments({ status: 'Resolved' });
      const paidBills = await Bill.countDocuments({ status: 'Paid' });
      const pendingBills = await Bill.countDocuments({ status: 'Pending' });

      const recentComplaints = await Complaint.find().populate('user', 'name flatNo').sort('-createdAt').limit(5);
      const recentPayments = await Payment.find().populate('user', 'name flatNo').sort('-paidAt').limit(5);

      res.render('admin/dashboard', {
        title: 'Admin Dashboard - Dwell Core',
        totalResidents, totalComplaints, pendingComplaints, totalBills, totalPayments,
        monthlyRevenue, resolvedComplaints, paidBills, pendingBills,
        recentComplaints, recentPayments,
        chartLabels: JSON.stringify(months),
        chartRevenue: JSON.stringify(revenueData),
        complaintChart: JSON.stringify([resolvedComplaints, pendingComplaints]),
        billChart: JSON.stringify([paidBills, pendingBills])
      });
    } else {
      const userId = req.session.userId;
      const user = await User.findById(userId);
      const myComplaints = await Complaint.find({ user: userId }).sort('-createdAt').limit(5);
      const myBills = await Bill.find({ flatNo: user.flatNo, status: 'Pending' }).sort('-createdAt');
      const myPayments = await Payment.find({ user: userId }).sort('-paidAt').limit(5);
      const notices = await Notice.find({ isActive: true }).sort('-createdAt').limit(5);
      const pendingCount = myBills.length;
      const totalDue = myBills.reduce((sum, b) => sum + b.totalAmount, 0);

      res.render('resident/dashboard', {
        title: 'My Dashboard - Dwell Core',
        user, myComplaints, myBills, myPayments, notices, pendingCount, totalDue
      });
    }
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error loading dashboard');
    res.redirect('/auth/login');
  }
};
