const formSearch = document.querySelector('.form-search')
let page = 1
let limit = determineLimit()

const btn = document.querySelector("button");

function proxPage() {
  btn.addEventListener("submit", function () {
    window.location.href = `detalhes.html`
 });
}

document.addEventListener('DOMContentLoaded', async () => {
    await showFooter()
    await listCards()
})

formSearch.addEventListener('submit', (event) => {
  event.preventDefault()
  const search = document.getElementById('search-input').value
    if (search) {
        window.location.href = `details.html?query=${encodeURIComponent(search)}`
    }
})

async function showFooter() {
  const response = await getFooter()

  const totalCharacters = response.characterResponse.data.info.count
  const totalLocations = response.episodeResponse.data.info.count
  const totalEpisodes = response.locationResponse.data.info.count  

  const footerInfo = document.getElementById('footer-info')
  footerInfo.innerHTML = `
    <div class="col d-flex justify-content-center gap-sm-5 gap-3 align-items-center small text-sm-fs-6 py-4">
      <p><span>PERSONAGENS:</span> <span class="text-light char-info">${totalCharacters}</span></p>
      <p><span>LOCALIZAÇÕES:</span> <span class="text-light char-info">${totalLocations}</span></p>
      <p><span>EPISÓDIOS:</span> <span class="text-light char-info">${totalEpisodes}</span></p>
    </div>  
  `
}

async function listCards() {  
  showLoading(true)
  const startId = (page - 1) * 6 + 1 //page-1 para index (base-zero), x6 (personagens p/pg) +1 p/ id inicial
  const ids = Array.from({ length: 6 }, (_, i) => startId + i) //array c/ 6 itens, onde i = id inicial+1  

  const validIds = ids.filter(id => id <= 826)

  if (validIds.length === 0) {
    alertToast("Não há mais personagens para exibir", 'info')
    return
  }

  const cards = await getCardsByIds(validIds)
  showLoading(false)

  if (cards && cards.length) {
    showCards(cards)
    createPagination()
  } else {
    alertToast("Erro ao carregar personagens", 'danger')
  } 
}

function showCards(cards) {  
    const listCards = document.getElementById('list-cards')
    listCards.innerHTML = ''

    if(limit < 6) {
      for (let i = 0; i < limit; i++) {
        if (i < cards.length) {
            const card = cards[i]
            const newCard = createCard(card)
            listCards.appendChild(newCard)
        }
      }
      // Inserir a estrutura da paginação no final
      const paginationCol = document.createElement('div')
      paginationCol.classList.add('col-12', 'col-md-6', 'px-1', 'mt-5')
      paginationCol.innerHTML = `
          <nav aria-label="...">
              <ul class="pagination justify-content-center">                
              </ul>
          </nav>
      `
      listCards.appendChild(paginationCol)
    }
    
    if(limit >= 6) {    //se tela comum
      for (let i = 0; i < 6; i++) { // Inserir os primeiros cinco cards
          if (i < cards.length) {
              const card = cards[i]
              const newCard = createCard(card)
              listCards.appendChild(newCard)
          }
      }
      // Inserir a estrutura da paginação entre o quinto e o sexto card
      const paginationCol = document.createElement('div')
      paginationCol.classList.add('col-12','col-md-6', 'col-lg-5', 'col-xl-4', 'mb-5', 'mx-4')
      paginationCol.innerHTML = `
          <nav aria-label="">
              <ul class="pagination justify-content-center">                
              </ul>
          </nav>
      `
      listCards.appendChild(paginationCol)

    }
}

function createCard(card) {
  const newCard = document.createElement('div')
  newCard.classList.add('col-12', 'col-md-4', 'mb-4')
  newCard.innerHTML = `
      <div class="card bg-dark">
          <div class="row g-0">
              <div class="col-5">
                  <img src="${card.image}" class="img rounded-start" alt="${card.name}">
              </div>
              <div class="col-8">
                  <div class="card-body offset-3 fw-bold text-white">
                      <p class="card-title fs-5 lh-4 lh-md-base" id="name">${card.name}</p>
                      <p class="small card-text lh-4" id="status-species">
                        <span class="status-dot ${card.status === 'Alive' ? 'bg-success' : 'bg-danger'}"></span>                        
                        ${card.status} - ${card.species}</p>
                      <p class="small card-text text-secondary ps-2 lh-2">Última localização conhecida</p>
                      <p class="small card-text py-3" id="location">${card.location.name}</p>
                      <p class="small card-text text-secondary lh-3">Visto a última vez em:</p>
                      <p class="small card-text lh-1 ps-2" id="episode">${card.lastEpisode.name}</p>
                  </div>
              </div>
          </div>
      </div>
  `
  return newCard
}

function createPagination() {  
    const pagination = document.querySelector('.pagination')
    const maxPages = 4 // Máximo de páginas visíveis na paginação
    const totalPages = 138 // Total de páginas baseado no total de personagens

    const pageGroup = Math.floor((page - 1) / maxPages) * maxPages + 1 // controlar o grupo de páginas mostrado na paginação
    let startPage = Math.max(1, pageGroup) //página inicial nunca menor que 1
    let endPage = Math.min(totalPages, startPage + maxPages - 1) // página final não pode passar do totalPages

    if(endPage - startPage < maxPages - 1) { //ajustar a exibição de paginação
      startPage = Math.max(1, endPage - maxPages + 1)
    }

    let paginationHTML = `
        <li class="page-item ${page === 1 ? 'disabled' : ''}">
            <a class="page-link" id="first-page-link">&laquo;</a>
        </li>
        <li class="page-item ${page === 1 ? 'disabled' : ''}">
            <a class="page-link" id="prev-link">Anterior</a>
        </li>
    `

    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <li class="page-item ${page === i ? 'active' : ''}">
                <a class="page-link">${i}</a>
            </li>
        `
    }

    paginationHTML += `
        <li class="page-item ${page === totalPages ? 'disabled' : ''}">
            <a class="page-link" id="next-link">Próximo</a>
        </li>
        <li class="page-item ${page === totalPages ? 'disabled' : ''}">
            <a class="page-link" id="last-page-link">&raquo;</a>
        </li>
    `

    pagination.innerHTML = paginationHTML

    const links = document.querySelectorAll('.page-link')  
    links.forEach((link) => {
      link.addEventListener('click', async () => {
  
        switch (link.id) {
          case 'prev-link':
            if (page > 1) page--;        
            break;
          case 'next-link':
            if (page < totalPages) page++;
            break;
          case 'first-page-link':
            if (page !== 1) page = 1;
            break;
          case 'last-page-link':
            if (page !== totalPages) page = totalPages;
            break;
          default:
            page = Number(link.innerText)
            break;
        }
  
        await listCards()
      })
    })
}

function determineLimit() {
  // Determina o número de cards a exibir com base no tamanho da tela
  const screenWidth = window.innerWidth
  if (screenWidth <= 380) {
      return 1
  } else if (screenWidth <= 480) {
      return 2
  } else if (screenWidth <= 780) {
      return 3
  } else if (screenWidth <= 980) {
      return 4
  } else {
    return 6
  }
}