import { Navigate, useLocation, Outlet } from "react-router-dom"
import { useEffect, useState } from "react";
import { getMe } from "~/api/userApi";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "~/store/userSlice";
import { notifyError } from "~/utils/toastify";
import Loading from "~/components/Loading";

const PrivateRoute = () => {
  const user = useSelector(state => state.user.currentUser);
  const dispatch = useDispatch();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const getUser = async () => {
      try {
        const response = await getMe();
        dispatch(setUser(response?.user));
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
  },[]);

  if (isLoading) return <Loading />;

  return user ? (
    <Outlet />
  ) : (
    <Navigate to="/sign-in" state={{ from: location }} replace />
  );
}

export default PrivateRoute