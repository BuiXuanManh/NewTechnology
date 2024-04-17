// import {  useState } from "react";

import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import MessageDetail from "./MessageDetail";
import MessageInput from "./MessageInput";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Skeleton } from '@mui/material';
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import LoginService from "../services/LoginService";
import useLoginData from "../hook/useLoginData";
import ChatService from "../services/ChatService";
import useTabs from "../hook/useTabs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import api from "../api/api";
import swal from 'sweetalert';
const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

// const Message = ({ sender, content, timestamp }) => (
//   <div
//     className={`flex ${sender === "me" ? "justify-end" : "justify-start"} mb-2`}
//   >
//     <div
//       className={`bg-${sender === "me" ? "blue" : "green"}-300 rounded-md p-2`}
//     >
//       <p className="text-white">{content}</p>
//       <span className="text-xs text-gray-500">{timestamp}</span>
//     </div>
//   </div>
// );
const Conversation = () => {
  const queryClient = useQueryClient();
  // const queryClient = useQueryClient();
  const handleSendMessage = (newMessage) => {
    // Xử lý logic gửi tin nhắn, có thể thêm tin nhắn mới vào danh sách messages
    // hoặc sử dụng một hàm callback để truyền tin nhắn lên component cha.
    console.log("Gửi tin nhắn:", newMessage);
  };
  const [id, setID] = useState("")
  const [token, setToken] = useState("");
  const [phone, setPhone] = useState("");
  const [profile, setProfile] = useState("");
  useLoginData({ token, setToken, setProfile, setPhone });
  const [chat, setChatSelectId] = useState();
  const [chats, setChats] = useState([])
  useTabs({ chat, setChatSelectId });
  let service = new ChatService();
  const querychat = useQuery({
    queryKey: ["chat", chat?.id],
    queryFn: async () => {
      return service.getMessages(token, chat?.id).then((res) => {
        if (res.data) {
          setChats(res.data);
          return res.data;
        }
      }).catch((err) => {
        console.log(err);
      });
    },
    // staleTime: 30000,
    // gcTime: 3000000,
    // retry: 3,
    enabled: chat?.id !== "" && chat?.id !== undefined && token !== "" && token !== undefined && chat?.id !== null && chat?.id !== "null"
  });
  useEffect(() => {
    const c = Cookies.get("chat");
    if (c && c !== undefined && c !== "undefined" && c !== "[object Object]") {
      const chat = JSON.parse(c);
      setChatSelectId(chat);
    }
    // const id = Cookies.get("chatId");
  }, [Cookies.get("chat")]);
  const [newUrl, setNewUrl] = useState("")
  // Khi chat thay đổi, làm mới truy vấn cuộc trò chuyện
  // useEffect(() => {
  //   queryClient.invalidateQueries(["chat", chat?.id]);
  // }, [chat]);
  useEffect(() => {
    const id = Cookies.get("chatId");
    if (id) {
      setID(id);
    }
  }, [id, Cookies.get("chatId")]);
  console.log(chat);
  const [bodyMsg, setBodyMsg] = useState({})
  const uploadToS3 = async (select, message) => {
    console.log("file", select)
    // const formData = new FormData(select);
    // const file = formData.get('file');
    if (!select) {
      return null;
    }

    await api.post("/api/v1/files", {
      filename: select.name,
      type: "MESSAGE"
    }, { headers: { Authorization: `Bearer ${token}` } })
      .then(async (res) => {
        console.log(res);
        // setData({...data, url: res.data});
        const resUpload = await api.put(res.data, select).catch(e => console.log(e));
        if (resUpload.status === 200) {
          // setData({ ...data, success: true, url: res.data })
          const newUrl = res.data.substring(0, res.data.indexOf('?'));
          console.log(newUrl)
          setNewUrl(newUrl);
          const body = {
            // sender: id,
            content: message,
            attachments: [
              {
                type: 'IMAGE',
                url: newUrl,
                filename: newUrl.split('/')[newUrl.split('/').length - 1]
              }
            ]
          }
          setBodyMsg(body);
          mutation.mutate(body)
          // service.chat(token, id, body).then((res) => {
          //   if (res.data) {
          //     console.log(res.data);
          //   }
          //   else {
          //     console.log(res)
          //   }
          // }).catch((err) => {
          //   console.log(err)
          // })
        } else {
          // setData({ ...data, success: false })
        }
      })
      .catch(err => {
        console.log(err);
        swal({
          title: "Eror",
          // text: "You have pressed the button!",
          icon: "error"
        });
      })
  }
  async function onSendMessage(message, file) {
    console.log("file", file)
    if (profile.id && id && !file && message)
      mutation.mutate({ content: message })
    else if (file) {
      await uploadToS3(file, message);
    }
  }
  const mutation = useMutation({
    mutationKey: ["saveChat"],
    mutationFn: async (mes) => {
      return await service.chat(token, id, mes).then((res) => {
        if (res.data) {
          console.log(res.data)
          chats.push(res.data)
          querychat.refetch();
          queryClient.invalidateQueries(["chat"])
          queryClient.invalidateQueries(["chats"])
          Cookies.set("chats", JSON.stringify(chats))
          return res.data;
        }
      }).catch((err) => {
        console.error(err)
      })
    }
  })
  useEffect(() => {
    const c = Cookies?.get("chats")
    console.log(Cookies?.get("chats"))
    if (Cookies.get("chat") === undefined && (chat?.length <= 0 || !chat) && Cookies.get("chatId")) {
      console.log("chat ", c.length)
      setTimeout(() => {
        window.location.reload();
      }, 2000); // Đặt thời gian đợi là 2000 miligiây (tức là 2 giây)
    }
  }, []);
  const [showSearch, setShowSearch] = useState(false);
  const handleShowSearch = () => {
    setShowSearch(!showSearch);
  }
  return (
    <div className="h-screen w-full">
      <div className="h-[68px] w-full px-4">
        <div className="flex h-full w-full flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-x-2">
            <div className="hidden lg:block">
              <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                variant="dot"
              >
                <Avatar sx={{ width: 40, height: 40 }} alt="" src={chat?.avatar} className='m-4' />
              </StyledBadge>
            </div>
            <div className="flex flex-col">
              <div className=" text-lg font-medium text-[#081c36]">
                <span>
                  {chat ? (
                    `${chat.name}`
                  ) : (
                    <Skeleton variant="text" width={150} /> // Display placeholder while loading
                  )}
                </span>
              </div>
              <div className="flex items-center text-sm text-[#7589a3]">
                <span>Vừa truy cập</span>
                <span className="text-[#D7DBE0]"> &nbsp;|&nbsp;</span>
                <span className="flex items-center justify-center">
                  <img
                    className="mt-[1px] h-[10px]"
                    src="/src/assets/tag.png"
                    alt=""
                  />
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-row items-center">
            <a href="" className="p-1">
              <img src="/src/assets/group-user-plus.png" alt="" />
            </a>
            <a onClick={() => handleShowSearch()} className="p-2 cursor-pointer">
              <img
                src="/src/assets/mini-search.png"
                alt=""
                className="m-1 h-4 w-4"
              />

            </a>
            {showSearch && <div className="bg-white absolute z-50 right-20 mt-40 w-64 py-2 border border-gray-200 shadow-2xl" style={{ display: "none;" }}>
              <div className="py-2 border-b w-full">
                <div className='flex w-full'>
                  {/* <div className="text-gray-700 text-xs px-6 uppercase mb-1">Sao chép</div> */}
                  <div className='text-gray-700 text-xs px-6 uppercase mb-1 w-full'>
                    <input type="text" className="w-full h-full bg-gray-200 focus:outline-none px-4 py-2 border-none rounded-full" placeholder="Tìm ..." />
                  </div>
                </div>
              </div>
            </div>}
            <a href="" className="p-2">
              <img src="/src/assets/video.png" alt="" className="m-1 h-5 w-5" />
            </a>
            <a href="" className="p-2">
              <img
                src="/src/assets/right-bar.png"
                alt=""
                className="m-1 h-4 w-4"
              />
            </a>
          </div>
        </div>
      </div>
      {/* -68 */}
      <div className="h-[calc(100vh-174px)] w-full flex-1 overflow-auto bg-[#A4BEEB] p-4 pr-3">
        {/* <Message sender="other" content="Xin chào!" timestamp="15:30" />
        <Message sender="me" content="Chào bạn!" timestamp="15:32" />
        Thêm tin nhắn khác ở đây */}
        {querychat?.data?.map((message) => (
          <MessageDetail key={message.id} message={message} chatId={id} />
        ))}
      </div>
      <div className=" bg-white">
      </div>
      <div className="h-16">
        {/* Thêm phần nhập tin nhắn ở đây */}
        <MessageInput onSendMessage={onSendMessage} />
      </div>
    </div>
  );
};

export default Conversation;
