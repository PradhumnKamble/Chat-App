import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import ScrollableFeed from "react-scrollable-feed";
import { Box } from "@chakra-ui/layout";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex",marginBottom:"4px"}} key={m._id}>
 

            

            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id) ) && (
              <div>
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic}
                />
              </Tooltip>
              </div>
            )}
         
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "white" : "#B9F5D0"
                }`,
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                borderRadius: "10px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
              <span>{m.content}</span>
         
              {/* {/* <div>{date(m.createdAt)}</div> */} 
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
