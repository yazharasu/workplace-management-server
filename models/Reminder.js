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


const Remainder = mongoose.model( 'Reminder' , reminderSchema );
module.exports = Remainder;

