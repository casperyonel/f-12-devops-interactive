const express = require('express')
const cors = require('cors')
const path = require('path')

const app = express()

const students = ['Jeddy']

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
})

app.get('/api/students', (req, res) => {
    res.status(200).send(students)
})

const port = process.env.PORT || 4545
// Once heroku reads that line of code Heroku knows it has to run it's own port (process.env.PORT), and 4545 is just like a safegaurd for us to run it on our own computer

app.listen(port, () => {
    console.log(`They're taking the Hobbits to ${port}`)
})