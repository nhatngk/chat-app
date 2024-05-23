import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useParams, useNavigate } from "react-router-dom";

import { notifySuccess, notifyError } from "~/utils/toastify";
import { resetPassword } from "~/api/userApi";
import InputField from "~/components/InputField";
import LoadingButton from "~/components/LoadingButton";

const schema = yup.object().shape({ 
    password: yup
        .string()
        .min(6, "Password must be betwween 6 and 20 characters.")
        .max(20, "Password must be betwween 6 and 20 characters.")
        .required("Password is required!"),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password'), null], 'Password and confirm password does not match')
        .min(6, "Password must be betwween 6 and 20 characters.")
        .max(20, "Password must be betwween 6 and 20 characters.")
        .required("Confirm password is required!"),
});

const ResetPassword = () => {
    const token = useParams().token;
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
        mode: "onBlur",
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data) => {
        try {
            const response = await resetPassword(token, {newPassword: data.password});
            notifySuccess(response.message);
            reset();
            navigate("/sign-in", { replace: true });
        } catch (error) {
            notifyError(error.message);
        }
    };

    return (
        <div className="max-w-96 mx-auto my-20 shadow-form px-8 py-10 rounded-xl">
            <h1
                className="text-center text-3xl font-bold mb-4"
            >Reset Password</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <InputField
                    type={"password"}
                    errors={errors}
                    id={"password"}
                    label={"Password"}
                    register={register}
                    placeholder={"Enter your password"}
                />

                <InputField
                    type={"password"}
                    errors={errors}
                    id={"confirmPassword"}
                    label={"Confirm password"}
                    register={register}
                    placeholder={"Confirm your password"}
                />

                {isSubmitting ? <LoadingButton /> : (
                    <button type="submit"
                        className="mt-4 w-full py-2 rounded-xl bg-blue text-white font-semibold hover:bg-ocean"
                    >Reset Password</button>)
                }
            </form>
        </div>

    )
}
export default ResetPassword