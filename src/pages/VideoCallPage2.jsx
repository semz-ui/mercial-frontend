import React, { useEffect, useRef, useState } from "react";
import { useSocket } from "../context/SocketContext";
import { useRecoilValue } from "recoil";
import Peer from "simple-peer";
import userAtom from "../atom/userAtom";

const VideoCallPage2 = () => {
  const currentUser = useRecoilValue(userAtom);
  const [yourID, setYourID] = useState("");
  const [users, setUsers] = useState({});
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);

  const userVideo = useRef();
  const partnerVideo = useRef();

  const { socket } = useSocket();

  useEffect(() => {
    socket?.on("yourID", (id) => {
      setYourID(id);
    });
    socket?.on("allUsers", (users) => {
      setUsers(users);
    });

    socket?.on("hey", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setCallerSignal(data.signal);
    });
  }, [stream]);
  console.lo9stream, "stream";

  function callPeer(id) {
    // var getUserMedia =
    //   navigator.getUserMedia ||
    //   navigator.webkitGetUserMedia ||
    //   navigator.mozGetUserMedia;

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        userVideo.current.srcObject = stream;
      });

    if (userVideo.current.srcObject) {
      const peer = new Peer({
        initiator: true,
        trickle: false,
        config: {
          iceServers: [
            {
              urls: "stun:numb.viagenie.ca",
              username: "sultan1640@gmail.com",
              credential: "98376683",
            },
            {
              urls: "turn:numb.viagenie.ca",
              username: "sultan1640@gmail.com",
              credential: "98376683",
            },
          ],
        },
        stream: userVideo.current.srcObject,
      });

      peer.on("signal", (data) => {
        socket.current.emit("callUser", {
          userToCall: id,
          signalData: data,
          from: yourID,
        });
      });

      peer.on("stream", (stream) => {
        if (partnerVideo.current) {
          partnerVideo.current.srcObject = stream;
        }
      });

      socket.on("callAccepted", (signal) => {
        setCallAccepted(true);
        peer.signal(signal);
      });
    }
  }

  function acceptCall() {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      socket.current.emit("acceptCall", { signal: data, to: caller });
    });

    peer.on("stream", (stream) => {
      partnerVideo.current.srcObject = stream;
    });

    peer.signal(callerSignal);
  }
  return (
    <div>
      <video ref={userVideo} playsInline autoPlay muted />

      <p onClick={() => callPeer(currentUser._id)}>Call</p>

      <video ref={partnerVideo} playsInline autoPlay muted />

      {receivingCall && !callAccepted && (
        <div>
          <p>{caller} is calling you</p>
          <button onClick={acceptCall}>Accept</button>
        </div>
      )}
    </div>
  );
};

export default VideoCallPage2;
