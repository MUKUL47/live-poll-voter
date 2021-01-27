exports.socketController = (function(){
    let socketIo;
    let firebase;
    const socketController = io => {
        socketIo = io;
        firebase = require('../firebase').firebase
        startListening(new Audience())
    }
    return socketController;
    function startListening(audience){
        socketIo.on('connection', socket => {
            socket.on('JOIN_AUDIENCE', roomId => {
                console.log('JOIN-',roomId)
                audience.enterStage(roomId, socket.id)
            })
            socket.on('disconnected', () => audience.leaveStage(roomId, socket.id))
        })
        require('../server').listener.on('FROM_CONTROLLER', (roomId, votes) =>{
            const roomAudience = audience.getAudience(roomId);
            console.log('roomAudience-',roomAudience)
            roomAudience.forEach(participant => socketIo.to(participant).emit('NEW_VOTES', votes))
        })
    }
}())

class Audience{
    constructor(){
        this.roomData = {};
    }
    
    createStage(roomId, participant){
        const p = {};
        p[participant] = participant
        const r = {};
        r[roomId] = p
        this.roomData = {...this.roomData, ...r}
        console.log('audience.roomData ',this.roomData)
    }

    enterStage(roomId, participant){
        if(!this.roomData[roomId]) {
            this.createStage(roomId, participant)
            return
        };
        const p = {};
        p[participant] = participant
        this.roomData[roomId][participant] = { ...this.roomData[roomId], ...p }
    }

    leaveStage(roomId, participant){
        if(!this.roomData[roomId]) return;
        delete this.roomData[roomId][participant]
        if(Object.keys(this.roomData[roomId]).length === 0){
            delete this.roomData[roomId]
        }
    }

    getAudience(roomId){
        if(!this.roomData[roomId]) return [];
        return Object.values(this.roomData[roomId])
    }
}