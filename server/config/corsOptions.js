const allowedOrigins = require('./allowedOrigins')

//third-party middleware
const corsOptions = {
    origin: (origin, callback) => {
        if(allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true) //first parameter is an error, the second one is a boolean -> allowed or not
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true, //this sets access control allow credentials header
    optionsSuccessStatus: 200
}

module.exports = corsOptions