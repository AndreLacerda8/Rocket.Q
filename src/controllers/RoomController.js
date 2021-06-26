const Database = require("../db/config")

module.exports = {
    async create(req, res){
        const db = await Database()
        const pass = req.body.password
        let roomId
        let isRoom = true

        while(isRoom){
            // Gera id aleatorio da sala
            for(var i = 0; i < 6; i++){
                i == 0 ? roomId = Math.floor(Math.random() * 10).toString() :
                roomId += Math.floor(Math.random() * 10).toString()
            }
    
            // verifica se existe algum id igual
            const roomsExistsIds = await db.all(`SELECT id FROM rooms`)
            if(roomsExistsIds.length == 0){
                isRoom = false
            }
            else{
                isRoom = roomsExistsIds.some(roomExistId => roomExistId.id === parseInt(roomId))//o some retorna true ou false
            }

            // insere a sala se não tiver outra de mesmo id
            if(!isRoom){
                await db.run(`INSERT INTO rooms (
                    id,
                    pass
                ) VAlUES (
                    ${parseInt(roomId)},
                    "${pass}"
                )`);
            }
        }

        await db.close()

        res.redirect(`/room/${roomId}`)
    },

    async open(req, res){
        const db = await Database()

        const roomId = req.params.room
        const questions = await db.all(`SELECT * FROM questions WHERE room = ${roomId} and read = 0`)
        const questionsRead = await db.all(`SELECT * FROM questions WHERE room = ${roomId} and read = 1`)

        let isQuestions = true
        if(questions.length == 0){
            if(questionsRead.length == 0){
                isQuestions = false
            }
        }
        
        res.render('room', {roomId: roomId, questions: questions, questionsRead: questionsRead, isQuestions: isQuestions})
    },

    async enter(req, res){
        const db = await Database()
        const roomId = parseInt(req.body.roomId)

        const roomsExistsIds = await db.all(`SELECT id FROM rooms`)
        let isRoom = roomsExistsIds.some(roomExistId => roomExistId.id === roomId)
        if(isRoom) {
            res.redirect(`/room/${roomId}`)
        }
        else{
            res.render('error', {title: 'Sala não encontrada', roomId: 'null'})
        }
    },

    async delete(req, res){
        const db = await Database()
        const password = req.body.password
        const roomId = req.params.roomId

        const verifyRoom = await db.get(`SELECT * FROM rooms WHERE id = ${roomId}`)

        if(verifyRoom.pass == password){
            // Excluir a sala e as perguntas dela
            await db.run(`DELETE FROM rooms WHERE id = ${roomId}`)
            await db.run(`DELETE FROM questions WHERE room = ${roomId}`)
            res.redirect('/')
        }
        else{
            res.render('error', {title: 'Senha incorreta', roomId: roomId})
        }
    }
}