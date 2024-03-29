import ShowPassword from "~/assets/svg/ShowPassword"
import HidePassword from "~/assets/svg/HidePassword"

const TogglePassword = (props) => {
    const { isPasswordVisible, setIsPasswordVisible } = props;
    const handleToggle = () => {
        setIsPasswordVisible(!isPasswordVisible);
    }

    return (
        <button
            className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-600 "
            onClick={handleToggle}
            type="button"
        >
            {isPasswordVisible ?
                (< HidePassword />) : (<ShowPassword />)
            }
        </button>

    )
}

export default TogglePassword
