import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link } from "react-router-dom";

import InputField from "~/components/InputField";


const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required!"),
  password: yup
    .string()
    .min(6, "Password must be betwween 6 and 20 characters.")
    .max(20, "Password must be betwween 6 and 20 characters.")
    .required("Password is required!"),
});

const SignIn = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmitHandler = (data) => {
    console.log({ data });
    reset();
  };

  return (
    <div className="max-w-96 mx-auto my-20 shadow-form px-8 py-10 rounded-xl">
    <h1
      className="text-center text-3xl font-bold mb-4"
    >Sign in</h1>
    <form onSubmit={handleSubmit(onSubmitHandler)}>
      <InputField
        type={"email"}
        errors={errors}
        id={"email"}
        label={"Email"}
        register={register}
        placeholder={"Enter your email"}
      />

      <InputField
        type={"password"}
        errors={errors}
        id={"password"}
        label={"Password"}
        register={register}
        placeholder={"Enter your password"}
      />

      <button type="submit" className="mt-4 w-full py-2 rounded-xl bg-blue text-white font-semibold hover:bg-ocean">Sign up</button>
    </form>

    <div className="flex justify-between mt-4">
    <button>
        <Link to={"/forgot-password"} className="text-blue font-semibold hover:text-ocean">Forgot Password</Link>
      </button>
      <button>
        <Link to={"/sign-up"} className="text-blue font-semibold hover:text-ocean">Sign up</Link>
      </button>
    </div>
  </div>
  )
}
export default SignIn