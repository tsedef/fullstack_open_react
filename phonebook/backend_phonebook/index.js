require('dotenv').config({path: '../.env'})
const express = require('express')
const app = express()
const cors = require('cors') //connecting server and frontend ... different ports(cross-origin resource sharing )
const morgan = require('mongoose-morgan')
const mongoose = require('mongoose')
const Person = require('./models/person')

//Logger
// app.use(morgan({
//     connectionString: `${process.env.MONGODB_URI}`
// }));
app.use(express.static(__dirname + '/build'))
console.log('path', __dirname)
app.use(express.json())
app.use(cors())

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
  }
  
  app.use(requestLogger)

// const uri = process.env.MONGODB_URI
// mongoose.connect(uri)
//   .then(result => {
//     console.log(`connected to MongoDB ${uri} in INDEXJS`)
//   })
//   .catch((error) => { 
//     console.log('error connecting to MongoDB:', error.message)
//   })

// let persons = [
//     { 
//       "id": 1,
//       "name": "Arto Hellas", 
//       "number": "040-123456"
//     },
//     { 
//       "id": 2, 
//       "name": "Ada Lovelace", 
//       "number": "39-44-5323523"
//     },
//     { 
//       "id": 3,
//       "name": "Dan Abramov", 
//       "number": "12-43-234345"
//     },
//     { 
//       "id": 4,
//       "name": "Mary Poppendieck", 
//       "number": "39-23-6423122"
//     }
// ]

app.get('/', (request, response) => {
    response.send("<h1>Hello! We are in root/ <h1/>")
})

app.get('/info', (request, response) => {
    response.send(
        `<h1>Phonebok has info for ${persons.length} people<h1/>
        ${new Date()}`
        )
})  

app.get('/api/persons', (request, response) => {
    Person
    .find({})
    .then(persons => response.json(persons))
    .catch(error => response.json(error))
})


app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const singlePerson = persons.find(eachPerson => {
        return eachPerson.id === id 
    })

    if(singlePerson){

        response.json(singlePerson)
    }else {

        response.status(400).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(eachPerson => eachPerson.id !== id)
  
    response.status(204).end()
})

//morgan({connectionString: process.env}, ':method :url :status :res[content-length] - :response-time ms :aName :aNumber'
app.post('/api/persons', (request, response) => {
    const body = request.body  
    console.log('request body', body)
    
    if(body === undefined || body === null ){
        return response.status(400).json({
            error: 'content missing'
        })
    }
    if(!body.name || !body.number){
        return response.status(400).json({
            error: 'name or number is missing'
        })
    }

    //ensuring there are only unique names
    // if(Person.findOne({name: body.name})){
    //     return response.status(400).json({ error: 'name already exists in phonebook' })
    // }
    
    // const newPerson = Person.create({name: body.name, number: body.number})
    const personInstance =  new Person({name: body.name, number: body.number})

    personInstance.save()
    .then(savedPerson => response.json(savedPerson))
    // mongoose.connection.close()

    // OR use save() 
    //const personInstance =  new Person({name: body.name, number: body.number})
    //await personInstance.save() --needs async function i think
    
    // morgan.token('aName', function (request) { return JSON.stringify(request.body.name) })
    // morgan.token('aNumber', function (request) { return JSON.stringify(request.body.number) })
})


//calling on middleware with a predefined format (for all HTML Requests that don't fall into one of these routes)
// app.use(morgan('tiny'))


const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })