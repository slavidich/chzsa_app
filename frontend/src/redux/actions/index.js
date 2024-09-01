import {INCREMENT, DECREMENT} from '../actions/actionTypes.js'

export const increment = () => ({
    type: INCREMENT,
});
  
export const decrement = () => ({
    type: DECREMENT,
});