const express = require('express')
const router = express.Router()

const { createNewUser, getAllUsers } = require('../controllers/users')

router.route('/').get(getAllUsers).post(createNewUser)

module.exports = router