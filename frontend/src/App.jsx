import React from 'react'
import MainRouters from './routes/MainRouters'
import {ToastContainer} from "react-toastify"
const App = () => {
  return (
    <div>
      <ToastContainer
      closeButton={false}
      hideProgressBar
      autoClose={1000}
      />
      <MainRouters/>
    </div>
  )
}

export default App