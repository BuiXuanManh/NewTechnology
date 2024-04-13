import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import Stack from "@mui/material/Stack";
import React, { useEffect, useState } from 'react'
import MessageDetail from './MessageDetail';
import { faAddressBook } from '@fortawesome/free-regular-svg-icons';
import { grey } from '@mui/material/colors';
import { Avatar, Skeleton } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import UserService from '../services/UserService';
import Cookies from 'js-cookie';






export default function FriendList() {

  const data = [
    {
      title: 'Section 1', data: [
        { name: 'Item1', avt: 'https://www.vlance.vn/uploads/160x160/3435fd58f6937ad78ebd009ad162cd59080e3db51.jpg' },
        { name: 'Item2', avt: 'https://www.vlance.vn/uploads/160x160/3435fd58f6937ad78ebd009ad162cd59080e3db51.jpg' },
        { name: 'Item3', avt: 'https://www.vlance.vn/uploads/160x160/3435fd58f6937ad78ebd009ad162cd59080e3db51.jpg' }]
    },
    // {
    //   title: 'Section 2', data: [
    //     { name: 'Item1', avt: 'https://www.vlance.vn/uploads/160x160/3435fd58f6937ad78ebd009ad162cd59080e3db51.jpg' },
    //     { name: 'Item2', avt: 'https://www.vlance.vn/uploads/160x160/3435fd58f6937ad78ebd009ad162cd59080e3db51.jpg' },
    //     { name: 'Item3', avt: 'https://www.vlance.vn/uploads/160x160/3435fd58f6937ad78ebd009ad162cd59080e3db51.jpg' }]
    // },
    // Thêm các phần tử section và data khác nếu cần
  ];
  let service = new UserService();
  const [token, setToken] = useState(Cookies.get("token"));
  useEffect(() => {
    const tokenFromCookie = Cookies.get("token");
    console.log(token)
    if (tokenFromCookie && tokenFromCookie !== token) {
      setToken(tokenFromCookie);
    }
  }, [token]);
  const list = useQuery({
    queryKey: ["friends"],
    queryFn: () => service.getFriends(token, "friend").then(res => {
      if (token) {
        console.log(token);
        console.log("data", res.data);
        if (res?.data)
          return res.data;
      }
    }),
    onSuccess: (data) => {
      console.log("data", data);
      // list.refetch();
    },
    onSettled: (data) => {
      console.log("done", data);
      // list.refetch();
    },
    onError: (err) => {
      console.error("err", err);
    }
    // cacheTime: 3600000,
  });
  console.log(list);


  const RenderItem = () => (
    (list?.isLoading) ? (<Skeleton>{
      list?.data?.map((item, index) => (
        <div key={index} className='py-4'>
          {/* <div>{item.title}</div> */}
          <div>
            <div className='p-4 flex flex-row items-center'>
              {(item?.user?.thubnaiAvatar && list.isLoading) ? < Skeleton variant="circular" width={40} height={40} />
                : (<Avatar alt="" src={item?.profile?.thumbnailAvatar ?
                  item?.profile?.thumbnailAvatar : "avatar.jpg"} className='m-4' />)
              }
              {item?.displayName ? (<div className='w-full p-4 py-5 border-b'>{item?.displayName}</div>) : (<Skeleton variant="rectangular" width={210} height={60} />
              )}
            </div>
          </div>
        </div>

      ))}
    </Skeleton>) :
      (
        <div> {list?.data?.length > 0 ?
          (
            <div>
              {list?.data?.map((item, index) => (
                <div key={index} className='py-4'>
                  {/* <div>{item.title}</div> */}
                  <div>
                    <div className='p-4 flex flex-row items-center'>
                      {(item?.user?.thubnaiAvatar && list.isLoading) ? < Skeleton variant="circular" width={40} height={40} />
                        : (<Avatar alt="" src={item?.profile?.thumbnailAvatar} className='m-4' />
                        )
                      }
                      {item?.displayName ? (<div className='w-full p-4 py-5 border-b'>{item?.displayName}</div>) : (<Skeleton variant="rectangular" width={210} height={60} />
                      )}
                    </div>
                  </div>
                </div>
              )
              )

              }
            </div>
          )
          : <div>
            Bạn ko bạn bè nào
          </div>
        }
        </div>
      ))


  return (
    <div className="h-screen w-full">
      <div className="h-[69px] w-full">
        <div className="flex h-full w-full flex-row items-center justify-between border-b">
          <div className="flex flex-row items-center gap-x-2 px-4">
            <FontAwesomeIcon icon={faAddressBook} className="pl-1 pr-3" />
            <div className="flex flex-col">
              <div className="text-lg font-medium text-[#081c36]">
                <span>Danh sách bạn bè</span>
              </div>

            </div>
          </div>
        </div>

        <div className='bg-neutral-100 p-4 pr-2 h-[700px] w-full overflow-auto' >
          <div className='font-medium pb-4'>Bạn bè</div>

          <div className='bg-white rounded-l p-4 '>
            <RenderItem />
          </div>

        </div>
      </div>
    </div>
  );
}
