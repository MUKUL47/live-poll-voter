import React, { useState, useEffect, useRef } from 'react'
import { CheckCircleIcon } from '../../utils/material.modules'
import './create.css'
function CreateRender({ submit, loading, resetCreateForm }) {
    const [form, setForm] = useState({ title : '', description : '', options : ['', ''], voteType : 'IP' })
    useEffect(() => {
        setForm({ title : '', description : '', options : ['', ''] })
    },[resetCreateForm])
    const submitForm = e => {
        e.preventDefault();
        const cForm = {...form}
        cForm.options = form.options.filter(option => option.trim().length > 0) 
        submit(cForm)
    }
    const optionChange = (e, i) => {
        let optionsClone = [...form.options]
        optionsClone[i] = e.target.value;
        setForm({ ...form, options : optionsClone })
    }
    const optionClick = i => {
        if(i < form.options.length-1) return
        let optionsClone = [...form.options]
        optionsClone.push('')
        setForm({ ...form, options :optionsClone })
    }
    const removeOption = i => {
        let optionsClone = [...form.options]
        optionsClone.splice(i, 1)
        setForm({ ...form, options :optionsClone })
    }
    return (
        <div className="create-render">
            <h1 className="create_header">
                Create a Poll
            </h1>
            <form onSubmit={submitForm}>
            <div className="create_poll-inp">
                <div className="poll-inp--header">
                    Title
                </div>
                <div className="pol-inp--val">
                    <input required 
                        type="text" 
                        placeholder="Type your question here" 
                        className="standard-inp" 
                        value={form.title} 
                        onChange={e => setForm({ ...form, title : e.target.value })}
                    />
                </div>
            </div>
            
                <div className="create_poll-inp">
                    <div className="poll-inp--header">
                        Description (Optional)
                    </div>
                    <div className="pol-inp--val">
                        <textarea 
                            placeholder="Enter an introduction text..." 
                            className="standard-inp" 
                            value={form.description} 
                            onChange={e => setForm({ ...form, description : e.target.value })}
                        >

                        </textarea>
                    </div>
                </div>

                <div className="create_poll-inp">
                    <div className="poll-inp--header">
                        Answer Options
                    </div>
                    
                        {
                            form.options.map((o, i) => {
                                return <div className="pol-inp--val option-inp" 
                                key={i}> 
                                    <input 
                                        required ={i <= 1}
                                        type="text" 
                                        placeholder={`Enter Option ${i+1}`} 
                                        className="standard-inp"
                                        value={o}
                                        onClick={() => optionClick(i)}
                                        onFocus={() => optionClick(i)}
                                        onChange={e => optionChange(e, i)}
                                    />
                                    {
                                        i > 1 ? <div className="remove-option" onClick={() => removeOption(i)}>x</div> : null
                                    }
                                </div>
                            })
                        }
                    
                </div>

                <div className="create_poll-inp">
                    <div className="poll-inp--header">
                       Vote Settings
                    </div>
                    <div className="pol-inp--val">
                        <select name="" id="" className="standard-inp select-type" onChange={e => setForm({ ...form, voteType :e.target.value })}>
                            <option value="IP">Unique IP</option>
                            <option value="COOKIE">Unique Browser session</option>
                        </select>
                    </div>
                </div>

                <div className="create-pol-submit">
                    <button disabled={loading}>{loading ? 'Submitting...' : 'Submit'}</button>
                </div>
            </form>
        </div>
    )
}
function OnCreate({ id, close }){
    const [copy, setCopy] = useState(true);
    const [select, setSelect] = useState(useRef());
    const closeModal = ()=>{
        select.current.select()
        document.execCommand("copy");
        setCopy(false)
        setTimeout(() => close(), 1000)
    }
    return (
        <div className="overlay">
            <div className="overlay-div created-poll">
                <div className="success-icon">
                    <CheckCircleIcon/>
                </div>
                <input style={{opacity:0, position:'absolute', zIndex : -1}} ref={select} value= {id}/>
                <div className="poll-msg">{`Poll created ID : ${id}`}</div>
                <button 
                    disabled={!copy} 
                    className="poll-copy-btn"
                    onClick={closeModal}
                >{copy ? 'Copy' : 'copied'}</button>
            </div>
        </div>
    )
}
export {OnCreate}
export default CreateRender

