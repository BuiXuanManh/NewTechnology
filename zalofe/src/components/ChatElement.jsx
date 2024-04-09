import { formatDistanceToNow } from "date-fns";
import { differenceInMinutes, differenceInHours, differenceInDays, differenceInMonths, differenceInYears } from 'date-fns';
import { Avatar, Skeleton } from "@mui/material";
function ChatElement({
  avatar,
  name,
  lastMessage,
}) {
  const messageContent = lastMessage?.content;
  let sender = lastMessage?.sender ? lastMessage?.sender?.lastName + ": " : "Bạn: ";
  //Tính số lượng tin nhắn chưa đọc
  // function countUnreadMessages(data) {
  //   let unreadCount = 0;

  //   data.forEach((chat) => {
  //     chat.chatActivity.forEach((message) => {
  //       if (message.userID !== "1" && message.status.read.length === 0) {
  //         unreadCount++;
  //       }
  //     });
  //   });

  //   return unreadCount;
  // }
  // Sử dụng hàm với dữ liệu của bạn
  // const unreadCount = countUnreadMessages(topChatActivity);
  // console.log("Số tin nhắn chưa đọc:", unreadCount);
  // const statusRead = topChatActivity[a].chatActivity[b].status.read.length;
  // console.log(">>>>>>>>>>>>>>", statusRead);

  function formatTimeDifference(timestamp) {
    const currentDate = new Date();
    const parsedTimestamp = new Date(timestamp);

    const minutesDifference = differenceInMinutes(currentDate, parsedTimestamp);

    if (minutesDifference < 1) {
      return `${Math.floor(minutesDifference * 60)} giây`;
    }

    const hoursDifference = differenceInHours(currentDate, parsedTimestamp);

    if (hoursDifference < 1) {
      return `${Math.floor(minutesDifference)} phút`;
    }

    const daysDifference = differenceInDays(currentDate, parsedTimestamp);

    if (daysDifference < 1) {
      return `${Math.floor(hoursDifference)} giờ`;
    }

    const monthsDifference = differenceInMonths(currentDate, parsedTimestamp);

    if (monthsDifference < 1) {
      return `${Math.floor(daysDifference)} ngày`;
    }

    const yearsDifference = differenceInYears(currentDate, parsedTimestamp);
    if (yearsDifference < 1)
      return `${Math.floor(monthsDifference)} tháng`;
    return `${Math.floor(yearsDifference)} năm`;
  }

  const timestamp = lastMessage?.createdAt;
  const originalDate = new Date(timestamp);
  // Trừ 7 giờ
  const adjustedDate = new Date(originalDate.getTime());

  // console.log(timeDifference);
  //   const timestamp = "2024-01-17T02:43:00Z";
  // console.log(timeDifference);
  const currentDate = new Date();
  // const t = currentDate.getTime() - timestamp;
  // if (t < 7 * 60 * 60 * 1000) {
  //   console.log("Ít hơn 7 giờ trước");
  // } else {
  //   const adjustedDate = new Date(timestamp);
  //   console.log(formatTimeDifference(adjustedDate));
  // }
  const timeDifference = formatTimeDifference(adjustedDate);
  return (
    <div
      className={`flex h-[74px] w-full items-center pr-2`}
    >
      <Avatar
        src={avatar}
        alt="avatar"
        sx={{ width: 48, height: 48 }}
      // className="aspect-w-1 aspect-h-1 h-12 w-12 rounded-full object-cover"
      />
      <div className="flex grow justify-between pl-3 md:w-[342px]" id="content">
        <div className="">
          {/* {unreadCount != 0 ? (
            <>
              <div className="grid gap-y-1">
                <div>
                  <span className="text-base font-semibold text-[#081C36]">
                    {userName}
                  </span>
                </div>
                <div className="transition-min-width flex min-w-[calc(100vw-200px)] items-center text-sm font-medium text-[#081C36] duration-200  md:min-w-full">
                  <span className="overflow-hidden truncate overflow-ellipsis whitespace-nowrap md:w-[175px]">
                    {messageContent}
                  </span>
                </div>
              </div>
            </>
          ) : */}

          <>
            <div className="grid gap-y-1">
              <div>
                <span className="text-base font-semibold text-[#081C36]">
                  {name}
                </span>
              </div>
              <div className="transition-min-width flex min-w-[calc(100vw-200px)] items-center text-sm font-medium text-[#7589A3] duration-200 md:w-[175px] md:min-w-full">
                <span>{sender}</span>
                <span className="truncate md:w-[175px] ml-1">
                  {messageContent}
                </span>
              </div>
            </div>
          </>

          {/* } */}
        </div>
        <div className="mt-[-4px] grid gap-y-1 ">
          <div>
            <span className="truncate text-xs">{timeDifference}</span>
          </div>
          {/* {unreadCount != 0 ? (
            <>
              <div className="flex h-4 w-4 flex-grow items-center justify-center place-self-end rounded-full bg-[#C81A1F] text-white">
                <span className="text-xs">{unreadCount}</span>
              </div>
            </>
          ) : (
            <></>
          )} */}
        </div>
      </div>
    </div>
  );
}

export default ChatElement;


{/* <div className="grid gap-y-1">
  <div>
    <span className="text-base text-[#081C36]">{userName}</span>
  </div>
  <div className="transition-min-width flex min-w-[calc(100vw-200px)] items-center text-sm text-[#7589A3] duration-200">
    <span>Bạn:&nbsp;</span>
    <span className="overflow-hidden truncate overflow-ellipsis whitespace-nowrap md:w-[175px]">
      {messageContent}
    </span>
  </div>
</div>; */}
