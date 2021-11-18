const express = require('express')
const cors = require('cors')
const path = require('path')

// include and initialize the rollbar library with your access token
var Rollbar = require('rollbar')

var rollbar = new Rollbar({
  accessToken: '0e18c07afa394c5fa064fa1e88e30fa8',
  captureUncaught: true,
  captureUnhandledRejections: true,
})
// this is an npm package, that checks and detects certain things, automatically connects to our rollbar application and sends things there

// record a generic message and send it to Rollbar
rollbar.log('Hello world!')

const app = express()

const students = ['Jeddy']

app.get('/', (req, res) => {
    
    res.sendFile(path.join(__dirname, '/public/index.html'))
    rollbar.info("HTML file served successfully")
})

app.get("/api/students", (req, res) => {
    rollbar.info("Someone got the list of students on page load")
    res.status(200).send(students)
})

app.post('/api/students', (req, res) => {
    // let's us add a student
    let { name } = req.body
    // from frontend
    name = name.trim()
    
    const index = students.findIndex(studentName => studentName === name)
    // where the student exists in our array db, checjking if the name we're passing through is ALREADY in the array
    // if findIndex cannot find the name, it returns -1 by default

    if (index === -1 && name !== "") {
        students.push(name)
        rollbar.log("Student added successfully", { author: 'Jeddy', type: 'manual entry' })
        // This logs to rollbar what just happened, message of first parameter, and object for 2nd param with who sent it and the type
        // first argument is what it will tell us, and 2nd is object with 2 keys, author and type. Rollbar requires us to log this way
        res.status(200).send(students)
    } else if (name === "") {
        rollbar.error("no name given")
        res.status(400).send("must provide a name")
    } else {
        rollbar.error('student already exists')
        res.status(400).send('That student already exists')
    }
})

app.use(rollbar.errorHandler())

const port = process.env.PORT || 4545
// Once heroku reads that line of code Heroku knows it has to run it's own port (process.env.PORT), and 4545 is just like a safegaurd for us to run it on our own computer

app.listen(port, () => {
    console.log(`They're taking the Hobbits to ${port}`)
})