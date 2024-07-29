import {
  Avatar,
  Image,
  Stack,
  Text,
  WrapItem,
  Box,
  AvatarBadge,
  useColorMode,
  useColorModeValue,
  Flex,
} from "@chakra-ui/react";
import React from "react";
import userAtom from "../atom/userAtom";
import { parseISO, format } from "date-fns";
import { BsCheck2All, BsFillImageFill } from "react-icons/bs";
import { useRecoilState, useRecoilValue } from "recoil";
import { selectedConversationAtom } from "../atom/messagesAtom";

const GroupConversation = ({ conversation, isOnline }) => {
  const colorMode = useColorMode();
  const [selectedConversation, setSelectedConversation] = useRecoilState(
    selectedConversationAtom
  );
  const currentUser = useRecoilValue(userAtom);
  const user = conversation?.group;
  const lastMessage = conversation?.lastMessage;
  const group = conversation?.group;
  function formatTime(timestamp) {
    const date = parseISO(timestamp);
    const formattedTime = format(date, "HH:mm");
    return formattedTime;
  }
  return (
    <Flex
      gap={4}
      alignItems={"center"}
      // justifyContent={"space-between"}
      p={"1"}
      _hover={{
        cursor: "pointer",
        bg: useColorModeValue("gray.600", "gray.dark"),
        color: "white",
      }}
      onClick={() =>
        setSelectedConversation({
          _id: conversation._id,
          userProfilePic: user.profilePic,
          username: user.username,
          mock: conversation.mock,
        })
      }
      bg={
        selectedConversation?._id === conversation._id
          ? colorMode === "light"
            ? "gray.400"
            : "gray.dark"
          : ""
      }
      borderRadius={"md"}
    >
      <WrapItem>
        <Avatar
          size={{
            base: "xs",
            sm: "sm",
            md: "md",
          }}
          src={group?.groupImg}
        />
      </WrapItem>

      <Stack direction={"column"} fontSize={"sm"}>
        <Text fontWeight="700" display={"flex"} alignItems={"center"}>
          {group?.groupName}
        </Text>
        <Text fontSize={"xs"} display={"flex"} alignItems={"center"} gap={1}>
          {currentUser?._id === lastMessage.sender ? (
            <Box color={lastMessage.seen ? "blue.400" : ""}>
              <BsCheck2All size={16} />
            </Box>
          ) : (
            ""
          )}
          {lastMessage?.text?.length > 10
            ? lastMessage.text.substring(0, 10) + "..."
            : lastMessage.text || <BsFillImageFill size={16} />}
        </Text>
      </Stack>
      <Stack>
        {lastMessage?.notSeenLength > 0 && (
          <Text
            textAlign={"center"}
            fontSize={"xx-small"}
            w={4}
            borderRadius={10}
            color={"black"}
            bg={"limegreen"}
          >
            {lastMessage?.notSeenLength}
          </Text>
        )}
        {conversation?.updatedAt && (
          <Text fontSize={"xs"} textAlign={"right"} color={"gray.light"}>
            {formatTime(conversation?.updatedAt)}
          </Text>
        )}
      </Stack>
    </Flex>
  );
};

export default GroupConversation;
