const Filter = ({ filterVal, filterOnChange }) => {

  return(
    <input value={filterVal} onChange={filterOnChange}></input>
  )
}

export default Filter