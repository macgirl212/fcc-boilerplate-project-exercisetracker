const User = require('../models/User')

// add user
const createNewUser = async (req, res) => {
    try {
        const newUser = await User.create({
            username: req.body.username
        })
        res.status(201).json({ 
            username: newUser.username,
            _id: newUser._id
         })
    } catch (error) {
        console.log(error)
    }
}

// get list of all users
const getAllUsers = async (req, res) => {
    try {
        const allUsers = await User.find({}).select('username')
        res.status(200).send(allUsers)
    } catch (error) {
        console.log(error)
    }
}

// post new exercise
const addNewExercise = async (req, res) => {
    try {
        // get all params from body
        const { _id: userID } = req.params
        const description = req.body.description
        const duration = req.body.duration
        let date = req.body.date

        // date formatting
        if (date === '') {
            date = new Date().toDateString()
        } else {
            date = new Date(date).toDateString()
        }

        // log the new count of exercises
        const log = await User.findById(userID).exec()
        const count = await log.log.length

        await User.findByIdAndUpdate(userID, {
                $push: { 
                    "log": {
                         "description": description, 
                        "duration": duration, 
                        "date": date 
                    }
                },
                $set: {
                    "count": count + 1
                }
            }, {
                new: true,
                runValidators: true
            }
        )
        res.status(201).json({ "description": description, "duration": duration, "date": date })
    } catch (error) {
        console.log(error)
    }
}

const getAllExercises = async (req, res) => {
    try {
        const { _id: userID } = req.params

        const allExercises = await User.find({ _id: userID })
        res.status(200).send(allExercises)
    } catch (error) {
        console.log(error)
    }
}

module.exports = { createNewUser, getAllUsers, addNewExercise, getAllExercises }