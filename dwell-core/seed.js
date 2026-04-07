require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Complaint = require('./models/Complaint');
const Bill = require('./models/Bill');
const Notice = require('./models/Notice');
const Notification = require('./models/Notification');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Complaint.deleteMany({});
    await Bill.deleteMany({});
    await Notice.deleteMany({});
    await Notification.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create Admin
    const admin = await User.create({
      name: 'Admin Manager',
      email: 'admin@dwellcore.com',
      password: 'admin123',
      role: 'admin',
      phone: '+91 9000000001',
      flatNo: 'ADMIN',
      isActive: true
    });
    console.log('👑 Admin created: admin@dwellcore.com / admin123');

    // Create Residents
    const residents = await User.create([
      { name: 'Arjun Sharma', email: 'arjun@dwellcore.com', password: 'resident123', role: 'resident', flatNo: 'A-101', floor: '1st', phone: '+91 9811001101', familyMembers: 3 },
      { name: 'Priya Mehta', email: 'priya@dwellcore.com', password: 'resident123', role: 'resident', flatNo: 'A-102', floor: '1st', phone: '+91 9811001102', familyMembers: 2 },
      { name: 'Rahul Verma', email: 'rahul@dwellcore.com', password: 'resident123', role: 'resident', flatNo: 'B-201', floor: '2nd', phone: '+91 9811001201', familyMembers: 4 },
      { name: 'Neha Gupta', email: 'neha@dwellcore.com', password: 'resident123', role: 'resident', flatNo: 'B-202', floor: '2nd', phone: '+91 9811001202', familyMembers: 1 },
      { name: 'Vikram Singh', email: 'vikram@dwellcore.com', password: 'resident123', role: 'resident', flatNo: 'C-301', floor: '3rd', phone: '+91 9811001301', familyMembers: 5 },
    ]);
    // Also alias first resident for "resident@dwellcore.com" demo login
    await User.create({ name: 'Demo Resident', email: 'resident@dwellcore.com', password: 'resident123', role: 'resident', flatNo: 'D-101', floor: '4th', phone: '+91 9999999999', familyMembers: 2 });
    console.log('🏠 6 Residents created');

    // Create Complaints
    await Complaint.create([
      { user: residents[0]._id, flatNo: 'A-101', title: 'Water leakage in bathroom', description: 'There is a continuous water leakage from the ceiling pipe in the main bathroom. It started 2 days ago and is getting worse.', category: 'Plumbing', priority: 'High', status: 'Pending' },
      { user: residents[1]._id, flatNo: 'A-102', title: 'Flickering lights in hallway', description: 'The corridor lights near flat A-102 have been flickering for a week. Could be an electrical issue.', category: 'Electrical', priority: 'Medium', status: 'In Progress', adminNote: 'Electrician scheduled for tomorrow' },
      { user: residents[2]._id, flatNo: 'B-201', title: 'Lift not working on 2nd floor', description: 'The lift does not stop at the 2nd floor. We have to walk from the 1st floor every time.', category: 'Lift', priority: 'High', status: 'Resolved', adminNote: 'Repaired by technician on 15th', resolvedAt: new Date() },
      { user: residents[3]._id, flatNo: 'B-202', title: 'Garbage not collected', description: 'Garbage has not been collected for 3 days from the B block dustbin area. It is causing bad odour.', category: 'Cleaning', priority: 'Medium', status: 'Pending' },
      { user: residents[4]._id, flatNo: 'C-301', title: 'Parking slot occupied', description: 'My designated parking slot C-12 has been occupied by an unknown vehicle for 2 days.', category: 'Parking', priority: 'Low', status: 'Pending' },
    ]);
    console.log('📢 Complaints created');

    // Create Bills for this and last month
    const now = new Date();
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const thisMonth = months[now.getMonth()];
    const lastMonth = months[now.getMonth() === 0 ? 11 : now.getMonth() - 1];
    const thisYear = now.getFullYear();
    const lastYear = now.getMonth() === 0 ? thisYear - 1 : thisYear;

    for (const r of residents) {
      await Bill.create({ user: r._id, flatNo: r.flatNo, month: thisMonth, year: thisYear, maintenance: 2500, water: 300, power: 800, status: 'Pending', dueDate: new Date(thisYear, now.getMonth() + 1, 10) });
      const paidBill = await Bill.create({ user: r._id, flatNo: r.flatNo, month: lastMonth, year: lastYear, maintenance: 2500, water: 280, power: 750, status: 'Paid', paidAt: new Date(lastYear, now.getMonth() === 0 ? 11 : now.getMonth() - 1, 15) });
    }
    console.log('💰 Bills created (current & last month)');

    // Create Notices
    const notices = await Notice.create([
      { title: 'Water Supply Interruption – 28th', content: 'Due to scheduled maintenance work, water supply will be interrupted on 28th from 9 AM to 2 PM. Please store water accordingly. We apologize for the inconvenience.', category: 'Maintenance', priority: 'Important', author: admin._id },
      { title: 'Society Meeting – December 1st', content: 'All residents are requested to attend the monthly society meeting on December 1st at 6:30 PM in the community hall. Agenda: security upgrades, festival decorations, and maintenance fund discussion.', category: 'Event', priority: 'Normal', author: admin._id },
      { title: 'Fire Drill – This Saturday', content: 'A mandatory fire safety drill will be conducted this Saturday at 11 AM. All residents must participate. Assembly point is near the main gate. More details from the security desk.', category: 'Emergency', priority: 'Urgent', author: admin._id },
      { title: 'Maintenance Charges Revised', content: 'Effective from next month, the monthly maintenance charges will be revised to ₹2,800 (from ₹2,500). This covers enhanced security services, gym equipment upgrades, and garden maintenance.', category: 'Finance', priority: 'Important', author: admin._id },
    ]);
    console.log('📋 Notices created');

    // Create some notifications
    for (const r of residents) {
      await Notification.create([
        { user: r._id, title: `📢 New Notice: ${notices[0].title}`, message: notices[0].content.substring(0, 100), type: 'notice', link: '/notices' },
        { user: r._id, title: '💰 New Bill Generated', message: `Your bill for ${thisMonth} ${thisYear} is ₹3,600. Please pay by due date.`, type: 'bill', link: '/bills' },
      ]);
    }
    console.log('🔔 Notifications created');

    console.log('\n✅ Seed complete! You can login with:');
    console.log('   👑 Admin:    admin@dwellcore.com    / admin123');
    console.log('   🏠 Resident: resident@dwellcore.com / resident123');
    console.log('   🏠 Resident: arjun@dwellcore.com   / resident123\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
};

seed();
