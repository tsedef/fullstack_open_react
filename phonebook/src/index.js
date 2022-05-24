import React from 'react'
import ReactDOM from 'react-dom/client'
import axios from 'axios'
// import App from './App'
import Collections from './Collections'
import Phonebook from './Phonebook'
import './index.css'

// Collections db
// axios  //More appropriate way to use a promise and its response -- chained method calls
//   .get('http://localhost:3001/notes')
//   .then(response => {
//     const notes = response.data
//     console.log(notes)
//   })

//Phonebook db
// axios   //More appropriate way to use a promise and its response -- chained method calls
//   .get('http://localhost:3001/persons')
//   .then(response => {
//     const persons = response.data
//     console.log(`persons from json db: ${persons}`)
//   })

ReactDOM.createRoot(document.getElementById('root')).render(
  // <Collections />)
  <Phonebook />)