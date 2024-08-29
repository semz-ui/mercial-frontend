import React, { useState } from "react";
import useShowToast from "./useShowToast";

const usePreviewAudio = () => {
  const [audio, setAudio] = useState(null);
  const showToast = useShowToast();

  const handleAudioChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("audio/")) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setAudio(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      showToast("Invalid File Type", "Please select an audio file", "error");
      setAudio(null);
    }
  };

  return { handleAudioChange, audio, setAudio };
};

export default usePreviewAudio;
