const express = require('express');
const Scholarship = require('../models/Scholarship');
const { ensureAuthenticated } = require('../middleware/auth');

const router = express.Router();

router.get('/', ensureAuthenticated, async (req, res) => {
    const scholarships = await Scholarship.find().sort({ createdAt: -1 });
    res.render('scholarship/index', { scholarships });
});

router.get('/new', ensureAuthenticated, (req, res) => {
    res.render('scholarship/new');
});

router.post('/', ensureAuthenticated, async (req, res) => {
    const { scholarshipHolder, age, phoneNumber, courseName, percentage } = req.body;
    const scholarship = new Scholarship({
        scholarshipHolder,
        age,
        phoneNumber,
        courseEnrolled: { courseName },
        percentage,
    });
    await scholarship.save();
    req.flash('success', 'Scholarship created successfully.');
    res.redirect(`/scholarship/${scholarship._id}`);
});

router.get('/:id', ensureAuthenticated, async (req, res) => {
    const scholarship = await Scholarship.findById(req.params.id);
    if (!scholarship) {
        req.flash('error', 'Scholarship not found.');
        return res.redirect('/scholarship');
    }
    res.render('scholarship/show', { scholarship });
});

router.get('/:id/edit', ensureAuthenticated, async (req, res) => {
    const scholarship = await Scholarship.findById(req.params.id);
    if (!scholarship) {
        req.flash('error', 'Scholarship not found.');
        return res.redirect('/scholarship');
    }
    res.render('scholarship/edit', { scholarship });
});

router.put('/:id', ensureAuthenticated, async (req, res) => {
    const { age, phoneNumber, courseName, percentage } = req.body;
    const scholarship = await Scholarship.findById(req.params.id);
    if (!scholarship) {
        req.flash('error', 'Scholarship not found.');
        return res.redirect('/scholarship');
    }

    scholarship.age = age;
    scholarship.phoneNumber = phoneNumber;
    scholarship.courseEnrolled = { courseName };
    scholarship.percentage = percentage;
    await scholarship.save();

    req.flash('success', 'Scholarship updated successfully.');
    res.redirect(`/scholarship/${scholarship._id}`);
});

module.exports = router;