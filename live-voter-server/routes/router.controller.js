const routes = require('express')();
const firebase = require('../firebase').firebase
const keys = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890'
class Utils{
    static sendResponse(response, code, message, url){
        response.status(code).send({ message, timestamp : new Date().valueOf(), url, code })
    }
    static getRandKey(len){
        return Array(len || 8).fill(1).map(() => keys.charAt(Utils.getRandomNumber(0, 62))).join('')
    }
    
    static getRandomNumber(min, max){
        return Math.floor(Math.random() * (max - min) + min)
    }
}
class PollRoutes extends Utils{
    static async createPoll(req, res){
        try{
            const { title, description, options, voteType } = req.body;
            if(!title || !options){
               return Utils.sendResponse(res, 404, 'Title or options are missing', req.originalUrl)
            }
            else if(typeof options != 'object' || options.length < 2){
               return Utils.sendResponse(res, 404, 'Poll must have atleast 2 options', req.originalUrl)
            }
            const obj = {};
            const pollId = Utils.getRandKey();
            const votes = {}
            options.forEach(option => votes[option] = 0)
            obj[pollId] = {
                title : title,
                description : description,
                options : options,
                votes : votes,
                totalVotes : 0,
                createdAt : new Date().valueOf(),
                voteType : voteType || 'IP',
                voters : ['_']
            };
            await firebase.database().ref().update(obj);
            Utils.sendResponse(res, 201, pollId, req.originalUrl)
        }catch(e){
            Utils.sendResponse(res, 500, `${e}`, req.originalUrl)
        }
    }

    static async vote(req, res){
        try{
            const { ip } = req.body;
            const pollData = (await firebase.database().ref(req.params.id).once('value')).toJSON()
            pollData['options'] = Object.values(pollData['options'])
            const voteType = pollData['voteType']
            let option = pollData['options'][Number(req.params.option)]
            if(!option){
                return Utils.sendResponse(res, 401, 'Invalid option', req.originalUrl)
            }
            if(voteType === 'IP'){
                if(!ip){
                    return Utils.sendResponse(res, 404, 'IP not provided for IP protected poll', req.originalUrl)
                }
                if(pollData.voters && Object.values(pollData.voters).find(i => i == ip)){
                    return Utils.sendResponse(res, 401, 'You have already voted', req.originalUrl)
                }
                pollData['voters'] = [ip, ...Object.values(pollData.voters)] 
            }
            pollData['votes'][`${option}`] += 1
            pollData['totalVotes'] += 1
            const newPoll = {};
            newPoll[req.params.id] = pollData
            await firebase.database().ref().update(newPoll);
            require('../server').listener.emit('FROM_CONTROLLER', req.params.id, pollData)
            Utils.sendResponse(res, 200, pollData, req.originalUrl)
        }catch(e){
            Utils.sendResponse(res, 500, `${e}`, req.originalUrl)
        }
    }
    static async getPoll(req, res){
        try{
            const pollData = (await firebase.database().ref(req.params.id).once('value')).toJSON()
            if(!pollData){
                return Utils.sendResponse(res, 404, 'Poll not found', req.originalUrl)
            }
            pollData['options'] = Object.values(pollData['options'])
            Utils.sendResponse(res, 200, pollData, req.originalUrl)
        }catch(e){
            Utils.sendResponse(res, 500, `${e}`, req.originalUrl)
        }
    }
}

routes.post('/poll', PollRoutes.createPoll)
routes.get('/vote/:id', PollRoutes.getPoll)
routes.post('/vote/:id/:option', PollRoutes.vote)
module.exports.routes = routes;