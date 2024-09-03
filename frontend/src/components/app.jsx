import React from "react";
import { useDispatch, useSelector } from 'react-redux';
import { increment, decrement } from '../redux/actions';
import {Routes, Route, Link} from "react-router-dom"
import "../styles/app.scss";
import Header from './header.jsx'
import Footer from './footer.jsx'

function App() {
    const dispatch = useDispatch();
    const count = useSelector(state => state.counter.count);
    return (
    <>
        <Header/>
        <p>test Привет Hello</p>
        <Footer/>
    </>
    );
}

export default App;