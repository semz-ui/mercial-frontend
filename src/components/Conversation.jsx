import UserConversation from "./UserConversation";
import GroupConversation from "./GroupConversation";

const Conversation = ({ conversation, isOnline }) => {
  return (
    <>
      {!conversation.isGroup && (
        <UserConversation conversation={conversation} isOnline={isOnline} />
      )}
      {conversation.isGroup && (
        <GroupConversation conversation={conversation} isOnline={isOnline} />
      )}
    </>
  );
};

export default Conversation;
