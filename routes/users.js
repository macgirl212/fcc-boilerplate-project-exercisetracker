const express = require('express')
const router = express.Router()

const { createNewUser, getAllUsers, addNewExercise, getAllExercises } = require('../controllers/users')

router.route('/').get(getAllUsers).post(createNewUser)
router.route('/:_id/exercises').post(addNewExercise)
router.route('/:_id/logs').get(getAllExercises)

module.exports = router