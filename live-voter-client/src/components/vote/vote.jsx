import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { defaultHeaders, LoopIcon } from '../../utils/material.modules'
import {VotePoll, VoteStats} from './vote.render'
import {useSelector} from 'react-redux'
function Vote(props) {
    const [voteContext, setVoteContext] = useState({ 
        voteStat : 1, 
        pollData : null, 
        id : window.location.pathname.split('/')[2],
        voteStatus : 'Vote',
        newPollVotes : null
    })
    const history = useHistory();
    const reduxSelector = useSelector(s => s.test)
    const setContext = obj => setVoteContext({ ...voteContext,  ...obj})
    const fetchPoll = isFirst => {
        fetch('http://localhost:8080'+window.location.pathname, { headers: defaultHeaders}). 
        then(r => r.json()).
        then(response => {
            if(response['message']){
                if(isFirst){
                    if(response.code != 200){
                        setTimeout(() => alert(response.message || 'Unknown error occured'), 500)
                        history.push('/create')
                        return 
                    }
                    setContext({pollData : response.message})
                }
                else if(!isFirst && response.code === 200){
                    setContext({pollData : response.message})
                }
            }
        })
    }
    useEffect(() => {
        document.title = `Live Poll | ${voteContext?.pollData?.title || voteContext.id}`
    },[voteContext?.pollData])
    useEffect(() => {
        document.title = 'Live Poll'
        setContext({ pollData : null })
        fetchPoll(true)
    },[reduxSelector])
    useEffect(() => {
        if(voteContext.voteStat === 1) return
        fetchPoll(false)
    }, [voteContext.voteStat])
    const findCookie = () => {
        const cookies = document.cookie.split(';')
        return cookies.find(cookie => cookie.trim() === `VOTED_${voteContext.id}=${voteContext.id}`)
    }
    const getIp = () =>{
        return new Promise((resolve)=>{
            fetch('https://ipv4.icanhazip.com').then(r=>r.text()).then(resolve).catch(e => { throw Error(e) })
        })
    }
    const vote = async index => {
       try{
        const ipVoteType = voteContext.pollData.voteType === 'IP';
        if(!ipVoteType && findCookie()){
            alert('You have already voted')
            return 
        }
        setContext({ voteStatus : 'Voting' })
        const body = ipVoteType ? {body : JSON.stringify({ ip : await getIp() })} : {}
        fetch(`http://localhost:8080/vote/${voteContext.id}/${index}`, { headers : defaultHeaders, method : 'POST', ...body }). 
        then(r => r.json()).
        then(response => {
            setContext({ voteStatus : 'Vote' })
            if(response.code != 200){
                alert(response.message || 'Unknown error occured')
                return 
            }
            if(!ipVoteType){
                document.cookie=`VOTED_${voteContext.id}=${voteContext.id}`;
            }
            alert('Voted successfully!')
        })
       }catch(e){
        alert(e)
       }
    }
    return (
        <>
            {
                voteContext.pollData ?
                voteContext.voteStat ?
                <VotePoll 
                    showVote={() => setContext({voteStat : 0})} 
                    vote={vote}
                    pollData={voteContext.pollData}
                    voteStatus={voteContext.voteStatus}
                /> :
                <VoteStats
                    pollData={voteContext.pollData}
                    goBack={() => setContext({voteStat : 1})}
                    id={voteContext.id}
                />
                :<LoopIcon className='vote-loading'/>

            }
        </>
    )
}
export default Vote

