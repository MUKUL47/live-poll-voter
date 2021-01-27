import actions from "./actions";
import { combineReducers } from 'redux'
function firstReducer(state = [], action){
    if(action.type === actions.TEST){
        return [{test : Math.random()},...state]
    }
    return state;
}
export default combineReducers({ test : firstReducer })