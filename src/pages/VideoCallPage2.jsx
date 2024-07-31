import React, { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import { Stack } from "@chakra-ui/react";

const VideoCallPage = () => {
  const [peerId, setPeerId] = useState("");
  const [cameraOn, setCameraOn] = useState(true);
  const [remotePeerIdValue, setRemotePeerIdValue] = useState("");
  const remoteVideoRef = useRef(null);
  const currentUserVideoRef = useRef(null);
  const peerInstance = useRef(null);
  const peer = new Peer();

  useEffect(() => {
    peer.on("open", (id) => {
      setPeerId(id);
    });

    peer.on("call", (call) => {
      var getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;

      getUserMedia({ video: true, audio: false }, (mediaStream) => {
        currentUserVideoRef.current.srcObject = mediaStream;
        currentUserVideoRef.current.play();
        call.answer(mediaStream);
        call.on("stream", function (remoteStream) {
          remoteVideoRef.current.srcObject = remoteStream;
          remoteVideoRef.current.play();
        });
      });
    });
    peerInstance.current = peer;
  }, []);

  const call = (remotePeerId) => {
    var getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia;

    getUserMedia({ video: true, audio: false }, (mediaStream) => {
      currentUserVideoRef.current.srcObject = mediaStream;
      currentUserVideoRef.current.play();

      const call = peerInstance.current.call(remotePeerId, mediaStream);
      call.on("stream", (remoteStream) => {
        remoteVideoRef.current.srcObject = remoteStream;
        remoteVideoRef.current.play();
      });
    });
  };

  const endCall = (remotePeerId) => {
    var getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia;

    getUserMedia({ video: true, audio: false }, (mediaStream) => {
      remoteVideoRef.current.srcObject = mediaStream;
      remoteVideoRef.current.stop();
      currentUserVideoRef.current.srcObject = null;
      const call = peerInstance.current.call(remotePeerId, mediaStream);

      // call.on("stream", (remoteStream) => {
      //   // ... other code
      //   console.log("stream");
      // });

      // call.on("close", () => {
      //   // Handle call end
      //   console.log("Call ended");
      // });

      // const endCall = () => {
      call.close();
    });
    // };
  };

  const stopRemoteVideo = () => {
    if (currentUserVideoRef.current.srcObject) {
      currentUserVideoRef.current.srcObject
        .getTracks()
        .forEach((track) => track.stop());
      currentUserVideoRef.current.srcObject = null; // Clear video element source
      setCameraOn(false);
    }
  };
  const toggleVideo = () => {
    if (currentUserVideoRef.current.srcObject) {
      const tracks = currentUserVideoRef.current.srcObject.getVideoTracks();
      tracks[0].enabled = !tracks[0].enabled;
      setCameraOn(true);
    }
  };
  //   console.log(remotePeerIdValueVideo);
  return (
    <div>
      <h1>Current user id is {peerId}</h1>
      <input
        type="text"
        value={remotePeerIdValue}
        onChange={(e) => setRemotePeerIdValue(e.target.value)}
      />
      <button onClick={() => call(remotePeerIdValue)}>Call</button>
      <div>
        <video ref={currentUserVideoRef} />
        {/* <Stack cursor={"pointer"} onClick={endCall}>
          <p>sjs</p>
        </Stack> */}

        {cameraOn && (
          <Stack
            cursor={"pointer"}
            onClick={() => endCall(currentUserVideoRef)}
          >
            <p>off video</p>
          </Stack>
        )}
        {!cameraOn && (
          <Stack cursor={"pointer"} onClick={() => toggleVideo()}>
            <p>on video</p>
          </Stack>
        )}
      </div>
      <div
        style={{
          borderRadius: "10px",
          border: "1px solid red",
          //   visibility: "hidden",
        }}
      >
        <video ref={remoteVideoRef} />
        user video
      </div>
    </div>
  );
};

export default VideoCallPage;
