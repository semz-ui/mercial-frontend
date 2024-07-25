import { Avatar, Box, Flex, Image, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { Link } from "react-router-dom";
import Actions from "./Actions";

const UserPost = () => {
  const [liked, setLiked] = useState(false);
  return (
    <Link to={"/markzuckerberg/post/1"}>
      <Flex gap={3} mb={4} py={5}>
        <Flex flexDirection={"column"} alignItems={"center"}>
          <Avatar name="Mark" size={"md"} src="/zuck-avatar.png" />
          <Box w={"1px"} h={"full"} bg={"gray.light"} my={2} />
          <Box position={"relative"} width={"full"}>
            <Avatar
              size={"xs"}
              name="J"
              position={"absolute"}
              top={0}
              left={"15px"}
              padding={"2px"}
            />
            <Avatar
              size={"xs"}
              name="M"
              position={"absolute"}
              bottom={0}
              right={"-5px"}
              padding={"2px"}
            />
            <Avatar
              size={"xs"}
              name="O"
              position={"absolute"}
              bottom={0}
              left={"4px"}
              padding={"2px"}
            />
          </Box>
        </Flex>
        <Flex flex={1} flexDirection={"column"} gap={2}>
          <Flex justifyContent={"space-between"} w={"full"}>
            <Flex w={"full"} alignItems={"center"}>
              <Text fontSize={"sm"} fontWeight={"bold"}>
                Mark Zuckerberg
              </Text>
              <Image src="/verified.png" w={4} h={4} ml={1} />
            </Flex>
            <Flex gap={4} alignItems={"center"}>
              <Text fontSize={"sm"} color={"gray.light"}>
                1d
              </Text>
              <BsThreeDots />
            </Flex>
          </Flex>
          <Text fontSize={"sm"}>This is my first post</Text>
          <Box
            borderRadius={6}
            overflow={"hidden"}
            border={"1px solid"}
            borderColor={"gray.light"}
          >
            <Image src="/post1.png" w={"full"} />
          </Box>
          <Flex gap={3} my={1}>
            <Actions liked={liked} setLiked={setLiked} />
          </Flex>
        </Flex>
      </Flex>
    </Link>
  );
};

export default UserPost;
