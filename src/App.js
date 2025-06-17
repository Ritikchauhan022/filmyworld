import './App.css';
import Header from './component/Header';
import Cards from './component/Card';
import AddMovie from './component/AddMovie';
import {Route, Routes} from 'react-router-dom'
import Detail from './component/Detail';
import { createContext, useState } from 'react';
import Login from './component/Login';
import Signup from './component/Signup';



const Appstate = createContext();

function App() {
  const [login, setLogin] = useState(false);
  // const [userName, setUserName] = useState(""); eski jagha mene ye lagaya 
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "");


  return (
    <Appstate.Provider value={{login, userName, setLogin, setUserName}}>
    <div className="App">
    <Header/>
      <Routes>
        <Route path="/" element={<Cards/>} />
        <Route path="/addmovie" element={<AddMovie/>} />
        <Route path="/detail/:id" element={<Detail/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        </Routes>
    </div>
    </Appstate.Provider>
  );
}

export default App
export {Appstate}