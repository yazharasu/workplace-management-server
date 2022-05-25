const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema( {
    commentUser: {
        type: String,
        default:""
    },
    comment: {
        type: String,
        default:""
    },
    } , { timestamps: true }  
);

const announcementSchema =  new Schema( {
    createdBy: {
        type: String
    },
    subject: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    notifyTo: {
        type: Array,
        default: []
    },
    comments:  {
        type: [commentSchema],
    },
}, { timestamps: true }
)

const reminderSchema =  new Schema( {
    createdBy: {
        type: String
    },
    subject: {
        type: String,
        required: true
    },
    expirationDate: {
        type: Date
    },
    description: {
        type: String
    },
    notifyTo: {
        type: Array,
        default: []
    },
    comments:  {
        type: [commentSchema],
    },
}, { timestamps: true }
)

const eventSchema =  new Schema( {
    createdBy: {
        type: String
    },
    subject: {
        type: String,
        required: true
    },
    date: {
        type: Date
    },
    time: {
        type: Date
    },
    location: {
        type: Date
    },
    description: {
        type: String
    },
    notifyTo: {
        type: Array,
        default: []
    },
    comments:  {
        type: [commentSchema],
    }
}, { timestamps: true }
)

const userSchema =  new Schema( {
    email: {
        type: String,
        maxlength: 25,
        unique: true,
        required: true
    },
    firstName: {
        type: String,
        maxlength: 25,
        required: true
    },
    lastName: {
        type: String,
        maxlength: 25,
        required: true
    },
    password: {
        type: String,
        minlength: 4,
        required: true
    },
    dept: {
        type: String
    },
    designation: {
        type: String
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    loggedIn: {
        type: Boolean,
        default: false
    }
});

const companySchema = new Schema( {
    companyName: {
        type: String, 
        default:""
    },
    location: {
        type: String,
        default:""
    },
    noEmp: {
        type: Number
    },
    domainName: {
        type: String,
        default:""
    },
    employees: {
        type: [userSchema],
        default: []
    },
    announcements: {
        type: [announcementSchema],
        default: []
    },
    events: {
        type: [eventSchema],
        default: []
    },
    reminders: {
        type: [reminderSchema],
        default: []
    },
    isVerified: {
        type: Boolean,
        default: false
    }

    }, { timestamps: true }  
);


const Company = mongoose.model( 'Company', companySchema );
module.exports = Company;