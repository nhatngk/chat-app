import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "~/store/userSlice";

import { notifySuccess, notifyError } from "~/utils/toastify";
import { changePassword, signOut } from "~/api/userApi";
import InputField from "~/components/InputField";
import LoadingButton from "~/components/LoadingButton";

const schema = yup.object().shape({
  currentPassword: yup
    .string()
    .min(6, "Password must be betwween 6 and 20 characters.")
    .max(20, "Password must be betwween 6 and 20 characters.")
    .required("Password is required!"),
  newPassword: yup
    .string()
    .notOneOf([yup.ref('currentPassword'), null], 'New password and current password must be different.')
    .min(6, "Password must be betwween 6 and 20 characters.")
    .max(20, "Password must be betwween 6 and 20 characters.")
    .required("Password is required!"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword'), null], 'New password and confirm password does not match')
    .min(6, "Password must be betwween 6 and 20 characters.")
    .max(20, "Password must be betwween 6 and 20 characters.")
    .required("Confirm password is required!"),
});
const ChangePassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await changePassword({ password: data.currentPassword, newPassword: data.newPassword });
      notifySuccess(response.message);
      reset();
      await signOut();
      dispatch(setUser(null));
      navigate("/sign-in", { replace: true }, { state: { from: "/" } });
    } catch (error) {
      notifyError(error.message);
    }
  };


  return (
    <div className="flex m-auto w-1/2 flex-col p-4">
      <h1 className='font-bold text-center mb-8'>Change Your Password</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <InputField
          type={"password"}
          errors={errors}
          id={"currentPassword"}
          label={"Current Password"}
          register={register}
          placeholder={"Enter your current password"}
        />

        <InputField
          type={"password"}
          errors={errors}
          id={"newPassword"}
          label={"New Password"}
          register={register}
          placeholder={"Enter your new password"}
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
          >Change your Password</button>)
        }
      </form>
    </div>
  )
}

export default ChangePassword