import {
  Avatar,
  Box,
  Button,
  Flex,
  Image,
  Input,
  Skeleton,
  SkeletonCircle,
  Stack,
  Text,
  useColorMode,
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
  const { colorMode } = useColorMode();
  const [conversations, setConversation] = useRecoilState(conversationsAtom);
  const [selectedConversation, setSelectedConversation] = useRecoilState(
    selectedConversationAtom
  );
  const currentUser = useRecoilValue(userAtom);
  const token = JSON.parse(localStorage.getItem("token"));
  const [searchText, setSearchText] = useState("");
  const [searchedUser, setSearchedUser] = useState([]);
  const [load, setLoad] = useState(false);
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

  useEffect(() => {
    socket?.on("updateConversation", (data) => {
      setConversation((prevConvs) => {
        const updatedConversations = prevConvs.map((conversation) => {
          if (conversation._id === data._id) {
            return {
              ...conversation,
              lastMessage: data.lastMessage,
              updatedAt: data.updatedAt,
            };
          }
          return conversation;
        });
        return updatedConversations;
      });
    });
    return () => socket?.off("updateConversation");
  }, [socket, conversations, setConversation]);

  const handleConSearch = async (username, e) => {
    e?.preventDefault();
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/profile/${username}`,
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
    } finally {
      setSearchedUser([]);
      setSearchText("");
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
  const onChangeSearch = async (e) => {
    setLoad(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/search/${searchText}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const searchUser = await res.json();
      if (searchUser.error) {
        showToast("Error", searchUser.error, "error");
        return;
      }
      setSearchedUser(searchUser);
      const messagingYourself = searchUser._id === currentUser._id;
      if (messagingYourself) {
        showToast("Error", "You cannot message yourself", "error");
        return;
      }
    } catch {
      showToast("Error", "It's us not you", "error");
    } finally {
      setLoad(false);
    }
  };
  useEffect(() => {
    if (searchText.length > 0) {
      onChangeSearch();
    }
    if (searchText.length == 0) {
      setSearchedUser([]);
    }
  }, [searchText]);
  console.log(searchText.length);
  console.log(searchedUser);
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
              {searchText.length > 0 && (
                <Stack
                  p={4}
                  position={"absolute"}
                  zIndex={1}
                  w={250}
                  mt={2}
                  bg={colorMode === "light" ? "gray.200" : "gray.700"}
                  borderRadius={5}
                >
                  {load &&
                    [0, 1, 2].map((_, i) => (
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
                        </Flex>
                      </Flex>
                    ))}
                  {searchedUser?.map((user) => (
                    <Flex
                      zIndex={1}
                      key={user._id}
                      alignItems={"center"}
                      gap={2}
                      cursor={"pointer"}
                      mt={3}
                      onClick={() => handleConSearch(user.username)}
                    >
                      <Avatar
                        src={user.profilePic}
                        name={user.username}
                        w={10}
                        h={10}
                      />
                      <Text>{user.username}</Text>
                    </Flex>
                  ))}
                </Stack>
              )}
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
