import { Box, Button, Flex, Spinner, Text } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import useLoading from "../hooks/useLoading";
import useShowToast from "../hooks/useShowToast";
import Post from "../components/Post";
import postAtom from "../atom/postAtom";
import { useRecoilState } from "recoil";
import SuggestedUsers from "../components/SuggestedUsers";

const HomePage = () => {
  const [posts, setPosts] = useRecoilState(postAtom);
  const { loading, startLoader, stopLoader } = useLoading();
  const showToast = useShowToast();
  useEffect(() => {
    const getFeedPosts = async () => {
      startLoader();
      setPosts([]);
      try {
        const res = await fetch(
          "https://mercial-backend.onrender.com/api/posts/feed"
        );
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setPosts(data);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        stopLoader();
      }
    };
    getFeedPosts();
  }, [showToast, setPosts]);
  return (
    <Flex
      gap="10"
      alignItems={"flex-start"}
      justifyContent={"space-between"}
      w={"full"}
    >
      <Box flex={70}>
        {!loading && posts.length === 0 && (
          <Text textAlign={"center"}>Follow some users to see the feed</Text>
        )}

        {loading && (
          <Flex justify="center">
            <Spinner size="xl" />
          </Flex>
        )}

        {posts.map((post) => (
          <Post key={post._id} post={post} postedBy={post.postedBy} />
        ))}
      </Box>
      <Box
        flex={30}
        display={{
          base: "none",
          md: "block",
        }}
      >
        <SuggestedUsers />
      </Box>
    </Flex>
  );
};

export default HomePage;
