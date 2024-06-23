import { Link } from "react-router-dom"

const NotFound = () => {
  return (
    <div className="flex-center h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-2xl mb-4">Page Not Found</p>
        <button>  
          <Link to="/" replace className="text-blue ">Go back to Home</Link>
        </button>
      </div>
    </div>
  )
}

export default NotFound