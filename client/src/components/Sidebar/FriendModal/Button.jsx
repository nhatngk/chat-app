const Button = ({ handleOnclick, name }) => {
  return (
    <button
      className={`text-white bg-blue p-2 rounded-xl hover:bg-ocean`}
      onClick={handleOnclick}
    >
      {name}
    </button>
  )
}

export default Button