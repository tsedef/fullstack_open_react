const PersonForm = ({submitHandler, nameInputVal, nameOnChange, numberInputVal, numberOnChange}) => {
    return(
    <form onSubmit={submitHandler}>
        <div> 
          name: <input 
          value={nameInputVal}
          onChange={nameOnChange}
          />
          <br/>
          number: <input
          value={numberInputVal}
          onChange={numberOnChange}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
    </form>
    )
}

export default PersonForm