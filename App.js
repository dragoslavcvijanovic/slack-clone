import React, {useState} from 'react';
import './App.css';
import Header from './Components/Header.js';
import Sidebar from './Components/Sidebar.js';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Chat from './Components/Chat.js';
import Login from './Components/Login.js'
import {useStateValue} from './Components/StateProvider';

function App() {
  const[{user}, dispatch] = useStateValue();

  return (
    <div className="App">
      <Router>
        {!user ? (
          <Login/>

        ) : ( 
        <>
        <Header/>
        <div className = "app_body">
          <Sidebar />

        <Switch>
          <Route path = "/room/:roomId">
            <Chat />
          </Route>
          <Route path = "/">
            <h1>Welcome</h1>
          </Route>

        </Switch>
        </div>
        </>
      )}
          
      </Router>

   
    </div>
  );
}

export default App;
