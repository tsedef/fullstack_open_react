import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/notes'

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

//Since the names of the keys and the assigned variables are the same, 
//we can write the object definition with a more compact syntax: 
/* INITIAL
getAll: getAll, 
create: create, 
update: update 
*/
export default { getAll, create, update }