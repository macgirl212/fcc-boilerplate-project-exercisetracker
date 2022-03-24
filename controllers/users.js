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
            date = new Date(date.replace(/-/g, '\/')) // replacing "-" with "/" avoids errors in date
        }

        // log the new count of exercises
        const log = await User.findById(userID).exec()
        const count = await log.log.length

        const user = await User.findByIdAndUpdate(userID, {
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
        res.status(201).json({"username": user.username, "description": description, "duration": Number(duration), "date": date.toDateString(), "_id": user._id })
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
        let selectedLog = []

        // get all informtion from user id
        const allExercises = await User.find({  _id: userID })

        // select only the id, username, and count
        const selectedExercises = allExercises.map(({_id, username, count}) => ({
            _id: _id,
            username: username,
            count: count
        }))

        // check validity of from and to parameters
        if (from) {
            queryObject.fromDate = new Date(from.replace(/-/g, '\/'))
            if (isNaN(Date.parse(queryObject.fromDate))) {
                return res.status(500).send("Invalid date")
            }
        }

        if (to) {
            queryObject.toDate = new Date(to.replace(/-/g, '\/'))
            if (isNaN(Date.parse(queryObject.toDate))) {
                return res.status(500).send("Invalid date")
            }
        }

        // select exercises if "from" and "to" params are passed
        // temp code, because idk why $gte and $lte aren't working, but this code does the same thing, even though it's ugly :/
        if (from && to) {
            // find all the selected dates
            for (let i = 0; i < allExercises[0].log.length; i++) {
                if (moment(allExercises[0].log[i].date).isBetween(queryObject.fromDate, queryObject.toDate)) {
                    selectedLog.push(allExercises[0].log[i])
                }
            }
            // format dates
            selectedLog = selectedLog.map(({description, duration, date, _id}) => ({
                description: description,
                duration: duration,
                date: date.toDateString(),
                _id: _id
            }))
        } else {
            // find all exercises and format dates
            selectedLog = allExercises[0].log.map(({description, duration, date, _id}) => ({
                description: description,
                duration: duration,
                date: date.toDateString(),
                _id: _id
            }))
        }

        // limit handler
        if (limit) {
            maxExercises = Number(limit)
        } else {
            maxExercises = allExercises[0].log.length
        }
        selectedLog = selectedLog.slice(0, maxExercises)

        // put selected and formatted log in the selected exercises object
        selectedExercises[0].log = selectedLog

        // end of temp code

        res.status(200).send(selectedExercises)
    } catch (error) {
        console.log(error)
    }
}

module.exports = { createNewUser, getAllUsers, addNewExercise, getAllExercises }