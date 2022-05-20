import phoneService from '../services/phonebook'
import Phonebook from '../Phonebook'
const Persons = ({personsToShow}) => {
    return(
    personsToShow.map(single => <p key={single.id}>{single.name} {single.number} <button onClick={() => {phoneService.remove(single.id);}}>delete</button></p>)
    //{personsToShow.forEach(person => {<button onSubmit={() => phoneService.remove(person.id)}>delete</button>})}
    )
}

export default Persons