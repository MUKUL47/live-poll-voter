import React, { useEffect, useState } from 'react'
import { formatSeconds } from '../../utils/material.modules'
import './vote.css'
import io from "socket.io-client";
export function VotePoll({vote, showVote, pollData, voteStatus}) {
    const [myOption, setMyOption] = useState(-1)
    return (
        <div className="vote-poll">
            <h1 className="poll-title">
                {pollData.title}
            </h1>
            <p className="poll-time">
                Created {formatSeconds(Number(((new Date().valueOf() - pollData.createdAt)/1000).toFixed()))} ago
            </p>
            <div className="poll-star">
                <p className="poll__description">
                    {pollData.description || ''}
                </p>
                <p className="choose-answer">
                    Choose an answer
                </p>
                <div className="poll-votes">
                    {
                        (pollData.options || []).map((option, i) => 
                        {
                            return <div className="poll-option">
                            <input key={i} type="radio" name="option" value="false" className="poll-check" onClick={() => setMyOption(i)}/>
                            <div className="poll-option-ans">
                                {option}
                            </div>
                        </div>
                        }
                    )
                    }
                </div>

                <div className="poll-actions">
                    <button className="vote-btn" onClick={() => vote(myOption)} disabled={myOption < 0 || voteStatus=='Voting'}>{voteStatus}</button>
                    <button className="show-vote-btn" onClick={showVote}>Show Votes</button>
                </div>
            </div>
        </div>
    )
}

export function VoteStats({pollData, goBack, id}){
    const [newPollVotes, setNewPollVotes ] = useState(null)
    const liveFeedFailed = () => {
        alert('Failed to connect live feed.')
        goBack()
    }
    useEffect(()=>{
        const socketEvent = io("http://localhost:8080");
        socketEvent.on('connect_error', liveFeedFailed )
        socketEvent.on('connect_failed', liveFeedFailed)
        socketEvent.on('connect',() => socketEvent.emit('JOIN_AUDIENCE', id))
        socketEvent.on('NEW_VOTES',newPollData => {
            console.log('NEW_VOTES', newPollData)
            setNewPollVotes(newPollData)
        })
        return () => {
            socketEvent.disconnect()
        }
    },[])
    return (
        <div className="vote-poll">
        <h1 className="poll-title">
                {pollData.title}
        </h1>
        <p className="poll-time">
            Created {formatSeconds(Number(((new Date().valueOf() - pollData.createdAt)/1000).toFixed()))} ago
        </p>
        <div className="poll-star">
            <p className="poll__description">
                {pollData.description || ''}
            </p>
            <div className="poll-votes">
                {
                    (Object.keys((newPollVotes || pollData).votes) || []).map(option => {
                        return <div className="poll-option-block">
                        <div className="poll-option--progress">
                            <p>{option} ({(newPollVotes || pollData).votes[option]} votes)</p>
                            {`${(((newPollVotes || pollData).votes[option]/(newPollVotes || pollData).totalVotes) * 100).toFixed(1)}%`}
                        </div>
                        <div className="option-progress">
                            <div id="option-progress" style={{width : `${(((newPollVotes || pollData).votes[option]/(newPollVotes || pollData).totalVotes) * 100).toFixed(1)}%` }}></div>
                        </div>
                    </div>
                    })
                }
            </div>

            <div className="divider"></div>
            <div className="total-votes">Total Votes : {(newPollVotes || pollData).totalVotes}</div>

            <div className="poll-actions">
                <button className="vote-btn back-btn" onClick={goBack}>Back to Vote</button>
                {/* <button className="show-vote-btn">Show Votes</button> */}
            </div>
        </div>
    </div>
    )
}