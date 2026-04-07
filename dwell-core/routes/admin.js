const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const residentCtrl = require('../controllers/residentController');
const complaintCtrl = require('../controllers/complaintController');
const billCtrl = require('../controllers/billController');
const noticeCtrl = require('../controllers/noticeController');

router.use(isAuthenticated, isAdmin);

// Residents
router.get('/residents', residentCtrl.getAllResidents);
router.get('/residents/add', residentCtrl.getAddResident);
router.post('/residents/add', residentCtrl.postAddResident);
router.get('/residents/:id', residentCtrl.getResidentDetail);
router.delete('/residents/:id', residentCtrl.deleteResident);

// Complaints
router.get('/complaints', complaintCtrl.getAllComplaints);
router.put('/complaints/:id', complaintCtrl.updateComplaintStatus);
router.delete('/complaints/:id', complaintCtrl.deleteComplaint);

// Bills
router.get('/bills', billCtrl.getAllBills);
router.get('/bills/add', billCtrl.getAddBill);
router.post('/bills/add', billCtrl.postAddBill);
router.delete('/bills/:id', billCtrl.deleteBill);

// Payments
router.get('/payments', billCtrl.getAdminPayments);

// Notices
router.get('/notices', noticeCtrl.getAdminNotices);
router.get('/notices/add', noticeCtrl.getAddNotice);
router.post('/notices/add', noticeCtrl.postAddNotice);
router.delete('/notices/:id', noticeCtrl.deleteNotice);

module.exports = router;
