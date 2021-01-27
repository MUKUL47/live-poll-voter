import React, { useState } from 'react'
import { formatSeconds } from '../../utils/material.modules'
import './vote.css'
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

export function VoteStats({pollData, updatedPollData, goBack}){
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
                    (Object.keys(pollData.votes) || []).map(option => {
                        return <div className="poll-option-block">
                        <div className="poll-option--progress">
                            <p>{option} ({pollData.votes[option]} votes)</p>
                            {`${((pollData.votes[option]/pollData.totalVotes) * 100).toFixed(1)}%`}
                        </div>
                        <div className="option-progress">
                            <div id="option-progress" style={{width : `${((pollData.votes[option]/pollData.totalVotes) * 100).toFixed(1)}%` }}></div>
                        </div>
                    </div>
                    })
                }
            </div>

            <div className="divider"></div>
            <div className="total-votes">Total Votes : {pollData.totalVotes}</div>

            <div className="poll-actions">
                <button className="vote-btn back-btn" onClick={goBack}>Back to Vote</button>
                {/* <button className="show-vote-btn">Show Votes</button> */}
            </div>
        </div>
    </div>
    )
}