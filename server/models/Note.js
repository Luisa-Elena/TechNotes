const mongoose = require('mongoose')
// const AutoIncrement = require('mongoose-sequence')(mongoose)

const noteSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        title: {
            type: String,
            required: true
        },
        text: {
            type: String,
            required: true
        },
        completed: {
            type: Boolean,
            default: false
        },
        // ticket: {
        //     type: Number,
        // }
    },
    // timestamps: true --> it adds two fields, createdAt and updatedAt
    // to the documents (or records) that will be stored in the corresponding MongoDB collection
    {
        timestamps: true
    }
)

// noteSchema.plugin(AutoIncrement, { //we provide an options object
//     inc_field: 'ticket', // the increment field is named 'ticket'
//     id: 'ticketNums', // id called 'ticketNums' inside a "counter collection"
//     start_seq: 500 //the tickets will start from 500
// })

module.exports = mongoose.model('Note', noteSchema)