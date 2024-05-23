import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import SignUp from "~/pages/SignUp";;
import Home from "~/pages/Home";
import NotFound from "~/pages/NotFound";
import SignIn from "~/pages/SignIn";
import PrivateRoute from "~/pages/PrivateRoute";
import ForgotPassword from "~/pages/ForgotPassword";
import ResetPassword from "~/pages/ResetPassword";
import ConfirmEmail from "~/pages/ConfirmEmail";

function App() {
  return (
    
    <>
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/confirm-email/:token" element={<ConfirmEmail />} />
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Home />} />
        </Route>
        <Route path="/*" element={<NotFound />} />
      </Routes>

      <ToastContainer />
    </>

  )
}

export default App
