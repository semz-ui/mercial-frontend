import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Image,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";
import Actions from "../components/Actions";
import Comments from "../components/Comments";
import useGetUser from "../hooks/useGetUser";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atom/userAtom";
import { formatDistanceToNow } from "date-fns";
import { MdDelete } from "react-icons/md";
import useShowToast from "../hooks/useShowToast";
import postAtom from "../atom/postAtom";

const PostPage = () => {
  const navigate = useNavigate();
  const currentUser = useRecoilValue(userAtom);
  const { loading, user } = useGetUser();
  const [posts, setPost] = useRecoilState(postAtom);
  const { pId } = useParams();
  const showToast = useShowToast();

  const currentPost = posts[0];
  useEffect(() => {
    const getPost = async () => {
      setPost([]);
      try {
        const response = await fetch(`/api/posts/${pId}`);
        const data = await response.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setPost([data]);
      } catch (error) {
        showToast("Error", error, "error");
      }
    };
    getPost();
  }, [setPost, showToast, pId]);
  const handleDelete = async (e) => {
    try {
      e.preventDefault();
      if (!window.confirm("Are you sure you want to delete this post?")) return;
      const res = await fetch("/api/posts/delete/" + currentPost._id, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.error) {
        return showToast("Error", data.error, "error");
      }
      showToast("Success", data.message, "success");
      navigate(`/${currentUser?.username}`);
    } catch (error) {
      return showToast("Error", error.message, "error");
    }
  };
  if (!user && loading) {
    return (
      <Flex justifyContent={"center"} alignItems={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }

  if (!user && !loading) return <h1>User not found</h1>;
  if (!currentPost) return null;
  return (
    <>
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Avatar src={user?.profilePic} name="Mark" size={"md"} />
          <Flex alignItems={"center"}>
            <Text fontSize={"sm"} fontWeight={"bold"}>
              {user?.username}
            </Text>
            <Image src="/verified.png" w={4} h={4} ml={1} />
          </Flex>
        </Flex>
        <Flex gap={4} alignItems={"center"}>
          <Text
            fontSize={"xs"}
            width={36}
            textAlign={"right"}
            color={"gray.light"}
          >
            {formatDistanceToNow(new Date(currentPost.createdAt), {
              addSuffix: true,
            })}
          </Text>
          {/* <BsThreeDots /> */}
          {user?._id === currentUser?._id && (
            <MdDelete size={20} onClick={handleDelete} cursor={"pointer"} />
          )}
        </Flex>
      </Flex>
      <Text my={3}>{currentPost.text}</Text>
      <Box
        borderRadius={6}
        overflow={"hidden"}
        border={"1px solid"}
        borderColor={"gray.light"}
      >
        {currentPost?.img && <Image src={currentPost?.img} w={"full"} />}
      </Box>
      <Flex gap={3} my={3}>
        <Actions post={currentPost} postedBy={currentPost.postedBy} />
      </Flex>
      <Divider my={4} />
      <Flex justifyContent={"space-between"}>
        <Flex alignItems={"center"} gap={2}>
          <Text fontSize={"2xl"}>👋</Text>
          <Text color={"gray.light"}>Get the app to like and reply</Text>
        </Flex>
        <Button>Get</Button>
      </Flex>
      <Divider my={4} />
      {currentPost?.replies?.map((data) => (
        <Comments
          key={data._id}
          data={data}
          lastReply={
            data._id === currentPost.replies[currentPost.replies.length - 1]._id
          }
        />
      ))}
    </>
  );
};

export default PostPage;
