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
import React, { useEffect, useRef, useState } from "react";
import { BsFillImageFill, BsSend } from "react-icons/bs";
import usePreviewImage from "../hooks/usePreviewImage";
import useShowToast from "../hooks/useShowToast";
import {
  conversationsAtom,
  selectedConversationAtom,
} from "../atom/messagesAtom";
import { useRecoilState, useRecoilValue } from "recoil";
import useLoading from "../hooks/useLoading";
import userAtom from "../atom/userAtom";
import { FiMic, FiMicOff } from "react-icons/fi";
import usePreviewAudio from "../hooks/usePreviewAudio";

const MessageInput = ({ setMessages }) => {
  const token = JSON.parse(localStorage.getItem("token"));
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImage();
  const { audio, handleAudioChange, setAudio } = usePreviewAudio();
  const { loading, startLoader, stopLoader } = useLoading();
  const { onClose } = useDisclosure();
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const user = useRecoilValue(userAtom);
  const [conversation, setConversation] = useRecoilState(conversationsAtom);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorder = useRef(null);
  const imageRef = useRef(null);
  const [isSending, setIsSending] = useState(false);
  const [messageText, setMessageText] = useState("");
  const showToast = useShowToast();
  console.log(audioBlob);
  const handleSendMessage = async (e) => {
    startLoader();
    e.preventDefault();
    // if (!messageText && !imgUrl && !audioBlob) return;
    // if (loading) return;
    const isGroup = selectedConversation.isGroup;
    console.log("clicked");
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/message`,
        isGroup
          ? {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                message: messageText,
                recipientId: selectedConversation.userId,
                conversationId: selectedConversation._id,
                img: imgUrl,
                senderData: {
                  username: user.username,
                  profilePic: user.profilePic,
                },
              }),
            }
          : {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                message: messageText,
                recipientId: selectedConversation.userId,
                conversationId: selectedConversation._id,
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

  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      mediaRecorder.current = new MediaRecorder(stream);
      mediaRecorder.current.start();

      setIsRecording(true);
    });
  };

  if (mediaRecorder.current) {
    mediaRecorder.current.ondataavailable = (e) => {
      setAudioBlob(e.data);
    };
    mediaRecorder.current.onstop = () => {
      mediaRecorder.current.ondataavailable = (event) => {
        const audioChunks = [];
        audioChunks.push(event.data);
        const audioBlab = new Blob(audioChunks, { type: "audio/mpeg-3" });
        console.log(audioBlab, "blalboo");
        setAudioBlob(audioBlab);
        setAudio(URL.createObjectURL(audioBlab));
      };
    };
  }

  const stopRecording = () => {
    mediaRecorder.current.stop();
    setIsRecording(false);
  };
  return (
    <Flex gap={2} alignItems={"center"}>
      <form onSubmit={handleSendMessage} style={{ flex: 95 }}>
        <InputGroup>
          {audioBlob ? (
            // <audio
            //   controls
            //   className="audio"
            //   src={URL.createObjectURL(audioBlob)}
            // />
            <Audio song={URL.createObjectURL(audioBlob)} />
          ) : (
            <Input
              w={"full"}
              placeholder="Type a message"
              onChange={(e) => setMessageText(e.target.value)}
              value={messageText}
            />
          )}
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
      <div>
        {isRecording ? (
          <FiMicOff cursor={"pointer"} onClick={stopRecording} />
        ) : (
          <FiMic cursor={"pointer"} onClick={startRecording} />
        )}
      </div>
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
