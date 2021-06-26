import Modal from './modal.js'

const modal = Modal()

const modalTitle = document.querySelector('.modal h2')
const modalDescription = document.querySelector('.modal p')
const modalButton = document.querySelector('.modal button')

const checkButtons = document.querySelectorAll('.actions a.check')
checkButtons.forEach(button => {
    button.addEventListener('click', handleClick)
})

const deleteButtons = document.querySelectorAll('.actions a.delete')
deleteButtons.forEach(button => {
    button.addEventListener('click', (event) => handleClick(event, false))
})

function handleClick(event, check = true){
    event.preventDefault()

    const roomId = document.querySelector('#room-id').dataset.id //esse dataset é pq tem um data-id no ejs
    const questionId = event.currentTarget.dataset.id //pegando o currentTarget evitamos o problema de quando alguem clica na imagem e ele considera a imagem como target, nesse caso aqui, sempre será o a.
    const action = check ? 'check' : 'delete'

    const form = document.querySelector('.modal form')
    form.setAttribute('action', `/question/${roomId}/${questionId}/${action}`)
    
    const text = check ? 'Marcar como lida' : 'Excluir'

    modalTitle.innerHTML = text
    modalDescription.innerHTML = `Tem certeza que deseja ${text.toLocaleLowerCase()} esta pergunta?`
    modalButton.innerHTML = `Sim, ${text.toLocaleLowerCase()}`

    check ? modalButton.classList.remove('red') :
        modalButton.classList.add('red')

    modal.open()
}



//Copiar código da sala ao clicar no botão
const buttonIdRoom = document.querySelector('.button#room-id')
buttonIdRoom.addEventListener('click', e => copyCode(e))

function copyCode(event) {
    const statusResult = document.querySelector('.status-copy')
    try{
        statusResult.innerHTML = '<p>Código copiado</p>'
        showResultCopy(statusResult)
        navigator.clipboard.writeText(event.currentTarget.dataset.id)
    }
    catch(e){
        statusResult.innerHTML = '<p>Código copiado</p>'
        showResultCopy(statusResult)
    }
    
    document.querySelector('#room header .buttons').classList.remove('show')
}

function showResultCopy(statusResult){
    statusResult.classList.add('active')
    setTimeout(() => {
        statusResult.classList.remove('active')
    }, 3000)
}


//Deletar sala
const buttonDeleteRoom = document.querySelector('#deleteRoom')
buttonDeleteRoom.addEventListener('click', e => {
    const roomId = document.querySelector('#room-id').dataset.id

    const form = document.querySelector('.modal form')
    form.setAttribute('action', `/delete-room/${roomId}`)

    modalTitle.innerHTML = 'Excluir sala'
    modalDescription.innerHTML = 'Tem certeza que deseja excluir esta sala'
    modalButton.innerHTML = `Sim, excluir sala`

    modal.open()

    document.querySelector('#room header .buttons').classList.remove('show')
})


// Menu da room
document.querySelector('.buttons-mobile .hamburguer').addEventListener('click', () => {
    document.querySelector('.buttons').classList.toggle('show')
})