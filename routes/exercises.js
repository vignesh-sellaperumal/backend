const router = require('express').Router();
let Exercise =  require('../models/exercise.model');

router.route('/').get((req, res) => {
    Exercise.find().sort({"createdAt" : -1})
        .then(exercises => res.json(exercises))
        .catch(err => res.status(400).json('Error: '+err));
});
router.route('/personal/:username').get((req, res) => {
    Exercise.find({"username" : req.params.username}).sort({"createdAt" : -1})
        .then(exercises => res.json(exercises))
        .catch(err => res.status(400).json('Error: '+err));
});

router.route('/top').get((req, res) => {
    var now = new Date();
    if(now.getDate() == 1)
        var yesterday = new Date(now.getFullYear(), now.getMonth(), 30);
    else
        var yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate()-2);
    Exercise.aggregate([
        {$match : {createdAt : {$gte: yesterday}}},
        {$group : { _id : '$tag', count : {$sum : 1}}},
        {$sort : {count : -1}},
        {$limit : 10}
        ])
        .then(exercises => res.json(exercises))
        .catch(err => res.status(400).json('Error: '+err));
});

router.route('/add').post((req,res) => {
    const tag = req.body.tag;
    const thought = req.body.thought;
    const username = req.body.username;
    const time = req.body.time;
    const newExercise = new Exercise({ 
        tag,
        thought,
        username,
        time
    });

    newExercise.save()
        .then(() => res.json('Exercise added!'))
        .catch(err => res.status(400).json('Error: '+err));
});

router.route('/:id').get((req, res) => {
    Exercise.findById(req.params.id)
        .then(exercise => res.json(exercise))
        .catch(err => res.status(400).json('Error: '+err));
});

router.route('/remove/:id').delete((req, res) => {
    Exercise.findByIdAndDelete(req.params.id)
        .then(() => res.json('Successfully deleted!'))
        .catch(err => res.status(400).json('Error: '+err));
});

router.route('/update/:id').post((req, res) => {
    Exercise.findById(req.params.id)
        .then(exercise => {
            exercise.username = req.body.username;
            exercise.description = req.body.description;
            exercise.duration = Number(req.body.duration);
            exercise.date = Date.parse(req.body.date);

            exercise.save()
                .then(() => res.json('Exercise updated!'))
                .catch(err => res.status(400).json('Error: '+err));
                    
        })
        .catch(err => res.status(400).json('Error: '+err));
});

module.exports = router;