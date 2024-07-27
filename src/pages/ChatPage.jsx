import {
  Box,
  Button,
  Flex,
  Input,
  Skeleton,
  SkeletonCircle,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { BsFillChatHeartFill, BsSearch } from "react-icons/bs";
import Conversation from "../components/Conversation";
import MessageContainer from "../components/MessageContainer";
import useLoading from "../hooks/useLoading";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  conversationsAtom,
  selectedConversationAtom,
} from "../atom/messagesAtom";
import useShowToast from "../hooks/useShowToast";
import userAtom from "../atom/userAtom";
import { useSocket } from "../context/SocketContext";

const ChatPage = () => {
  const [conversations, setConversation] = useRecoilState(conversationsAtom);
  const [selectedConversation, setSelectedConversation] = useRecoilState(
    selectedConversationAtom
  );
  const currentUser = useRecoilValue(userAtom);
  const token = JSON.parse(localStorage.getItem("token"));
  const [searchText, setSearchText] = useState("");
  const { loading, startLoader, stopLoader } = useLoading();
  const showToast = useShowToast();
  const { socket, onlineUsers } = useSocket();

  useEffect(() => {
    socket?.on("messagesSeen", ({ conversationId }) => {
      setConversation((prev) => {
        const updatedConversations = prev.map((conversation) => {
          if (conversation._id === conversationId) {
            return {
              ...conversation,
              lastMessage: {
                ...conversation.lastMessage,
                seen: true,
              },
            };
          }
          return conversation;
        });
        return updatedConversations;
      });
    });
  }, [socket, setConversation]);

  const handleConSearch = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/profile/${searchText}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const searchedUser = await res.json();
      if (searchedUser.error) {
        showToast("Error", searchedUser.error, "error");
        return;
      }

      const messagingYourself = searchedUser._id === currentUser._id;
      if (messagingYourself) {
        showToast("Error", "You cannot message yourself", "error");
        return;
      }

      const conversationAlreadyExists = conversations.find(
        (conversation) => conversation.participants[0]._id === searchedUser._id
      );

      if (conversationAlreadyExists) {
        setSelectedConversation({
          _id: conversationAlreadyExists._id,
          userId: searchedUser._id,
          username: searchedUser.username,
          userProfilePic: searchedUser.profilePic,
        });
        return;
      }

      const mockConversation = {
        mock: true,
        lastMessage: {
          text: "",
          sender: "",
        },
        _id: Date.now(),
        participants: [
          {
            _id: searchedUser._id,
            username: searchedUser.username,
            profilePic: searchedUser.profilePic,
          },
        ],
      };
      setConversation((prevConvs) => [...prevConvs, mockConversation]);
    } catch (error) {
      showToast("Error", "It's us, not you", "error");
    }
  };

  useEffect(() => {
    const getConversations = async () => {
      startLoader();
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/message/conversations`,
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
        setConversation(data);
      } catch (error) {
        showToast("Error", "It's us not you", "error");
      } finally {
        stopLoader();
      }
    };
    getConversations();
  }, [showToast, setConversation]);
  return (
    <Box
      position={"absolute"}
      left={"50%"}
      transform={"translateX(-50%)"}
      p={4}
      w={{
        base: "100%",
        md: "80%",
        lg: "750px",
      }}
    >
      <Flex
        gap={4}
        flexDirection={{
          base: "column",
          md: "row",
        }}
        maxW={{
          sm: "400px",
          md: "full",
        }}
        mx={"auto"}
      >
        {!selectedConversation._id && (
          <Flex
            flex={30}
            gap={2}
            flexDirection={"column"}
            maxW={{
              sm: "250px",
              md: "full",
            }}
            mx={"auto"}
          >
            <Text fontWeight={700}>Your Conversations</Text>
            <form onSubmit={handleConSearch}>
              <Flex alignItems={"center"} gap={1}>
                <Input
                  placeholder="Serach for a user..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
                <Button size={"md"}>
                  <BsSearch />
                </Button>
              </Flex>
            </form>
            {loading &&
              [0, 1, 2, 3, 4].map((_, i) => (
                <Flex
                  key={i}
                  gap={4}
                  alignItems={"center"}
                  p={"1"}
                  borderRadius={"md"}
                >
                  <Box>
                    <SkeletonCircle size={"10"} />
                  </Box>
                  <Flex w={"full"} flexDirection={"column"} gap={3}>
                    <Skeleton h={"10px"} w={"80px"} />
                    <Skeleton h={"8px"} w={"90%"} />
                  </Flex>
                </Flex>
              ))}
            {!loading &&
              conversations.map((conversation) => (
                <Conversation
                  key={conversation._id}
                  isOnline={onlineUsers.includes(
                    conversation.participants[0]?._id
                  )}
                  conversation={conversation}
                />
              ))}
          </Flex>
        )}
        {!selectedConversation._id && (
          <Flex
            flex={70}
            borderRadius={"md"}
            p={2}
            flexDir={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            height={"400px"}
          >
            <BsFillChatHeartFill size={100} />
            <Text fontSize={20}>Select a conversation to start messaging</Text>
          </Flex>
        )}
        {selectedConversation._id && <MessageContainer />}
      </Flex>
    </Box>
  );
};

export default ChatPage;
