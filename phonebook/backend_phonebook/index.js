const express = require('../../notes/node_modules/@types/express')
const app = express()
const morgan = require('morgan')
const cors = require('cors') //connecting server and frontend ... different ports(cross-origin resource sharing )

app.use(express.static('build'))
app.use(express.json())
app.use(cors())

//create "middleware"
const logger = morgan('tiny')

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send("<h1>Hello! We are in root/ <h1/>")
})

app.get('/api/persons', (request, response) => {
    response.send(persons)
})

app.get('/info', (request, response) => {
    response.send(
        `<h1>Phonebok has info for ${persons.length} people<h1/>
        ${new Date()}`
        )
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

app.post('/api/persons',  morgan(':method :url :status :res[content-length] - :response-time ms :aName :aNumber'), (request, response) => {
    const body = request.body  
    
    if(!body){
        return response.status(400).json({
            error: 'content missing'
        })
    }
    if(!body.name || !body.name){
        return response.status(400).json({
            error: 'name or number is missing'
        })
    }
    if(persons.find(person => body.name === person.name)){
        return response.status(400).json({
            error: 'name must be unique'
        })
    }
    
    const newID = Math.random() * 100000
    const personObject = {
        id: newID,
        name: body.name,
        number: body.number
    }
    persons = persons.concat(personObject)
    // console.log(persons)
    response.json(personObject)
    

    // console.log('type', app.use(morgan(':name :number :method :url :response-time')), )
    // console.log(body.name, body.number, typeof(body.name), typeof(body.number))
    // app.use(morgan('tiny', {stream: ':name :number'}))
    
    morgan.token('aName', function (request) { return JSON.stringify(request.body.name) })
    morgan.token('aNumber', function (request) { return JSON.stringify(request.body.number) })
})


//calling on middleware with a predefined format (for all HTML Requests that don't fall into one of these routes)
app.use(morgan('tiny'))


const PORT = 3001
app.listen(PORT,  () => {
    console.log(`Server running on port ${PORT}`)
})