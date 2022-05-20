import { useState, useEffect } from 'react'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import Persons from './components/Persons'
import axios from 'axios'
import phoneService from './services/phonebook'
import Notification from './components/Notification'

const Phonebook = () => {
  const [persons, setPersons] = useState([])
  const [filteredPersons, setFilteredPersons] = useState(persons) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('00-1234567')
  const [newFilter, setFilter] = useState('')
  const [addMessage, setAddMessage] = useState(null)

  useEffect(() => {
    // let temp = phoneService.getAll()
    // console.log("useAll", temp)
    phoneService.getAll()
    .then(person => setPersons(person))
  }, [])
  
  const addToPersons = (event) => {
    event.preventDefault()
    const personObject = { name: newName, number: newNumber }

    let personAlreadyExists = (persons.some(person => person.name === newName))
    // console.log(`someVal: ${someVal}`)

    if(personAlreadyExists === true){
      console.log("in if ")
      if(window.confirm(`${newName} is already added to the Phonebook. Replace the old number with a new one?`)){
        phoneService.update((persons.find(e => e.name === newName)).id, personObject)
        setPersons(persons)
        setAddMessage(`Added ${newName}`)
        setTimeout(() => {
          setAddMessage(null)
        },5000)
      }
    }else{
      console.log("in else");
      phoneService.create(personObject)
      .then(person => {
        setPersons(persons.concat(person))
        setAddMessage(`Added ${newName}`)
        setTimeout(() => {
          setAddMessage(null)
        }, 5000)
      })
      .catch(error => {
        console.log(error)
      })
    }
    
    setNewName('')
    setNewNumber('')
  }
  const handleAddName = (event) => {
    setNewName(event.target.value)
  }
  const handleAddNumber = (event) => {
    setNewNumber(event.target.value)
  }
  const handleFilter = (event) => {
    if(event.target.value.length === 0) {setFilter('')}
    else {
      setFilter(event.target.value.toLowerCase())
      console.log("within handleFilter... new filter is", newFilter, "event target is", event.target.value.toLowerCase())
      setFilteredPersons(persons.filter(element => element.name.toLowerCase().includes(newFilter)))
    }
  }

  // const handleDeletion = (e) => {
  //   setPersons(persons)
  // }

  let personsToShow = newFilter.length > 0 ? persons.filter((element, index) => element.name.toLowerCase().includes(newFilter)) : persons
  return (
    <div>

      <h2>Phonebook</h2>
      filter shown with 
      <Filter filterVal={newFilter} filterOnChange={handleFilter}/>
  
      <h2>add a new</h2>
      <Notification message={addMessage}/>
      <PersonForm submitHandler={addToPersons} nameInputVal={newName} nameOnChange={handleAddName} numberInputVal={newNumber} numberOnChange={handleAddNumber}/>
      
      <div>debug: {newName}</div>
 
      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow} />

    </div>
  )
}

export default Phonebook  