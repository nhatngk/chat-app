import { Routes, Route } from "react-router-dom";
import SignUp from "~/pages/SignUp";;
import Home from "~/pages/Home";
import NotFound from "~/pages/NotFound";
import SignIn from "~/pages/SignIn";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route pat h="/*" element={<NotFound />} />
      </Routes>
      
      <ToastContainer />
    </>

  )
}

export default App
