import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./Signup";
import Dashboard from './Dashboard'
import SendMoney from "./Send";
import Signin from "./SignIn"
function App() {

  return (
    <>
      <BrowserRouter>
      <Routes>
      <Route path="/signup" element={<SignUp/>} />
      <Route path="signin" element={<Signin/>} />
      <Route path="/send" element={<SendMoney/>} />
      <Route path="/dashboard" element={<Dashboard/>} />
        </Routes>
      
      </BrowserRouter>
       
    </>
  )
}

export default App
