import React, { useState } from "react";

const useLoading = () => {
  const [loading, setLoading] = useState(false);

  const startLoader = () => {
    setLoading(true);
  };

  const stopLoader = () => {
    setLoading(false);
  };

  return { loading, startLoader, stopLoader };
};

export default useLoading;
