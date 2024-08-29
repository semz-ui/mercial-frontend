import React from "react";
import { IoVideocamOutline } from "react-icons/io5";
import useVideoCall from "../hooks/useVideoCall";
import { Flex, Stack } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import callAtom from "../atom/callAtom";
import userAtom from "../atom/userAtom";

const VideoCall = () => {
  const call = useRecoilValue(callAtom);
  const currentUser = useRecoilValue(userAtom);
  console.log(currentUser.peerId);
  const {
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
  } = useVideoCall(currentUser?.peerId);
  console.log(call);
  return (
    <Stack position={"sticky"} right={0}>
      <IoVideocamOutline
        size={20}
        cursor={"pointer"}
        onClick={() => callUser()}
      />
      {/* <button >Call</button> */}

      {call && (
        <Stack>
          <h1>Current user id is {peerId}</h1>
          {/* <input
          type="text"
          value={remotePeerIdValue}
          onChange={(e) => setRemotePeerIdValue(e.target.value)}
        /> */}
          <div>
            <video ref={currentUserVideoRef} playsInline muted />

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
            <video ref={remoteVideoRef} playsInline muted />
            user video
          </div>
          <Flex gap={10}>
            {/* Incoming call from {incomingCall.metadata.callerId} */}
            <button onClick={acceptCall}>Accept</button>
            <button onClick={rejectCall}>Reject</button>
          </Flex>
        </Stack>
      )}
    </Stack>
  );
};

export default VideoCall;
