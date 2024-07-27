import {
  Button,
  CloseButton,
  Flex,
  FormControl,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { CgAdd } from "react-icons/cg";
import usePreviewImage from "../hooks/usePreviewImage";
import { BsImageFill } from "react-icons/bs";
import useShowToast from "../hooks/useShowToast";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atom/userAtom";
import postAtom from "../atom/postAtom";
import { useParams } from "react-router-dom";

const MAX_CHAR = 500;

const CreatePost = () => {
  const { username } = useParams();
  const user = useRecoilValue(userAtom);
  const token = JSON.parse(localStorage.getItem("token"));
  const [updating, setUpdating] = useState(false);
  const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [postText, setPostText] = useState("");
  const [posts, setPost] = useRecoilState(postAtom);
  const fileRef = useRef(null);
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImage();
  const showToast = useShowToast();

  const handleTextChange = (e) => {
    const inputText = e.target.value;

    if (inputText.length > MAX_CHAR) {
      const truncatedText = inputText.slice(0, MAX_CHAR);
      setPostText(truncatedText);
      setRemainingChar(0);
      showToast(
        "Exceeds Limit",
        `Your texts can't exceed the limit: ${MAX_CHAR}`,
        "error"
      );
    } else {
      setPostText(inputText);
      setRemainingChar(MAX_CHAR - inputText.length);
    }
  };

  const handleCreatePost = async () => {
    setUpdating(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/posts/create`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            postedBy: user._id,
            text: postText,
            img: imgUrl,
          }),
        }
      );
      const data = await res.json();

      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", data.message, "success");
      setPostText("");
      setImgUrl(null);
      setRemainingChar(MAX_CHAR);
      if (username === user.username) {
        setPost([data.newPost, ...posts]);
      }
      onClose();
    } catch (error) {
    } finally {
      setUpdating(false);
    }
  };
  return (
    <>
      <Button
        position={"fixed"}
        bottom={10}
        right={10}
        leftIcon={<CgAdd />}
        backgroundColor={useColorModeValue("gray.300", "gray.dark")}
        onClick={onOpen}
      >
        Post
      </Button>
      <Modal isCentered={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <Textarea
                placeholder="Type here..."
                onChange={handleTextChange}
                value={postText}
              />
              <Text
                fontSize={"xs"}
                fontWeight={"bold"}
                textAlign={"right"}
                m="1"
                color={{
                  base:
                    remainingChar <= 0
                      ? "red.500"
                      : remainingChar <= 100
                      ? "yellow.500"
                      : "green.500",
                }}
              >
                {remainingChar}/{MAX_CHAR}
              </Text>
              <Input
                type="file"
                hidden
                ref={fileRef}
                onChange={handleImageChange}
              />
              <BsImageFill
                style={{ marginLeft: "5px", cursor: "pointer" }}
                size={16}
                onClick={() => fileRef.current.click()}
              />
            </FormControl>
            {imgUrl && (
              <Flex mt={"5"} w={"full"} position={"relative"}>
                <Image src={imgUrl} alt="Selected Img" />
                <CloseButton
                  onClick={() => setImgUrl(null)}
                  bg={"gray.800"}
                  position={"absolute"}
                  top={2}
                  right={2}
                />
              </Flex>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleCreatePost} isLoading={updating}>
              Post
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreatePost;
