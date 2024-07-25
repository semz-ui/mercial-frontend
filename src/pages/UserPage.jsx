import { Button, Flex, Spinner } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import useLoading from "../hooks/useLoading";
import Post from "../components/Post";
import useGetUser from "../hooks/useGetUser";
import { useRecoilState } from "recoil";
import postAtom from "../atom/postAtom";

function UserPage() {
  const { loading, user } = useGetUser();
  const [posts, setPost] = useRecoilState(postAtom);
  const { username } = useParams();
  const showToast = useShowToast();
  const { loading: load, startLoader, stopLoader } = useLoading();
  useEffect(() => {
    getUserPost();
  }, [username, showToast, setPost]);

  const getUserPost = async () => {
    if (!user) return;
    startLoader();
    try {
      const response = await fetch(
        `https://mercial-backend.onrender.com/api/posts/user/${username}`
      );
      const data = await response.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      setPost(data);
    } catch (error) {
      showToast("Error", error, "error");
      setPost([]);
    } finally {
      stopLoader();
    }
  };

  if (!user && loading && load) {
    return (
      <Flex justifyContent={"center"} alignItems={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }

  if (!user && !loading) return <h1>User not found</h1>;
  console.log(loading);

  return (
    <>
      <UserHeader user={user} />
      {!load && posts?.length === 0 && (
        <h1 style={{ textAlign: "center" }}>Start Posting!😃</h1>
      )}
      {posts !== 0 &&
        posts.map((post) => (
          <Post post={post} postedBy={post?.postedBy} key={post._id} />
        ))}
    </>
  );
}

export default UserPage;
