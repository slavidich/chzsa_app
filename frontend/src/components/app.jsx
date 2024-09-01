import React from "react";
import { useDispatch, useSelector } from 'react-redux';
import { increment, decrement } from '../redux/actions';
import {Routes, Route, Link} from "react-router-dom"
import "../styles/app.scss";

function App() {
    const dispatch = useDispatch();
    const count = useSelector(state => state.counter.count);
    return (
    <div>
        <nav>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
        </nav>
        <h1>hello world<i>test</i></h1>
        
        <Routes>
            <Route path="/" element={
                <>
                    <h1>Counter: {count}</h1>
                    <button onClick={()=> dispatch(increment())}>+1</button>
                </>
                } />
            <Route path="/about" element={<button onClick={()=> dispatch(decrement())}>-1</button>} />
        </Routes>
    </div>
    );
}

export default App;