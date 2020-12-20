require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))
app.use(morgan('tiny'))

morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body'));

let persons = [
      { 
        "name": "Arto Hellas", 
        "number": "040-123456",
        "id": 1
      },
      { 
        "name": "Ada Lovelace", 
        "number": "39-44-5323523",
        "id": 2
      },
      { 
        "name": "Dan Abramov", 
        "number": "12-43-234345",
        "id": 3
      },
      { 
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122",
        "id": 4
      }
    ]


app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons.map(person => person.toJSON()))
  })
})

app.get('/info', (req, res) => {
  Person.count({})
    .then(count => {
      const info = `<p>Phonebook has info for ${count}</p>
                    <p>${(new Date()).toString()}
                    `
      res.send(info)
    })
})

app.get('/api/persons/:id', (req, res) => {
  Person.findById(req.params.id).then(person => {
    res.json(person.toJSON())
  })
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)
    
  res.status(204).end()
})

  const generateId = () => {
    const randomId = Math.floor(Math.random() * 1000)
    return randomId
  }

  app.post('/api/persons', (req, res) => {
    const body = req.body
  
    if (!body.name || !body.number) {
      return res.status(400).json({ 
        error: 'content missing' 
      })
    }

    if (persons.map(person => person.name).find(name => name === body.name)) {
        return res.status(400).json({ 
          error: 'name must be unique' 
        })
      }
  
    const person = new Person({
      name: body.name,
      number: body.number,
      id: generateId(),
    })
  
    person.save().then(savedPerson => {
      res.json(savedPerson.toJSON())
    })

  })


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})