import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from './component/Home/Home'
import { BrowserRouter, Route, Routes, Navigate, Router } from 'react-router-dom';
import WishList from './component/WishList/WishList'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home></Home>}></Route>
          <Route path='/wish_list' element={<WishList></WishList>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
