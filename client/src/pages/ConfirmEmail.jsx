import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { confirmEmail } from "~/api/userApi";
import Loading from "~/components/Loading";
import Arrow from "~/assets/svg/Arrow";

const ConfirmEmail = () => {
  const navigate = useNavigate();
  const token = useParams().token;
  const [isLoading, setIsLoading] = useState(true);
  const [content, setContent] = useState(null);

  const handleOnClick = () => {
    navigate("/sign-in");
  }

  useEffect(() => {
    let isMounted = true;
    const confirm = async () => {
      try {
        const response = await confirmEmail(token);
        console.log(response);
        setContent(
          <div>
            <p className="text-center my-2">Your account is verified successfully!</p>
            <p className="text-center my-2">You can sign in now</p>
            <button
              onClick={handleOnClick}
              className="mt-4 w-full py-2 rounded-xl bg-blue text-white font-semibold hover:bg-ocean"
            >Sign in
            </button>
          </div>
        )
      } catch (error) {
        console.log(error);
        setContent(
          <div>
            <p className="text-center my-2 text-red">{error.message}</p>
            <p className="text-center my-2 d">Please sign in and try again</p>

            <button
              onClick={handleOnClick}
              className="flex justify-center mt-4 w-full py-2 rounded-xl bg-blue text-white font-semibold hover:bg-ocean"
            >
              <p className="mr-4">Sign in</p>
              <Arrow />
            </button>
          </div>
        )
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    confirm();

    return () => { isMounted = false }
  }, []);

  if (isLoading) return <Loading />;
  return (
    <div className="max-w-96 mx-auto mt-32 shadow-form px-8 py-10 rounded-xl">
      <h1 className="text-center text-3xl font-bold">Confirm Email</h1>
      {content}
    </div>
  )
}

export default ConfirmEmail