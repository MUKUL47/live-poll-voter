import React from 'react'
import {
    BrowserRouter,
    Redirect,
    Route,
    Switch
} from "react-router-dom";
import Create from './create/create';
import NavBar from './navbar/navbar';
import Vote from './vote/vote';
function App(){
  return (
      <BrowserRouter>
        <NavBar/>
            <div className="children-components">
              <Switch>
                  <Route exact path='/create' component={Create}></Route>
                  <Route exact path='/vote/:id' component={Vote}></Route>
                  <Route exact path='/' ><Redirect to='/create'/></Route>
                  <Route exact path='*/*' ><Redirect to='/create'/></Route>
              </Switch>
            </div>
      </BrowserRouter>
  )
}
export default App;
