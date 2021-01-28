
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import './navbar.css'
import {
    useHistory
} from "react-router-dom";
import actions from '../../redux/actions';
function NavBar(props) {
    const history = useHistory();
    const [votePoll, setVotePoll] = useState(false)
    const dispatch = useDispatch()
    const toCreate = () => {
        history.push('/create')
    }
    const onModal = type => {
        if(!type || type.trim().length === 0 || type.includes(' ') || type.includes('/')){
            if(!type){
                setVotePoll(false)
            }else{
                alert('Invalid poll ID')
            }
            return;
        }
        setVotePoll(false)
        history.push('/vote/'+type)
        dispatch({ type : actions.VOTE_POLL })
    }
    return (
        <div className="main">
            <div className="navbar">
                <div className="nav-items">
                    <div className="nav-item" onClick={toCreate}>Create Poll</div>
                    <div className="nav-item" onClick={() => setVotePoll(true)}>Vote Poll</div>
                </div>
                <h1 className="header">
                    Live Voter
                </h1>
            </div>
            {
                votePoll ? <EnterPollIdTemplate onModal = {onModal}/> : null
            }
            
        </div>
    )
}
function EnterPollIdTemplate({ onModal }){
    const [pollId, setPollId] = useState('')
    return <div className="overlay">
        <div className="overlay-div poll-template">
            <h2 className="enter-pollid">Enter Poll ID</h2>
            <input type="text" className="poll-inp" value={pollId} onChange={e => setPollId(e.target.value)}/>
            <div className="submit-poll-id">
                <button onClick={() => onModal(pollId)} disabled={pollId.trim().length === 0}>Submit</button>
                <div  onClick={() => onModal(false)}>Cancel</div>
            </div>
        </div>
    </div>
}
export default NavBar

