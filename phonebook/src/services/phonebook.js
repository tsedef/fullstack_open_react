import axios from 'axios'

const baseUrl = '/api/persons'
//'/api/persons' //express static using 'build'
//http://localhost:3001/api/persons

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = newObject => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

const remove = (id) => {
  if(window.confirm(`Delete ${baseUrl}/${id}?`)) {
      axios.delete(`${baseUrl}/${id}`)
      //Phonebook.handleDeletion()
  }
}

//Since the names of the keys and the assigned variables are the same, 
//we can write the object definition with a more compact syntax: 
/* INITIAL
getAll: getAll, 
create: create, 
update: update 
*/
export default { getAll, create, update, remove }