import { atom } from "recoil";

export const conversationsAtom = atom({
  key: "conversationsAtom",
  default: [],
});

export const selectedConversationAtom = atom({
  key: "selectedConversation",
  default: {
    _id: "",
    userId: "",
    username: "",
    isGroup: false,
    userProfilePic: "",
    peerId: "",
  },
});

export const messagesAtom = atom({
  key: "messagesAtom",
  default: [],
});
