import React, { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atom/userAtom";
import { useSocket } from "../context/SocketContext";
import Peer from "peerjs";
import { useLocation } from "react-router-dom";
import callAtom from "../atom/callAtom";

const useVideoCall = (peerUserId) => {
  const token = JSON.parse(localStorage.getItem("token"));
  const setUser = useSetRecoilState(userAtom);
  const currentUser = useRecoilValue(userAtom);
  const [peerIdLoad, setPeerIdLoad] = useState("");
  const [peerId, setPeerId] = useState("");
  const [call, setCall] = useRecoilState(callAtom);
  const [userVideo, setUserVideo] = useState(null);
  const [partnerVideo, setPartnerVideo] = useState(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [incomingCall, setIncomingCall] = useState(null);
  const [remotePeerIdValue, setRemotePeerIdValue] = useState(0);
  const remoteVideoRef = useRef(null);
  const currentUserVideoRef = useRef(null);
  const peerInstance = useRef(null);
  const { socket } = useSocket();
  const [recepientId, setRecepientId] = useState("");

  console.log(peerId, "peerId");
  useEffect(() => {
    const peer = new Peer(peerUserId);
    peer.on("open", (id) => {
      console.log(id, "peer");
      setPeerId(id);
    });

    peer.on("call", (call) => {
      setIncomingCall(call);
      setCall(true);
    });
    peerInstance.current = peer;
  }, [incomingCall]);

  const callUser = async () => {
    console.log("clickec");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/profile/${"semz"}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (data.error) {
        // showToast("Error", data.error, "error");
        return;
      }
      if (data.isFrozen) {
        setUser(null);
        return;
      }
      setRecepientId(data._id);
      var getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;

      getUserMedia({ video: true, audio: true }, (mediaStream) => {
        setUserVideo(mediaStream);
        if (currentUserVideoRef.current) {
          currentUserVideoRef.current.srcObject = mediaStream;
          currentUserVideoRef.current.play();
        }

        console.log(data.peerId, "pos");
        const call = peerInstance.current.call(data.peerId, mediaStream);
        if (call) {
          console.log(call, "call");
          call.on("stream", (remoteStream) => {
            setCall(true);
            setPartnerVideo(remoteStream);
            remoteVideoRef.current.srcObject = remoteStream;
            remoteVideoRef.current.play();
          });
        }
      });
    } catch (error) {
      //   showToast("Error", error, "error");
    }
  };

  console.log(currentUserVideoRef.current, "ctry");

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
          body: JSON.stringify({
            peerId: Math.floor(Math.random() * (10000 - 1 + 1)) + 1,
          }),
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

  const endCall = () => {
    if (peerInstance.current) {
      peerInstance.current.disconnect();
      peerInstance.current = null;
    }
    // setIsCallActive(false);
    // Clear video and audio streams
    if (currentUserVideoRef.current && currentUserVideoRef.current.srcObject) {
      currentUserVideoRef.current.srcObject
        .getTracks()
        .forEach((track) => track.stop());
      currentUserVideoRef.current = null;
    }
    if (remoteVideoRef.current && remoteVideoRef.current.srcObject) {
      remoteVideoRef.current.srcObject
        .getTracks()
        .forEach((track) => track.stop());
      remoteVideoRef.current = null;
    }
    updateUser(currentUser._id);
    updateUser(recepientId);
  };

  const toggleAudio = () => {
    const audioTrack =
      currentUserVideoRef.current.srcObject.getAudioTracks()[0];
    audioTrack.enabled = !audioTrack.enabled;
    setIsAudioMuted(!isAudioMuted);
  };

  const toggleVideo = () => {
    const videoTrack =
      currentUserVideoRef.current.srcObject.getVideoTracks()[0];
    videoTrack.enabled = !videoTrack.enabled;
    setIsVideoMuted(!isVideoMuted);
  };
  const acceptCall = () => {
    var getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia;

    if (incomingCall) {
      getUserMedia({ video: true, audio: true }, (mediaStream) => {
        currentUserVideoRef.current.srcObject = mediaStream;
        currentUserVideoRef.current.play();
        incomingCall.answer(mediaStream);
        incomingCall.on("stream", function (remoteStream) {
          remoteVideoRef.current.srcObject = remoteStream;
          remoteVideoRef.current.play();
        });
      });
    }
    // ... handle incoming stream
    setIncomingCall(null);
    // setIsCallActive(true);
  };

  const rejectCall = () => {
    if (peerInstance.current) {
      peerInstance.current.disconnect();
      peerInstance.current = null;
    }
    // setIsCallActive(false);
    // Clear video and audio streams
    if (currentUserVideoRef.current && currentUserVideoRef.current.srcObject) {
      currentUserVideoRef.current.srcObject
        .getTracks()
        .forEach((track) => track.stop());
      currentUserVideoRef.current = null;
    }
    if (remoteVideoRef.current && remoteVideoRef.current.srcObject) {
      remoteVideoRef.current.srcObject
        .getTracks()
        .forEach((track) => track.stop());
      remoteVideoRef.current = null;
    }
    setIncomingCall(null);
    updateUser(currentUser._id);
    updateUser(recepientId);
  };
  return {
    userVideo,
    remoteVideoRef,
    currentUserVideoRef,
    isAudioMuted,
    isVideoMuted,
    incomingCall,
    callUser,
    toggleAudio,
    toggleVideo,
    endCall,
    acceptCall,
    rejectCall,
    peerId,
  };
};

export default useVideoCall;
