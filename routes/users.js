const express = require('express')
const router = express.Router()

const { createNewUser, getAllUsers, addNewExercise } = require('../controllers/users')

router.route('/').get(getAllUsers).post(createNewUser)
router.route('/:id/exercises').post(addNewExercise)

module.exports = router