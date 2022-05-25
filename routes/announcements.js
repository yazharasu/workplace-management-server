const express = require('express');
const router = express.Router();
const Company = require('../models/Company');

// Add new announcement
router.post( '/announcement', async (req, res) => {
    try{
        await Company.findOneAndUpdate( { "employees.email": req.body.email }, 
            { "$push": { "announcements": 
            {
            "createdBy": req.body.userName,
            "subject": req.body.subject,
            "description": req.body.description,
            "notifyTo": req.body.notifyTo
            }
        }   } 
        )
        res.json({
            status: "SUCCESS",
            message: "Announcement is posted"
        })
    } 
    catch (err) {
        throw new Error( err.message )
    }
})

// Update an announcement
router.patch( '/announcementUpdate', async (req, res) => {
    try{
        await Company.findOneAndUpdate( { "employees.email": req.body.email, "announcements._id":  req.body.id }, 
            { "announcements": {
            "createdBy": req.body.userName,
            "subject": req.body.subject,
            "description": req.body.description,
            "notifyTo": req.body.notifyTo
            } }
        )
        .then(
            res.json({
                status: "SUCCESS",
                message: "Announcement is updated"
            })
        )
    } 
    catch (err) {
        throw new Error( err.message )
    }
})

// Add new event
router.post( '/event', async (req, res) => {
    try{
        await Company.findOneAndUpdate( { "employees.email": req.body.email }, 
            { "$push": { "events": 
            {
            "createdBy": req.body.userName,
            "subject": req.body.subject,
            "date": req.body.subject,
            "time": req.body.subject,
            "location": req.body.subject,
            "description": req.body.description,
            "notifyTo": req.body.notifyTo
            }
        }   } 
        )
        res.json({
            status: "SUCCESS",
            message: "Event is posted"
        })
    } 
    catch (err) {
        throw new Error( err.message )
    }
})

// Update an event
router.patch( '/eventUpdate', async (req, res) => {
    try{
        await Company.findOneAndUpdate( { "employees.email": req.body.email, "events._id":  req.body.id }, 
            { "events": 
            {
            "createdBy": req.body.userName,
            "subject": req.body.subject,
            "date": req.body.subject,
            "time": req.body.subject,
            "location": req.body.subject,
            "description": req.body.description,
            "notifyTo": req.body.notifyTo
            }
            }
        )
        .then(
            res.json({
                status: "SUCCESS",
                message: "Event is updated"
            })
        )
    } 
    catch (err) {
        throw new Error( err.message )
    }
})

// Add new reminder
router.post( '/reminder', async (req, res) => {
    try{
        await Company.findOneAndUpdate( { "employees.email": req.body.email }, 
            { "$push": { "reminders": 
            {
            "createdBy": req.body.userName,
            "subject": req.body.subject,
            "expirationDate": req.body.expirationDate,
            "description": req.body.description,
            "notifyTo": req.body.notifyTo
            }
        }   }
        )
        res.json({
            status: "SUCCESS",
            message: "Reminder is created"
        })
    } 
    catch (err) {
        throw new Error( err.message )
    }
})

// Update an reminder
router.patch( '/reminderUpdate', async (req, res) => {
    try{
        await Company.findOneAndUpdate( { "employees.email": req.body.email, "reminders._id":  req.body.id }, 
            { "reminders": 
            {
            "createdBy": req.body.userName,
            "subject": req.body.subject,
            "expirationDate": req.body.expirationDate,
            "description": req.body.description,
            "notifyTo": req.body.notifyTo
            }
            }
        )
        .then(
            res.json({
                status: "SUCCESS",
                message: "Reminder is updated"
            })
        )
    } 
    catch (err) {
        throw new Error( err.message )
    } 
})

// get all announcements
router.get( '/getAnnouncements', async (req, res) => {
    try{
        console.log(req.body.email)
        const company = await Company.find( { "employees.email": req.body.email } )
        const announcements = company[0].announcements
        const events = company[0].events
        const reminders = company[0].reminders
        const allAnnouncments = announcements.concat(events, reminders);

        if(allAnnouncments.length>0) {
            res.json( 
                allAnnouncments?.sort(function compare(a, b) {
                    var dateA = new Date(a.updatedAt);
                    var dateB = new Date(b.updatedAt);
                    return dateB-dateA;
                }) 
            )
        }else {
            res.json( { } )
        }
    } 
    catch (err) {
        throw new Error( err.message )
    }
})

module.exports = router;
