import {
  Flex,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { BsFillImageFill, BsSend } from "react-icons/bs";
import usePreviewImage from "../hooks/usePreviewImage";
import useShowToast from "../hooks/useShowToast";
import {
  conversationsAtom,
  selectedConversationAtom,
} from "../atom/messagesAtom";
import { useRecoilState, useRecoilValue } from "recoil";
import useLoading from "../hooks/useLoading";

const MessageInput = ({ setMessages }) => {
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImage();
  const { loading, startLoader, stopLoader } = useLoading();
  const { onClose } = useDisclosure();
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const [conversation, setConversation] = useRecoilState(conversationsAtom);
  const imageRef = useRef(null);
  const [isSending, setIsSending] = useState(false);
  const [messageText, setMessageText] = useState("");
  const showToast = useShowToast();
  const handleSendMessage = async (e) => {
    startLoader();
    e.preventDefault();
    if (!messageText && !imgUrl) return;
    if (loading) return;
    try {
      const res = await fetch(
        "https://mercial-backend.onrender.com/api/message",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: messageText,
            recipientId: selectedConversation.userId,
            img: imgUrl,
          }),
        }
      );
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      setMessages((messages) => [...messages, data]);
      setConversation((prevCon) => {
        const updatedConversation = prevCon.map((con) => {
          if (con._id === selectedConversation._id) {
            return {
              ...con,
              lastMessage: {
                text: messageText,
                sender: data.sender,
              },
            };
          }
          return con;
        });
        return updatedConversation;
      });
      setMessageText("");
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      stopLoader();
    }
  };
  return (
    <Flex gap={2} alignItems={"center"}>
      <form onSubmit={handleSendMessage} style={{ flex: 95 }}>
        <InputGroup>
          <Input
            w={"full"}
            placeholder="Type a message"
            onChange={(e) => setMessageText(e.target.value)}
            value={messageText}
          />
          <InputRightElement onClick={handleSendMessage} cursor={"pointer"}>
            <BsSend />
          </InputRightElement>
        </InputGroup>
      </form>
      <Flex flex={5} cursor={"pointer"}>
        <BsFillImageFill size={20} onClick={() => imageRef.current.click()} />
        <Input
          type={"file"}
          hidden
          ref={imageRef}
          onChange={handleImageChange}
        />
      </Flex>
      <Modal
        isOpen={imgUrl}
        onClose={() => {
          onClose();
          setImgUrl(null);
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader></ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex mt={5} w={"full"}>
              <Image
                // src={"https://bit.ly/broken-link"}
                src={imgUrl}
              />
            </Flex>
            <Flex justifyContent={"flex-end"} my={2}>
              {!loading ? (
                <BsSend
                  size={24}
                  cursor={"pointer"}
                  onClick={handleSendMessage}
                />
              ) : (
                <Spinner size={"md"} />
              )}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default MessageInput;
