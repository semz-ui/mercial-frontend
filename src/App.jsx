import { Box, Container, Flex } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import { useRecoilValue, useSetRecoilState } from "recoil";
import UpdateProfile from "./pages/UpdateProfile";
import CreatePost from "./components/CreatePost";
import ChatPage from "./pages/ChatPage";
import userAtom from "./atom/userAtom";
import Logout from "./components/Logout";
import CreateGroup from "./components/CreateGroup";
import VideoCallPage from "./pages/VideoCallPage";
import callAtom from "./atom/callAtom";
import { useSocket } from "./context/SocketContext";

export default function App() {
  const { socket } = useSocket();
  const user = useRecoilValue(userAtom);
  const setUser = useSetRecoilState(userAtom);
  const { pathname } = useLocation();
  useEffect(() => {
    socket?.on("updateUserPeerId", (data) => {
      console.log(data);
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
    });

    return () => socket?.off("updateUserPeerId");
  }, [socket, setUser, user]);
  return (
    <Box position={"relative"} w="full">
      <Container
        maxW={pathname === "/" ? { base: "620px", md: "900px" } : "620px"}
      >
        <Header />
        <Routes>
          <Route
            path="/"
            element={user ? <HomePage /> : <Navigate to="/auth" />}
          />
          <Route
            path="/auth"
            element={!user ? <AuthPage /> : <Navigate to="/" />}
          />
          <Route
            path="/update-profile"
            element={user ? <UpdateProfile /> : <Navigate to="/auth" />}
          />
          <Route path="/:username" element={<UserPage />} />
          <Route path="/:username/post/:pId" element={<PostPage />} />
          <Route
            path="/chat"
            element={user ? <ChatPage /> : <Navigate to="/auth" />}
          />
          <Route
            path="/chat/create-group"
            element={user ? <CreateGroup /> : <Navigate to="/auth" />}
          />
          <Route
            path="/video-call"
            element={user ? <VideoCallPage /> : <Navigate to="/auth" />}
          />
        </Routes>
        {pathname !== "/chat" && user && <CreatePost />}
      </Container>
    </Box>
  );
}
