import { useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMe } from "~/api/userApi"
import { setUser } from "~/store/user/userSlice";

const authHook = () => {
    const dispatch = useDispatch();
    useLayoutEffect(() => {
        getMe()
            .then((data) => {
                dispatch(setUser(data.user));
            }).catch((error) => {
                dispatch(setUser(null));
            })

    }, [dispatch])
}

export default authHook