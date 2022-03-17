const User = require('../models/User')

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

const getAllUsers = async (req, res) => {
    try {
        const allUsers = await User.find({})
        res.status(200).send(allUsers)
    } catch (error) {
        console.log(error)
    }
}

module.exports = { createNewUser, getAllUsers }