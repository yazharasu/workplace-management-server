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
    Location: {
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

const Event = mongoose.model( 'Event' , eventSchema );
module.exports = Event;
