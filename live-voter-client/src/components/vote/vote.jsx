import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { defaultHeaders, LoopIcon } from '../../utils/material.modules'
import {VotePoll, VoteStats} from './vote.render'
import io from "socket.io-client";
function Vote(props) {
    const [voteContext, setVoteContext] = useState({ 
        voteStat : 1, 
        pollData : null, 
        id : window.location.pathname.split('/')[2],
        voteStatus : 'Vote',
        newPollVotes : null
    })
    const history = useHistory();
    const setContext = obj => setVoteContext({ ...voteContext,  ...obj})
    useEffect(() => {
        fetch('http://localhost:8080'+window.location.pathname, { headers: defaultHeaders}). 
        then(r => r.json()).
        then(response => {
            if(response['message']){
                if(response.code != 200){
                    history.push('/create', { alert : response.message || 'Unknown error occured' })
                    return 
                }
                console.log(response.message)
                setContext({pollData : response.message})
            }
        })
    }, [])
    const vote = index => {
        setContext({ voteStatus : 'Voting' })
        fetch(`http://localhost:8080/vote/${voteContext.id}/${index}`, { headers : defaultHeaders, method : 'POST' }). 
        then(r => r.json()).
        then(response => {
            setContext({ voteStatus : 'Vote' })
            if(response.code != 201){
                alert(response.message || 'Unknown error occured')
                return 
            }
            alert('Voted successfully!')
            // history.push('/create', { alert : 'Voted successfully!' })
        })
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

