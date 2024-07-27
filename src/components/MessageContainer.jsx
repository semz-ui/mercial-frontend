import {
  Avatar,
  AvatarBadge,
  Divider,
  Flex,
  Image,
  Skeleton,
  SkeletonCircle,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import messageSound from "../assets/sounds/message.mp3";
import Message from "./Message";
import MessageInput from "./MessageInput";
import {
  conversationsAtom,
  messagesAtom,
  selectedConversationAtom,
} from "../atom/messagesAtom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atom/userAtom";
import useShowToast from "../hooks/useShowToast";
import useLoading from "../hooks/useLoading";
import { useSocket } from "../context/SocketContext";
import { FaAngleLeft } from "react-icons/fa";

const MessageContainer = () => {
  const token = JSON.parse(localStorage.getItem("token"));
  const [messages, setMessages] = useState([]);
  const [selectedConversation, setSelectedConversation] = useRecoilState(
    selectedConversationAtom
  );

  const setConversation = useSetRecoilState(conversationsAtom);
  const currentUser = useRecoilValue(userAtom);
  const messageEndRef = useRef(null);
  const showToast = useShowToast();
  const { socket } = useSocket();
  const { loading, startLoader, stopLoader } = useLoading();

  const goBack = () => {
    setSelectedConversation({
      _id: "",
      userId: "",
      username: "",
      userProfilePic: "",
    });
  };

  useEffect(() => {
    socket.on("newMessage", (message) => {
      if (selectedConversation._id === message.conversationId) {
        setMessages((prev) => [...prev, message]);
      }

      // make a sound if the window is not focused
      if (!document.hasFocus()) {
        const sound = new Audio(messageSound);
        sound.play();
      }

      setConversation((prev) => {
        const updatedConversations = prev.map((conversation) => {
          if (conversation._id === message.conversationId) {
            return {
              ...conversation,
              lastMessage: {
                text: message.text,
                sender: message.sender,
              },
            };
          }
          return conversation;
        });
        return updatedConversations;
      });
    });

    return () => socket.off("newMessage");
  }, [socket, selectedConversation, setConversation]);

  useEffect(() => {
    const lastMessageIsFromOtherUser =
      messages.length &&
      messages[messages.length - 1].sender !== currentUser._id;
    if (lastMessageIsFromOtherUser) {
      socket.emit("markMessagesAsSeen", {
        conversationId: selectedConversation._id,
        userId: selectedConversation.userId,
      });
    }

    socket.on("messagesSeen", ({ conversationId }) => {
      if (selectedConversation._id === conversationId) {
        setMessages((prev) => {
          const updatedMessages = prev.map((message) => {
            if (!message.seen) {
              return {
                ...message,
                seen: true,
              };
            }
            return message;
          });
          return updatedMessages;
        });
      }
    });
  }, [socket, currentUser._id, messages, selectedConversation]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const getMessages = async () => {
      startLoader();
      setMessages([]);
      try {
        if (selectedConversation.mock) return;
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/message/${
            selectedConversation.userId
          }`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setMessages(data);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        stopLoader();
      }
    };

    getMessages();
  }, [showToast, selectedConversation.userId, selectedConversation.mock]);
  return (
    <Flex
      flex="70"
      bg={useColorModeValue("gray.200", "gray.dark")}
      borderRadius={"md"}
      p={2}
      flexDirection={"column"}
    >
      {/* Message header */}
      <Flex w={"full"} h={12} alignItems={"center"}>
        <FaAngleLeft cursor={"pointer"} onClick={goBack} />
        <Flex
          alignItems={"center"}
          gap={2}
          w={"full"}
          justifyContent={"center"}
        >
          <Avatar src={selectedConversation?.userProfilePic} size={"sm"} />
          <Text display={"flex"} alignItems={"center"}>
            {selectedConversation?.username}
            <Image src="/verified.png" w={4} h={4} ml={1} />
          </Text>
        </Flex>
      </Flex>

      <Divider pt={"2"} />

      <Flex
        flexDir={"column"}
        gap={4}
        my={4}
        p={2}
        height={"400px"}
        overflowY={"auto"}
      >
        {loading &&
          [...Array(5)].map((_, i) => (
            <Flex
              key={i}
              gap={2}
              alignItems={"center"}
              p={1}
              borderRadius={"md"}
              alignSelf={i % 2 === 0 ? "flex-start" : "flex-end"}
            >
              {i % 2 === 0 && <SkeletonCircle size={7} />}
              <Flex flexDir={"column"} gap={2}>
                <Skeleton h="8px" w="250px" />
                <Skeleton h="8px" w="250px" />
                <Skeleton h="8px" w="250px" />
              </Flex>
              {i % 2 !== 0 && <SkeletonCircle size={7} />}
            </Flex>
          ))}

        {!loading &&
          messages.length > 0 &&
          messages.map((message) => (
            <Flex
              key={message._id}
              direction={"column"}
              ref={
                messages.length - 1 === messages.indexOf(message)
                  ? messageEndRef
                  : null
              }
            >
              <Message
                message={message}
                ownMessage={currentUser._id === message.sender}
              />
            </Flex>
          ))}
      </Flex>

      <MessageInput setMessages={setMessages} />
    </Flex>
  );
};

export default MessageContainer;
