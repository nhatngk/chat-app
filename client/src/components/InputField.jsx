import { useState } from "react";
import TogglePassword from "~/components/TogglePassword";


const InputField = (props) => {
    const { id, label, register, placeholder, type, errors } = props;
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    return (
        <div className="flex flex-col mb-2">
            <label
                className="mb-2 font-medium "
                htmlFor={id}>{label}</label>
            {type === "password" ? (
                <div className="relative">
                    <input
                        {...register(id)}
                        className={`input-form ${errors?.[id]?.message && "outline outline-1 outline-red"}`}
                        type={`${isPasswordVisible ? "text" : type}`} id={id} placeholder={placeholder} />
                    <TogglePassword
                        isPasswordVisible={isPasswordVisible}
                        setIsPasswordVisible={setIsPasswordVisible}
                    />
                </div>
            ) : (
                <input
                    {...register(id)}
                    className={`input-form ${errors?.[id]?.message && "outline outline-1 outline-red"}`}
                    type={type} id={id} placeholder={placeholder}/>)
            }
            <p className="text-red">{errors?.[id]?.message}</p>
        </div>
    )
}

export default InputField