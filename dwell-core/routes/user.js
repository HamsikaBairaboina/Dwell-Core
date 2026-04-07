const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const complaintCtrl = require('../controllers/complaintController');
const billCtrl = require('../controllers/billController');
const noticeCtrl = require('../controllers/noticeController');
const userCtrl = require('../controllers/userController');

router.use(isAuthenticated);

// Complaints
router.get('/complaints', complaintCtrl.getMyComplaints);
router.get('/complaints/new', complaintCtrl.getAddComplaint);
router.post('/complaints/new', complaintCtrl.postAddComplaint);
router.delete('/complaints/:id', complaintCtrl.deleteMyComplaint);

// Bills
router.get('/bills', billCtrl.getMyBills);
router.post('/bills/:id/pay', billCtrl.payBill);

// Payments
router.get('/payments', billCtrl.getPayments);

// Notices
router.get('/notices', noticeCtrl.getNotices);

// Profile
router.get('/profile', userCtrl.getProfile);
router.post('/profile', userCtrl.updateProfile);
router.post('/profile/password', userCtrl.changePassword);

// Notifications
router.get('/notifications', userCtrl.getNotifications);
router.post('/notifications/clear', userCtrl.clearNotifications);

module.exports = router;
