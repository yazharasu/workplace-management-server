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

const Announcements = mongoose.model( 'Announcements' , announcementSchema );
module.exports = Announcements;