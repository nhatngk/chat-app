const Button = ({handleOnclick, isLoading, name}) => {
  return (
    <button
    className={`text-white bg-blue p-2 rounded-xl hover:bg-ocean ${isLoading ? 'bg-disable hover:bg-disable' : ''}`}
    onClick={handleOnclick}
    disabled={isLoading}
  >
    {name}
  </button>
  )
}

export default Button