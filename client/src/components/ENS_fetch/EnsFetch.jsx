import { useState, useEffect } from 'react'
import { useEnsName } from 'react-moralis'
import { ByMoralis } from "react-moralis";
const EnsFetch = () => {
    const [toSearch, setToSearch] = useState("");
    const { address } = useEnsName(toSearch);

    const handleSearch = () => {
        console.log(address)
    }

    useEffect(() => {

    },[address])

  return (
    <div>
        <h1>ENS Fetch</h1>
        <p>Search for ENS</p>
        <input type="text" placeholder="Search ENS" onChange={(event) => {
            setToSearch(event.target.value)
        }}/>
        <button onClick={handleSearch}>Search</button>
        {
            address ? <p>{address}</p> : <p>Not Found</p>
        }
    </div>
  )
}

export default EnsFetch