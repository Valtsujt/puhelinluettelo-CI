const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
require('dotenv').config()
const Person = require('./models/person')

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

morgan.token('body', function (req) { return JSON.stringify(req.body) })


app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {


    Person.find({}).then(result => {
        res.json(result)
    })
})
app.get('/info', (req, res) => {
    Person.find({}).then(result => {
        res.send(`<p>Phonebook has info for ${result.length} people</p> <p>${new Date()}</p>`)
    })

})

app.delete('/api/persons/:id', (request, response, next) => {

    Person.findByIdAndDelete(request.params.id).then(() => {
        response.status(204).end()
    }).catch(error => next(error))


})

app.get('/api/persons/:id', (request, response, next) => {
    const id = Number(request.params.id)
    console.log(id)
    Person.findById(request.params.id).then(person => {
        console.log(person)
        if (!person) {
            response.status(404).end()
        }
        response.json(person)
    }).catch(error => next(error))


})

app.post('/api/persons', (request, response, next) => {
    //console.log(request)

    const body = request.body

    if (!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    }

    if (!body.number) {
        return response.status(400).json({
            error: 'Number missing'
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })


    person.save().then(p => {
        response.json(p)
    }).catch(error => next(error))


})


app.put('/api/persons/:id', (request, response, next) => {
    const id = Number(request.params.id)
    console.log(id)
    const body = request.body
    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true })
        .then(person => {

            response.json(person)
        }).catch(error => next(error))


})
const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}


app.use(errorHandler)
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})