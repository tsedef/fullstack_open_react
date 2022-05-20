import axios from 'axios'
//Because of our situation, both the frontend and the backend are at the same address, (SEE express static (build in backend and frontend))
// we can declare baseUrl as a relative URL. This means we can leave out the part declaring the server.
const baseUrl = '/api/notes'

//'https://tsedefsnotes.herokuapp.com' 
//frontend also works with the backend on Heroku!
//http://localhost:3001/api/notes
/*
whenever express gets an HTTP GET request it will first check if the build directory contains a file corresponding to the request's address. If a correct file is found, express will return it.
Now HTTP GET requests to the address www.serversaddress.com/index.html or www.serversaddress.com will show the React frontend. GET requests to the address www.serversaddress.com/api/notes will be handled by the backend's code.
*/
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