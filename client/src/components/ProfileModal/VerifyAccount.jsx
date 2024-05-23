import { useForm } from "react-hook-form";

import { notifyError, notifySuccess } from "~/utils/toastify";
import { verify } from "~/api/userApi";

const VerifyAccount = () => {
  const { handleSubmit, formState: { isSubmitting } } = useForm();
  const onSubmit = async () => {
    try {
      const response = await verify();
      notifySuccess(response.message);
    } catch (error) {
      notifyError(error.message);
    }
  };

  return (
    <div className="flex m-auto  w-1/2 flex-col p-4"> 
      <h1  className="text-center">Verify Account</h1>

      <form className="mt-20" onSubmit={handleSubmit(onSubmit)}>

        <div className="text-center">
          <p>Your account will be deleted in 7 days.</p>
          <p>Please click the button below to verify your account.</p>
          <p>We will send you a verification email.</p>
        </div>

        <button type="submit"
          className="mt-4 w-full py-2 rounded-xl bg-blue text-white font-semibold hover:bg-ocean"
        >Verify Account</button>
      </form>
      <p></p>
    </div>
  )
}

export default VerifyAccount