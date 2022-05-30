const mongoose = require('mongoose')
require('dotenv').config({path: '../.env'})

const uri = process.env.MONGODB_URI

mongoose.connect(uri, {
  useUnifiedTopology: true,
  useNewUrlParser: true
  })
  .then(result => {
    console.log('connected to MongoDB in MODEL')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)

// console.log(Person.length)
// if(process.argv.length === 3){
//     console.log('phonebook:')
//     Person
//     .find({})
//     .then(result => {
//         console.log(result)
//         result.forEach(person => {
//             console.log(person)
//         })
//         mongoose.connection.close()
//     })
// }else{

//     person.save().then(result => {
//     console.log(`added ${person.name} number ${person.number} to phonebook`)
//     mongoose.connection.close()
//     })
//     //program prints all notes stored in database
//     // 
// }