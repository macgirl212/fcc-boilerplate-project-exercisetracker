const User = require('../models/User')
const moment = require('moment')

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
            date = new Date()
        } else {
            date = new Date(date)
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
        res.status(201).json({ "description": description, "duration": duration, "date": date.toDateString() })
    } catch (error) {
        console.log(error)
    }
}

const getAllExercises = async (req, res) => {
    try {
        // get all params and query information
        const { _id: userID } = req.params
        const { from, to, limit } = req.query
        let maxExercises
        const queryObject = {}

        // select exercises if "from" and "to" params are passed
        // temp code, because idk why $gte and $lte aren't working, but this code does the same thing
        if (from && to) {
            queryObject.fromDate = new Date(from)
            queryObject.toDate = new Date(to)
            let formattedLog = []
            
            const allExercises = await User.find({  _id: userID })
            
            // find all the selected dates
            for (let i = 0; i < allExercises[0].log.length; i++) {
                if (moment(allExercises[0].log[i].date).isBetween(queryObject.fromDate, queryObject.toDate)) {
                    formattedLog.push(allExercises[0].log[i])
                }
            }

            // limit handler
            if (limit) {
                maxExercises = Number(limit)
            } else {
                maxExercises = allExercises[0].log.length
            }
            allExercises[0].log = formattedLog.slice(0, maxExercises)
            return res.status(200).send(allExercises)
        }
        // end of temp code

        const allExercises = await User.find({ _id: userID })
        const selectedExercises = allExercises[0].log

        res.status(200).send(selectedExercises)
    } catch (error) {
        console.log(error)
    }
}

module.exports = { createNewUser, getAllUsers, addNewExercise, getAllExercises }