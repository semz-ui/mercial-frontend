import { Avatar, Box, Flex, Image, Skeleton, Text } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import { selectedConversationAtom } from "../atom/messagesAtom";
import userAtom from "../atom/userAtom";
import { BsCheck2All } from "react-icons/bs";
import { useState } from "react";

const Message = ({ ownMessage, message }) => {
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const user = useRecoilValue(userAtom);
  const [imgLoaded, setImgLoaded] = useState(false);
  return (
    <>
      {ownMessage ? (
        <Flex
          gap={2}
          alignSelf={"flex-end"}
          flexDirection={"column-reverse"}
          bg={"green.800"}
          maxW={"350px"}
          p={1}
          borderRadius={"md"}
        >
          {message.text && (
            <Flex justifyContent={"space-between"} px={1}>
              <Text color={"white"}>{message.text}</Text>
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
              <Image src={message.img} alt="Message image" borderRadius={4} />
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

          {/* <Avatar src={user.profilePic} w="7" h={7} /> */}
        </Flex>
      ) : (
        <Flex
          gap={2}
          flexDirection={"column-reverse"}
          bg={"gray.400"}
          maxW={"350px"}
          p={1}
          borderRadius={"md"}
          alignSelf={"flex-start"}
        >
          {/* <Avatar src={selectedConversation.userProfilePic} w="7" h={7} /> */}

          {message.text && (
            <Text maxW={"350px"} p={1} borderRadius={"md"} color={"black"}>
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
              <Image src={message.img} alt="Message image" borderRadius={4} />
            </Flex>
          )}
        </Flex>
      )}
    </>
  );
};

export default Message;
