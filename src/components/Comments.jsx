import { Avatar, Box, Divider, Flex, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import Actions from "./Actions";

const Comments = ({ data, lastReply }) => {
  const [liked, setLiked] = useState(false);
  return (
    <Box>
      <Flex gap={4} py={2} my={2} w={"full"}>
        <Avatar src={data.userProfilePic} name={data.name} size={"sm"} />
        <Flex gap={1} w={"full"} flexDirection={"column"}>
          <Flex
            w={"full"}
            justifyContent={"space-between"}
            alignItems={"cenetr"}
          >
            <Text fontSize={"sm"} fontWeight={"bold"}>
              {data.username}
            </Text>
            <Flex gap={2} alignItems={"center"}>
              <Text fontSize={"sm"} color={"gray.light"}>
                1d
              </Text>
              <BsThreeDots />
            </Flex>
          </Flex>
          <Text>{data.text}</Text>
          <Actions liked={liked} setLiked={setLiked} />
        </Flex>
      </Flex>
      {!lastReply && <Divider />}
    </Box>
  );
};

export default Comments;
