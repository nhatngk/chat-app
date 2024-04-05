import { useLayoutEffect, useState } from "react"
import { getMe } from "../api/userApi"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { notifyError } from "~/utils/toastify";
const Home = () => {


  return (
    <div>
      <Link to="/sign-in">sign in</Link>
    </div>
  )
}

export default Home