const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const detailsSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 3
    },
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 3
    },
    about: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 3
    }
}, {
    timestamps:true, 
});

const Details =  mongoose.model('Details', detailsSchema);

module.exports = Details;