import React, { useState } from "react";

const useUpdateProfile = () => {
  const token = JSON.parse(localStorage.getItem("token"));

  const updateUser = async (userId) => {
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
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  return { updateUser, updating };
};

export default useUpdateProfile;
