import {
  Avatar,
  Box,
  Button,
  Flex,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { BsChat, BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import React, { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atom/userAtom";
import { useNavigate } from "react-router-dom";
import {
  conversationsAtom,
  selectedConversationAtom,
} from "../atom/messagesAtom";
import useShowToast from "../hooks/useShowToast";

const UserHeader = ({ user }) => {
  const token = JSON.parse(localStorage.getItem("token"));
  const currentUser = useRecoilValue(userAtom);
  const [selectedConversation, setSelectedConversation] = useRecoilState(
    selectedConversationAtom
  );
  const [conversations, setConversation] = useRecoilState(conversationsAtom);
  const [following, setFollowing] = useState(
    user?.followers?.includes(currentUser?._id)
  );
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const showToast = useShowToast();
  const copyUrl = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then(() => {
      toast({
        title: "Copied Successfully.",
        description: "You can share your profile across different platforms!.",
        status: "info",
        duration: 5000,
        isClosable: true,
      });
    });
  };

  console.log(conversations, "lkå");
  console.log(selectedConversation, "lk");

  const handleGoToChat = () => {
    const messagingYourself = user._id === currentUser._id;
    if (messagingYourself) {
      showToast("Error", "You cannot message yourself", "error");
      return;
    }

    const conversationAlreadyExists = conversations.find(
      (conversation) => conversation.participants[0]?._id === user?._id
    );

    if (!conversationAlreadyExists) {
      const mockConversation = {
        mock: true,
        lastMessage: {
          text: "",
          sender: "",
        },
        _id: Date.now(),
        participants: [
          {
            _id: user._id,
            username: user.username,
            profilePic: user.profilePic,
          },
        ],
      };
      setSelectedConversation({
        // _id: conversationAlreadyExists._id,
        userId: user._id,
        username: user.username,
        userProfilePic: user.profilePic,
      });
      setConversation((prevConvs) => [...prevConvs, mockConversation]);
      // navigate("/chat");
    }

    if (conversationAlreadyExists) {
      setSelectedConversation({
        _id: conversationAlreadyExists._id,
        userId: user._id,
        username: user.username,
        userProfilePic: user.profilePic,
      });
      navigate("/chat");
    }
  };
  const followUnfollowUser = async () => {
    if (!currentUser) {
      toast({
        title: "Error",
        description: "Please login to continue",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (updating) return;
    setUpdating(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/follow/${user._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId: currentUser?._id }),
        }
      );
      const data = await response.json();
      if (data.error) {
        console.log(data);
        toast({
          title: "Error",
          description: data.error,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      if (following) {
        toast({
          title: "Copied Successfully.",
          description: `Unfollowed ${user?.username}`,
          status: "info",
          duration: 5000,
          isClosable: true,
        });
        user.followers.pop();
      } else {
        toast({
          title: "Copied Successfully.",
          description: `Followed ${user?.username}`,
          status: "info",
          duration: 5000,
          isClosable: true,
        });
        user.followers.push(currentUser?._id);
      }
      setFollowing(!following);
      console.log(data);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setUpdating(false);
    }
  };
  return (
    <VStack gap={4} alignItems={"start"}>
      <Flex justifyContent={"space-between"} w={"full"}>
        <Box>
          <Text fontSize={"2xl"} fontWeight={"bold"}>
            {user?.name}
          </Text>
          <Flex gap={2} alignItems={"center"}>
            <Text fontSize={"sm"}>{user?.username}</Text>
            <Text
              fontSize={"xs"}
              bg={"gray.dark "}
              color={"gray.light"}
              borderRadius={"full"}
              p={2}
            >
              threads.net
            </Text>
          </Flex>
        </Box>
        <Box>
          <Avatar
            name={user?.name}
            src={user?.profilePic}
            size={{
              base: "md",
              md: "xl",
            }}
          />
        </Box>
      </Flex>
      <Text>{user?.bio}</Text>
      {currentUser?._id === user?._id ? (
        <Button
          size={"sm"}
          onClick={() => {
            navigate("/update-profile");
          }}
        >
          Edit Profile
        </Button>
      ) : (
        <Flex alignItems={"center"} gap={5}>
          <Button
            size={"sm"}
            onClick={() => {
              followUnfollowUser();
            }}
            isLoading={updating}
          >
            {following ? "Unfollow" : "Follow"}
          </Button>
          {/* <BsChat size={20} onClick={handleGoToChat} /> */}
        </Flex>
      )}
      <Flex w={"full"} justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text color={"gray.light"}>{user?.followers.length} followers</Text>
          <Box h={1} w={1} bg={"gray.light"} borderRadius={"full"}></Box>
          <Link color={"gray.light"}>{user?.following.length} following</Link>
        </Flex>
        <Flex>
          <Box className="icon-container">
            <BsInstagram size={24} cursor={"pointer"} />
          </Box>
          <Box className="icon-container">
            <Menu>
              <MenuButton>
                <CgMoreO size={24} cursor={"pointer"} />
              </MenuButton>
              <Portal>
                <MenuList bg={"gray.dark"}>
                  <MenuItem bg={"gray.dark"} onClick={copyUrl}>
                    Copy Link
                  </MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Flex>
      </Flex>
      <Flex w={"full"}>
        <Flex
          flex={1}
          borderBottom={"1.5px solid white"}
          justifyContent={"center"}
          pb={3}
          cursor={"pointer"}
        >
          <Text fontWeight={"bold"}>Threads</Text>
        </Flex>
        <Flex
          flex={1}
          borderBottom={"1px solid gray"}
          justifyContent={"center"}
          pb={3}
          cursor={"pointer"}
        >
          <Text fontWeight={"bold"}>Replies</Text>
        </Flex>
      </Flex>
    </VStack>
  );
};

export default UserHeader;
