import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link } from "react-router-dom";
import InputField from "~/components/InputField";
import { useNavigate } from "react-router-dom";

import { signUp } from "~/api/userApi";
import LoadingButton from "~/components/LoadingButton";
import { notifySuccess, notifyError } from "~/utils/toastify";


const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required!"),
  username: yup
    .string()
    .matches(/^[A-Za-z]/, 'Username must start with a letter')
    .min(6, "Username must be betwween 6 and 20 characters.")
    .max(20, "Username must be betwween 6 and 20 characters.")
    .required("Username is required!"),
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


const SignUp = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const onSubmit = async ({ email, username, password }) => {
    const user = { email, username, password };
    try {
      const response = await signUp(user);
      if (response) {
        reset();
        notifySuccess(response.message);
        navigate("/sign-in");
      }
    } catch (error) {
      notifyError(error.message);
    }
  };

  return (
    <div className="max-w-96 mx-auto my-20 shadow-form px-8 py-10 rounded-xl">
      <h1
        className="text-center text-3xl font-bold mb-4"
      >Sign up</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputField
          type={"email"}
          errors={errors}
          id={"email"}
          label={"Email"}
          register={register}
          placeholder={"Enter your email"}
        />

        <InputField
          type={"text"}
          errors={errors}
          id={"username"}
          label={"Username"}
          register={register}
          placeholder={"Enter your username"}
        />

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
          >Sign in</button>)
        }
      </form>

      <div className="flex justify-between mt-4">
          <Link to={"/forgot-password"} className="text-blue font-semibold hover:text-ocean">Forgot Password</Link>
          <Link to={"/sign-in"} className="text-blue font-semibold hover:text-ocean">Sign In</Link>
      </div>
    </div>
  )

}

export default SignUp