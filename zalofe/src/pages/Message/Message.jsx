import React, { useState, useEffect } from "react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import useLoginData from "../../hook/useLoginData"; // Giả sử đây là đường dẫn đúng
import ChatElement from "../../components/ChatElement"; // Giả sử đây là đường dẫn đúng
import useTabs from "../../hook/useTabs";
import ChatService from "../../services/ChatService";
import Cookies from "js-cookie";
const Message = () => {
  const [phone, setPhone] = useState("");
  const [token, setToken] = useState("");
  const [profile, setProfile] = useState({});
  useLoginData({ token, setToken, setProfile, setPhone });
  const [noSenderChats, setNoSenderChats] = useState([]);
  const [chats, setChats] = useState([]);
  const [chat, setChatSelectId] = useState({});

  const service = new ChatService();

  const qr = useQuery({
    queryKey: ["chats"],
    queryFn: async () => {
      try {
        // console.log(token)
        const res = await service.getChats(token);
        if (res.data) {
          setChats(res.data);
          Cookies.set("chats", JSON.stringify(res.data));
          // setNoSenderChats(res.data.filter(chat => !chat?.lastMessage?.sender));
          return res.data;
        }
      } catch (err) {
        console.log(err);
      }
    },
    enabled: (token !== "" && token !== undefined),
  });
  // console.log(qr)
  const { selectedId, handleOnClick } = useTabs({ setChatSelectId });
  const queryClient = useQueryClient();

  return (
    <>
      <div className="h-[calc(100vh-95px)] min-w-80 overflow-auto">
        {!qr?.isLoading && !qr?.data ? (
          <div>Không có tin nhắn nào</div>
        ) : (
          <div className="mt-2">
            {qr?.data?.map(chat => (
              <ChatElement
                key={chat.id}
                id={chat.id}
                name={chat.name}
                lastMessage={chat.lastMessage}
                avatar={chat.avatar}
                isLoading={qr.isLoading}
                selectedId={selectedId}
                handleOnClick={handleOnClick}
                pId={profile?.id}
                setChatSelectId={setChatSelectId}
              />
            ))}
          </div>
        )}
        <div className="h-[60px]">
          <p className="mt-5 text-center text-sm mx-2">
            Viet chat chỉ hiển thị tin nhắn từ sau lần đăng nhập đầu tiên trên trình
            duyệt này.
          </p>
        </div>
      </div>
    </>
  );
};

export default Message;
