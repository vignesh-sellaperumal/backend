const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const exerciseSchema = new Schema({
    tag: { type: String, required: true},
    thought: { type: String, required: true},
    username: { type: String, required: true},
    time : {type: String, required: true}
}, {
    timestamps:true,
});

const Exercise =  mongoose.model('Exercise', exerciseSchema);

module.exports = Exercise; 