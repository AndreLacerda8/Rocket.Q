const express = require('express')
const QuestionController = require('./controllers/QuestionController')
const RoomController = require('./controllers/RoomController')

const route = express.Router()

route.get('/', (req, res) => res.render('index', {page: 'enter-room'})) //esse 2° parametro é uma variavel para usarmos com o ejs
// route.get('/room-not-found', (req, res) => res.render('index', {page: 'enter-room', roomNotFound: true}))

route.get('/create-pass', (req, res) => res.render('index', {page: 'create-pass'}))

route.get('/room/:room', RoomController.open)
route.post('/create-room', RoomController.create)
route.post('/enterroom', RoomController.enter)
route.post('/delete-room/:roomId', RoomController.delete)

route.post('/question/create/:room', QuestionController.create)
route.post('/question/:room/:question/:action', QuestionController.index)

module.exports = route