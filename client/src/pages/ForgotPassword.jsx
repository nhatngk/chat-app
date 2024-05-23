import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link } from "react-router-dom";

import { notifySuccess, notifyError } from "~/utils/toastify";
import { forgotPassword } from "~/api/userApi";
import InputField from "~/components/InputField";
import LoadingButton from "~/components/LoadingButton";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required!"),
});

const ForgotPassword = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await forgotPassword(data);
      notifySuccess(response.message);
      reset();
    } catch (error) {
      notifyError(error.message);
    }
  };


  return (
    <div className="max-w-96 mx-auto my-20 shadow-form px-8 py-10 rounded-xl">
      <h1
        className="text-center text-3xl font-bold mb-8"
      >Forgot Password</h1>
      <p className="text-center mb-4 border-b border-blur pb-4 ">
        Remmeber your password?{" "}
        <Link to={"/sign-in"} className="text-blue font-semibold hover:text-ocean">
          Sign in.
        </Link>
      </p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputField
          type={"email"}
          errors={errors}
          id={"email"}
          label={"Email"}
          register={register}
          placeholder={"Enter your email"}
        />
        {isSubmitting ? <LoadingButton /> : (
          <button type="submit"
            className="mt-4 w-full py-2 rounded-xl bg-blue text-white font-semibold hover:bg-ocean"
          >Forgot Password</button>)
        }
      </form>

    
    </div>

  )
}
export default ForgotPassword