import { Avatar, Box, Flex, Image, Spinner, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import Actions from "./Actions";
import useShowToast from "../hooks/useShowToast";
import { formatDistanceToNow } from "date-fns";
import { MdDelete } from "react-icons/md";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atom/userAtom";
import postAtom from "../atom/postAtom";
import useLoading from "../hooks/useLoading";

const Post = ({ post, postedBy }) => {
  const navigate = useNavigate();
  const { loading, startLoader, stopLoader } = useLoading();
  const showToast = useShowToast();
  const [user, setUser] = useState(null);
  const [posts, setPost] = useRecoilState(postAtom);
  const currentUser = useRecoilValue(userAtom);
  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch(
          `https://mercial-backend.onrender.com/api/users/profile/${postedBy}`
        );
        const data = await response.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        // setLiked(data.liked);
        setUser(data);
      } catch (error) {
        showToast("Error", error, "error");
        setUser(null);
      }
    };
    getUser();
  }, []);
  const handleDelete = async (e) => {
    startLoader();
    try {
      e.preventDefault();
      if (!window.confirm("Are you sure you want to delete this post?")) return;
      const res = await fetch(
        "https://mercial-backend.onrender.com/api/posts/delete/" + post._id,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (data.error) {
        return showToast("Error", data.error, "error");
      }
      showToast("Success", data.message, "success");
      setPost(posts.filter((p) => p._id !== post._id));
    } catch (error) {
      return showToast("Error", error.message, "error");
    } finally {
      stopLoader();
    }
  };
  return (
    <Link to={`/${user?.username}/post/${post._id}`}>
      <Flex gap={3} mb={4} py={5}>
        <Flex flexDirection={"column"} alignItems={"center"}>
          <Avatar
            name="Mark"
            size={"md"}
            src={user?.profilePic}
            onClick={(e) => {
              e.preventDefault();
              navigate(`/${user?.username}`);
            }}
          />
          <Box w={"1px"} h={"full"} bg={"gray.light"} my={2} />
          <Box position={"relative"} width={"full"}>
            {post?.replies?.length == 0 && <Text textAlign={"center"}>🥱</Text>}
            {post?.replies[0] && (
              <Avatar
                size={"xs"}
                name="J"
                position={"absolute"}
                top={0}
                left={"15px"}
                padding={"2px"}
                src={post.replies[0]?.userProfilePic}
              />
            )}
            {post?.replies[1] && (
              <Avatar
                size={"xs"}
                name="J"
                position={"absolute"}
                top={0}
                left={"15px"}
                padding={"2px"}
                src={post.replies[1]?.userProfilePic}
              />
            )}
            {post?.replies[2] && (
              <Avatar
                size={"xs"}
                name="J"
                position={"absolute"}
                top={0}
                left={"15px"}
                padding={"2px"}
                src={post.replies[2]?.userProfilePic}
              />
            )}
          </Box>
        </Flex>
        <Flex flex={1} flexDirection={"column"} gap={2}>
          <Flex justifyContent={"space-between"} w={"full"}>
            <Flex
              w={"full"}
              alignItems={"center"}
              onClick={(e) => {
                e.preventDefault();
                navigate(`/${user?.username}`);
              }}
            >
              <Text fontSize={"sm"} fontWeight={"bold"}>
                {user?.name}
              </Text>
              <Image src="/verified.png" w={4} h={4} ml={1} />
            </Flex>
            <Flex gap={4} alignItems={"center"}>
              <Text
                fontSize={"xs"}
                width={36}
                textAlign={"right"}
                color={"gray.light"}
              >
                {formatDistanceToNow(new Date(post.createdAt), {
                  addSuffix: true,
                })}
              </Text>
              {/* <BsThreeDots /> */}
              {loading ? (
                <Spinner />
              ) : (
                user?._id === currentUser?._id && (
                  <MdDelete size={20} onClick={handleDelete} />
                )
              )}
            </Flex>
          </Flex>
          <Text fontSize={"sm"}>{post.text}</Text>
          <Box
            borderRadius={6}
            overflow={"hidden"}
            border={"1px solid"}
            borderColor={"gray.light"}
          >
            {post.img && (
              <Image
                src={post.img}
                w={"full"}
                h={"300px"}
                objectFit={"cover"}
              />
            )}
          </Box>
          <Flex gap={3} my={1}>
            <Actions
              post={post}
              likes={post.likes.length}
              replies={post.replies.length}
            />
          </Flex>
        </Flex>
      </Flex>
    </Link>
  );
};

export default Post;
