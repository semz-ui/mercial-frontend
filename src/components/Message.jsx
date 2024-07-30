import {
  Avatar,
  Box,
  Flex,
  Image,
  Skeleton,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import { selectedConversationAtom } from "../atom/messagesAtom";
import userAtom from "../atom/userAtom";
import { BsCheck2All } from "react-icons/bs";
import { useState } from "react";
import { parseISO, format } from "date-fns";

const Message = ({ ownMessage, message, previousMessages, lastmessage }) => {
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const user = useRecoilValue(userAtom);
  const [imgLoaded, setImgLoaded] = useState(false);
  const isGroup = selectedConversation.isGroup;
  function formatTime(timestamp) {
    const date = parseISO(timestamp);
    const formattedTime = format(date, "HH:mm");
    return formattedTime;
  }
  return (
    <>
      {ownMessage ? (
        previousMessages.includes(message) ? (
          <Flex
            alignSelf={"flex-end"}
            flexDirection={"column"}
            alignItems={"flex-end"}
          >
            <Flex
              gap={2}
              flexDirection={"column-reverse"}
              bg={"green.800"}
              maxW={"350px"}
              minW={"50px"}
              p={1}
              borderTopRadius={"20px"}
              borderLeftRadius={"20px"}
              borderBottomRightRadius={"5px"}
            >
              {message.text && (
                <Flex justifyContent={"space-between"} px={1}>
                  <Text
                    color={"white"}
                    p={1}
                    textAlign={message.text.length > 10 ? "left" : "center"}
                  >
                    {message.text}
                  </Text>
                  <Box
                    alignSelf={"flex-end"}
                    ml={1}
                    color={message.seen ? "blue.400" : ""}
                    fontWeight={"bold"}
                  >
                    <BsCheck2All size={16} />
                  </Box>
                </Flex>
              )}
              {message.img && !imgLoaded && (
                <Flex mt={5} w={"200px"}>
                  <Image
                    src={message.img}
                    hidden
                    onLoad={() => setImgLoaded(true)}
                    alt="Message image"
                    borderRadius={4}
                  />
                  <Skeleton w={"200px"} h={"200px"} />
                </Flex>
              )}

              {message.img && imgLoaded && (
                <Flex mt={5} w={"200px"}>
                  <Image
                    src={message.img}
                    alt="Message image"
                    borderRadius={4}
                  />
                  {!message.text && (
                    <Box
                      alignSelf={"flex-end"}
                      ml={1}
                      color={message.seen ? "blue.400" : ""}
                      // fontWeight={"bold"}
                      position={"sticky"}
                      marginLeft={"-20px"}
                    >
                      <BsCheck2All size={16} />
                    </Box>
                  )}
                </Flex>
              )}
            </Flex>
            {isGroup && (
              <Flex>
                <Flex gap={1} mt={1} alignItems={"center"}>
                  <Text fontSize={"x-small"} color={"gray"}>
                    {formatTime(message.createdAt)}
                  </Text>
                </Flex>
              </Flex>
            )}
          </Flex>
        ) : (
          <Flex alignSelf={"flex-end"} alignItems={"flex-end"}>
            <Flex
              gap={2}
              alignSelf={"flex-end"}
              flexDirection={"column-reverse"}
              bg={"green.800"}
              maxW={"350px"}
              minW={"50px"}
              p={1}
              borderRadius={
                lastmessage && lastmessage._id === message._id ? "" : "20px"
              }
              borderTopRadius={
                lastmessage && lastmessage._id === message._id ? "20px" : ""
              }
              borderLeftRadius={
                lastmessage && lastmessage._id === message._id ? "20px" : ""
              }
              borderBottomRightRadius={
                lastmessage && lastmessage._id === message._id ? "5px" : ""
              }
            >
              {message.text && (
                <Flex justifyContent={"space-between"} px={1}>
                  <Text
                    color={"white"}
                    p={1}
                    textAlign={message.text.length > 10 ? "left" : "center"}
                  >
                    {message.text}
                  </Text>
                  <Box
                    alignSelf={"flex-end"}
                    ml={1}
                    color={message.seen ? "blue.400" : ""}
                    fontWeight={"bold"}
                  >
                    <BsCheck2All size={16} />
                  </Box>
                </Flex>
              )}
              {message.img && !imgLoaded && (
                <Flex mt={5} w={"200px"}>
                  <Image
                    src={message.img}
                    hidden
                    onLoad={() => setImgLoaded(true)}
                    alt="Message image"
                    borderRadius={4}
                  />
                  <Skeleton w={"200px"} h={"200px"} />
                </Flex>
              )}

              {message.img && imgLoaded && (
                <Flex mt={5} w={"200px"}>
                  <Image
                    src={message.img}
                    alt="Message image"
                    borderRadius={4}
                  />
                  {!message.text && (
                    <Box
                      alignSelf={"flex-end"}
                      ml={1}
                      color={message.seen ? "blue.400" : ""}
                      // fontWeight={"bold"}
                      position={"sticky"}
                      marginLeft={"-20px"}
                    >
                      <BsCheck2All size={16} />
                    </Box>
                  )}
                </Flex>
              )}
            </Flex>
          </Flex>
        )
      ) : previousMessages.includes(message) ? (
        <>
          <Flex alignItems={"flex-end"} gap={2}>
            {isGroup && (
              <Avatar src={message.senderData.profilePic} w="4" h={4} />
            )}
            <Flex
              gap={2}
              flexDirection={"column-reverse"}
              bg={"gray.400"}
              maxW={"350px"}
              minW={"50px"}
              p={1}
              borderTopRadius={"20px"}
              borderRightRadius={"20px"}
              borderBottomLeftRadius={"5px"}
              alignSelf={"flex-start"}
            >
              {message.text && (
                <Text
                  p={1}
                  color={"black"}
                  textAlign={message.text.length > 10 ? "left" : "center"}
                >
                  {message.text}
                </Text>
              )}
              {message.img && !imgLoaded && (
                <Flex mt={5} w={"200px"}>
                  <Image
                    src={message.img}
                    hidden
                    onLoad={() => setImgLoaded(true)}
                    alt="Message image"
                    borderRadius={4}
                  />
                  <Skeleton w={"200px"} h={"200px"} />
                </Flex>
              )}

              {message.img && imgLoaded && (
                <Flex mt={5} w={"200px"}>
                  <Image
                    src={message.img}
                    alt="Message image"
                    borderRadius={4}
                  />
                </Flex>
              )}
            </Flex>
          </Flex>
          {isGroup && (
            <Flex gap={2}>
              {isGroup && (
                <Avatar
                  src={message.senderData.profilePic}
                  w="4"
                  h={4}
                  visibility={"hidden"}
                />
              )}
              <Flex gap={1} mt={1} alignItems={"center"}>
                <Text fontSize={"x-small"} color={"gray"}>
                  {message.senderData.username}
                </Text>
                <Box h={1} w={1} bg={"gray.light"} borderRadius={"full"}></Box>
                <Text fontSize={"x-small"} color={"gray"}>
                  {formatTime(message.createdAt)}
                </Text>
              </Flex>
            </Flex>
          )}
        </>
      ) : (
        <Flex alignItems={"flex-end"} gap={2}>
          {isGroup && lastmessage._id === message._id ? (
            <Avatar src={message.senderData.profilePic} w="4" h={4} />
          ) : (
            <></>
          )}
          <Flex alignItems={"flex-end"} gap={2}>
            {isGroup && lastmessage._id !== message._id ? (
              <Avatar
                src={message.senderData.profilePic}
                w="4"
                h={4}
                visibility={"hidden"}
              />
            ) : (
              <></>
            )}
            <Flex
              gap={2}
              flexDirection={"column-reverse"}
              bg={"gray.400"}
              maxW={"350px"}
              minW={"50px"}
              p={1}
              borderRadius={
                lastmessage && lastmessage._id === message._id ? "" : "20px"
              }
              borderTopRadius={
                lastmessage && lastmessage._id === message._id ? "20px" : ""
              }
              borderRightRadius={
                lastmessage && lastmessage._id === message._id ? "20px" : ""
              }
              borderBottomLeftRadius={
                lastmessage && lastmessage._id === message._id ? "5px" : ""
              }
              alignSelf={"flex-start"}
            >
              {message.text && (
                <Text maxW={"350px"} p={1} color={"black"} textAlign={"left"}>
                  {message.text}
                </Text>
              )}
              {message.img && !imgLoaded && (
                <Flex mt={5} w={"200px"}>
                  <Image
                    src={message.img}
                    hidden
                    onLoad={() => setImgLoaded(true)}
                    alt="Message image"
                    borderRadius={4}
                  />
                  <Skeleton w={"200px"} h={"200px"} />
                </Flex>
              )}

              {message.img && imgLoaded && (
                <Flex mt={5} w={"200px"}>
                  <Image
                    src={message.img}
                    alt="Message image"
                    borderRadius={4}
                  />
                </Flex>
              )}
            </Flex>
          </Flex>
        </Flex>
      )}
    </>
  );
};

export default Message;
