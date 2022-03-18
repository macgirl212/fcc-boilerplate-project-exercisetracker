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
        const { id: userID } = req.params
        const description = req.body.description
        const duration = req.body.duration
        let tempDate = req.body.date

        // date formatting
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat']

        if (tempDate === '') {
            tempDate = new Date()
        } else {
            tempDate = new Date(tempDate)
        }

        let day = tempDate.getDay()
        let date = tempDate.toISOString().replace(/T.*/,'').split('-')
        date.push(date.shift())
        const fullDate = `${daysOfWeek[day]} ${date.join(' ')}`
        // end date formatting

        await User.findByIdAndUpdate(userID, {
                $push: { 
                    "log" : {
                         "description": description, 
                        "duration": duration, 
                        "date": fullDate 
                    }
                }
            }, {
                new: true,
                runValidators: true
            }
        )
        res.status(201).json({ "description": description, "duration": duration, "date": fullDate })
    } catch (error) {
        console.log(error)
    }
}

module.exports = { createNewUser, getAllUsers, addNewExercise }