import { Button, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import React from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atom/userAtom";
import useShowToast from "../hooks/useShowToast";
import { MdLogout } from "react-icons/md";
import useLoading from "../hooks/useLoading";

const Logout = () => {
  const token = JSON.parse(localStorage.getItem("token"));
  const user = useRecoilValue(userAtom);
  const navigate = useNavigate();
  const setUser = useSetRecoilState(userAtom);
  const showToast = useShowToast();
  const { loading, startLoader, stopLoader } = useLoading();
  const handleLogout = async () => {
    startLoader();
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/logout`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setUser(null);
      navigate("/auth");
    } catch (error) {
      console.log(error);
    } finally {
      stopLoader();
    }
  };
  return (
    <Button
      // position={"fixed"}
      // top={"30px"}
      // right={"30px"}
      size={"sm"}
      onClick={handleLogout}
      isLoading={loading}
    >
      <MdLogout size={20} />
    </Button>
  );
};

export default Logout;
