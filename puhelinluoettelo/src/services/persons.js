import axios from 'axios'

const baseUrl ="/api/"

const getAll = () => {
    return axios.get(baseUrl + 'persons')
}
const addPerson = (person) => {
    return axios.post(baseUrl + 'persons', person)
    
}


const deletePerson = (person) => {
    return axios.delete(baseUrl + 'persons/' + person.id)
}

const updatePerson = (person) => {
    return axios.put(baseUrl + 'persons/' + person.id, person)
}
const functions = {getAll, addPerson, deletePerson, updatePerson}
export default functions