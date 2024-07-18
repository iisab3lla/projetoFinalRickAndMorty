const api = axios.create({
    baseURL: 'https://rickandmortyapi.com/api'
  })

// Index
async function getCardsByIds(ids) {
  try {
    const requests = ids.map(async id => { //mapear os ids e cria um array de promessas
      const characterResponse = await api.get(`/character/${id}`)
      const characterData = characterResponse.data
      const urlLastEpisode = characterData.episode[characterData.episode.length - 1]

      const episodeResponse = await api.get(urlLastEpisode)
      const episodeData = episodeResponse.data

      characterData.lastEpisode = episodeData

      return characterData
    })

    const responses = await Promise.all(requests) //esperar as promessas
    return responses

  } catch (error) {
    return error
  }
}

async function getFooter() {
  try {
    const characterResponse = await api.get('/character')
    const locationResponse = await api.get ('/location')
    const episodeResponse = await api.get ('/episode')
    const response = {characterResponse, locationResponse, episodeResponse}
    return response

  } catch (error) {
    return error    
  }
}

// Details
async function getCardsByName(query) {  
  try {
    const response = await api.get(`/character/?name=${query}`)
    return response.data.results

  } catch (error) {
    return error
  }
}

async function getLastEpisode(urlLastEpisode) {
  try {
    const episodeResponse = await api.get(urlLastEpisode)
    const lastEpisode = episodeResponse.data

    return lastEpisode
    
  } catch (error) {
    
  }
}