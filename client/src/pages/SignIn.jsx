import * as yup from "yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate, useLocation, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { notifySuccess, notifyError } from "~/utils/toastify";
import { setUser } from "~/store/user/userSlice";
import { signIn, getMe } from "~/api/userApi";
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
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.currentUser);
  const [isLoading, setIsLoading] = useState(true);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const respone = await signIn(data);
      dispatch(setUser(respone.user));
      notifySuccess("Login successfully!");
      reset();
      navigate(from, { replace: true });
    } catch (error) {
      notifyError(user.error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const getUser = async () => {
      try {
        const respone = await getMe();
        dispatch(setUser(respone?.user));
      } catch (error) {
        notifyError(error.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    if (!user) {
      getUser();
    } else {
      setIsLoading(false);
    }
    return () => { isMounted = false }
  }, []);

  if (isLoading) return <h1>Loading...</h1>;


  return user ? <Navigate to={from} replace /> : (
    <div className="max-w-96 mx-auto my-20 shadow-form px-8 py-10 rounded-xl">
      <h1
        className="text-center text-3xl font-bold mb-4"
      >Sign in</h1>
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
          type={"password"}
          errors={errors}
          id={"password"}
          label={"Password"}
          register={register}
          placeholder={"Enter your password"}
        />

        <button type="submit"
          className="mt-4 w-full py-2 rounded-xl bg-blue text-white font-semibold hover:bg-ocean"
          disabled={user.loading}
        >Sign in</button>

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