import React, { useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atom/userAtom";
import { useToast } from "@chakra-ui/react";
const useUpdateProfile = () => {
  const token = JSON.parse(localStorage.getItem("token"));
  const user = useRecoilValue(userAtom);
  const setUser = useSetRecoilState(userAtom);
  const [updating, setUpdating] = useState(false);
  const toast = useToast();

  const handleSubmit = async (userId) => {
    if (updating) return true;
    setUpdating(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/update/${userId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ peerId: 9754690 }),
        }
      );
      const data = await response.json();
      console.log(data);
      if (data.error) {
        console.log(data);
        toast({
          title: "Error",
          description: data.error,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      toast({
        title: "Success",
        description: data.message,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      // navigate(`/${inputs?.username}`);
    } catch (error) {
      console.log(error);
    } finally {
      setUpdating(false);
    }
  };

  return { handleSubmit, updating };
};

export default useUpdateProfile;
