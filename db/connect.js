const mongoose = require('mongoose')

connectDB = (url) => {
    return mongoose
        .connect(url, {
            useNewUrlParser: true
        })
}

module.exports = connectDB