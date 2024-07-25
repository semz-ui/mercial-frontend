import { Button, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import React from "react";
import { useSetRecoilState } from "recoil";
import userAtom from "../atom/userAtom";
import useShowToast from "../hooks/useShowToast";
import { MdLogout } from "react-icons/md";
import useLoading from "../hooks/useLoading";

const Logout = () => {
  const navigate = useNavigate();
  const setUser = useSetRecoilState(userAtom);
  const showToast = useShowToast();
  const { loading, startLoader, stopLoader } = useLoading();
  const handleLogout = async () => {
    startLoader();
    try {
      const res = await fetch("/api/users/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      localStorage.removeItem("user");
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
