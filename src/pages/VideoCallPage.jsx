import React, { useEffect, useRef, useState } from "react";
import { Peer } from "peerjs";
import { Stack } from "@chakra-ui/react";
import userAtom from "../atom/userAtom";
import { useRecoilValue } from "recoil";

const VideoCallPage = () => {
  const currentUser = useRecoilValue(userAtom);
  const [peerId, setPeerId] = useState("");
  const [call, setCall] = useState(null);
  const [userVideo, setUserVideo] = useState(null);
  const [partnerVideo, setPartnerVideo] = useState(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [incomingCall, setIncomingCall] = useState(null);
  const [remotePeerIdValue, setRemotePeerIdValue] = useState("");
  const remoteVideoRef = useRef(null);
  const currentUserVideoRef = useRef(null);
  const peerInstance = useRef(null);

  useEffect(() => {
    const peer = new Peer();
    peer.on("open", (id) => {
      setPeerId(id);
    });

    peer.on("call", (call) => {
      setIncomingCall(call);
    });
    peerInstance.current = peer;
  }, [incomingCall]);
  //   console.log(currentUser._id, "lok");

  const callUser = (remotePeerId) => {
    var getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia;

    getUserMedia({ video: true, audio: true }, (mediaStream) => {
      setUserVideo(mediaStream);
      currentUserVideoRef.current.srcObject = mediaStream;
      currentUserVideoRef.current.play();

      const call = peerInstance.current.call(remotePeerId, mediaStream);
      console.log(call, "kl");
      setCall(call);
      call.on("stream", (remoteStream) => {
        setPartnerVideo(remoteStream);
        remoteVideoRef.current.srcObject = remoteStream;
        remoteVideoRef.current.play();
      });
    });
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

    // Notify the other peer about the video status change
    // if (peerInstance.current) {
    //   const sender = peerInstance.current
    //     .getSenders()
    //     .find((sender) => sender.track.kind === "video");
    //   sender.replaceTrack(videoTrack);
    // }
    // setIsVideoMuted(!isVideoMuted);
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
  };
  return (
    <div>
      <h1>Current user id is {peerId}</h1>
      <input
        type="text"
        value={remotePeerIdValue}
        onChange={(e) => setRemotePeerIdValue(e.target.value)}
      />
      <button onClick={() => callUser(remotePeerIdValue)}>Call</button>
      <div>
        <video ref={currentUserVideoRef} playsInline autoPlay />

        <Stack cursor={"pointer"} onClick={() => toggleAudio()}>
          <p>toggle audio</p>
        </Stack>
        <Stack cursor={"pointer"} onClick={() => toggleVideo()}>
          <p>toggle video</p>
        </Stack>
        <Stack cursor={"pointer"} onClick={() => endCall()}>
          <p>end call</p>
        </Stack>
      </div>
      <div
        style={{
          borderRadius: "10px",
          border: "1px solid red",
          //   visibility: "hidden",
        }}
      >
        <video ref={remoteVideoRef} playsInline autoPlay />
        user video
      </div>
      {incomingCall ? (
        <div>
          {/* Incoming call from {incomingCall.metadata.callerId} */}
          <button onClick={acceptCall}>Accept</button>
          <button onClick={rejectCall}>Reject</button>
        </div>
      ) : (
        // ... other UI elements
        <></>
      )}
    </div>
  );
};

export default VideoCallPage;
