function alertToast(message, type) {
  const container = document.getElementById("container-toast")

  container.innerHTML = `        
      <div class="toast align-items-center text-bg-${type}" id="toast" role="alert" aria-live="assertive" aria-atomic="true">
          <div class="d-flex">
              <div class="toast-body">
                  ${message}
              </div>
              <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
      </div>`

  const toastNotification = new bootstrap.Toast("#toast")
  toastNotification.show()
}

function showLoading(show) {
  const listCards = document.getElementById('list-cards')

  if (show) {
      listCards.innerHTML = `
      <div class="d-flex align-items-center justify-content-start">
          <h5 class="fst-italic fs-2 text-success me-2">
          Buscando Informações
          </h5>
          <span class="spinner-border spinner-border-sm text-light" aria-hidden="true"></span>
          </div>
      </div>
      `
  } else {
      listCards.innerHTML = ''
  }
}