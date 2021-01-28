import actions from "./actions";
import { combineReducers } from 'redux'
function firstReducer(state = {}, action){
    if(action.type === actions.VOTE_POLL){
        return { VOTE : true , ...state}
    }
    return state;
}
export default combineReducers({ test : firstReducer })