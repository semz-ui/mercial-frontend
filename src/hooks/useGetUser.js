import React, { useCallback, useEffect, useState } from "react";
import useShowToast from "./useShowToast";
import useLoading from "./useLoading";
import { useParams } from "react-router-dom";

const useGetUser = () => {
  const token = JSON.parse(localStorage.getItem("token"));
  const [user, setUser] = useState(null);

  const showToast = useShowToast();
  const { loading, startLoader, stopLoader } = useLoading();
  const { username } = useParams();

  const getUser = useCallback(async () => {
    startLoader();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/profile/${username}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      if (data.isFrozen) {
        setUser(null);
        return;
      }
      setUser(data);
    } catch (error) {
      showToast("Error", error, "error");
    } finally {
      stopLoader();
    }
  });

  useEffect(() => {
    getUser();
  }, [username, showToast]);

  return { loading, user };
};

export default useGetUser;
