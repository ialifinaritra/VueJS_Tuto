import axios from 'axios'

const JSON_BIN_SECRET = import.meta.env.VITE_JSON_BIN_SECRET

const instance = axios.create({
    baseURL: 'https://api.jsonbin.io/v3/b/620c078bca70c44b6e992c13',
    headers: {'X-Master-Key': JSON_BIN_SECRET}
})

export async function getAll () {
    const res = await instance.get('/latest')
    return res.data.record
}

// Mise a jour de toutes les taches 
export async function updateAll (newTasks) {
    await instance.put('/', newTasks)

}