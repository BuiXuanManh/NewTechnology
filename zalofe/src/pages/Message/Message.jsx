import conversations from "../../data/conversations";
import ChatElement from "../../components/ChatElement";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import LoginService from "../../services/LoginService";

function Message() {
  const [phone, setPhone] = useState("");
  const [token, setToken] = useState("");
  useEffect(() => {
    if (Cookies.get("phone") && Cookies.get("token")) {
      console.log("token ", Cookies.get("token"));
      setPhone(Cookies.get("phone"));
      setToken(Cookies.get("token"));
    }
  }, [phone]);
  let service = new LoginService();
  const query = useQuery({
    queryKey: ['getUser'], queryFn:  () =>  service.getUser(token).then(res => {
      console.log(res.data);
      return res.data;
    }),
    onSuccess:()=>{
      query.refetch();
    },
    onSettled: () => {
      console.log("done");
      query.refetch();
    },
    cacheTime: 3600000,
  });
  console.log(query);


  return (
    <div className="h-[calc(100vh-95px)] w-full overflow-auto">
      {/* <div className="flex h-[74px] w-full items-center border border-black ">
        <img
          src="https://zpsocial-f51-org.zadn.vn/c20081221b9ef5c0ac8f.jpg"
          alt=""
          className="h-12 w-12 rounded-full"
        />
        <div className="flex grow justify-between pl-3" id="content">
          <div className="">
            <div className="grid gap-y-1">
              <div>
                <span className="text-base text-[#081C36]">Hà Anh Thảo</span>
              </div>
              <div className="text-sm text-[#7589A3]">
                <span>Bạn: </span>
                <span className="">oke ông kkk</span>
              </div>
            </div>
          </div>
          <div className="mt-[-4px] grid gap-y-1">
            <div>
              <span className="text-xs">7 Ngày</span>
            </div>
            <div className="flex h-4 w-4 flex-grow items-center justify-center place-self-end rounded-full bg-[#C81A1F] text-white">
              <span className="text-xs">3</span>
            </div>
          </div>
        </div>
      </div> */}
      {conversations.map((conversation) => (
        <ChatElement
          key={conversation.userID}
          id={conversation.userID}
          name={conversation.userName}
          {...conversation}
        />
      ))}
      <div className="h-[60px]">
        <p className="mt-5 text-center text-sm">
          Zalo chỉ hiển thị tin nhắn từ sau lần đăng nhập đầu tiên trên trình
          duyệt này.
        </p>
      </div>
    </div>
  );
}

export default Message;
