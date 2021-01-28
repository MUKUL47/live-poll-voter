import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router';
import CreateRender, { OnCreate } from './create.render'
function Create(props) {
    const createLocation = useLocation()
    const [createContext, setCreateContext] = useState(
        {   loading : false, 
            created : false, 
            resetCreateForm : true,
            id : null
        });
    const setContext = keyValue => setCreateContext({...createContext, ...keyValue})
    useEffect(()=>{
        document.title = 'Live Poll | Create'
        if(createLocation.state && createLocation.state.alert){
            setTimeout(() => alert(createLocation.state.alert), 500)
        }
    },[])
    const submit = form => {
        setContext({ loading : true })
        fetch('http://localhost:8080/poll', { method : "POST", body : JSON.stringify(form), 
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        } }). 
        then(r => r.json()). 
        then(response => {
            setContext({ loading : false, created : true, resetCreateForm : Math.random(), id : response['message'] })
        }).catch(e => {
            setContext({ loading : false })
            alert(`ERROR : ${JSON.stringify(e)}`)
        })
    }
    const closeCreated = () => {
        setContext({ created : false });
    }
    return (
        <>
            <CreateRender 
                submit={submit} 
                loading={createContext.loading} 
                resetCreateForm={createContext.resetCreateForm}
            />
            {
                createContext.created ? 
                <OnCreate 
                    id={createContext.id} 
                    close={closeCreated}
                /> : null
            }
        </>
    )
}
export default Create

