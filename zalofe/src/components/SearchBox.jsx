import React, { Fragment, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { NavLink, Outlet } from "react-router-dom";
import AddFriendDialog from "./models/AddFriend";


function SearchBox() {
  const [searchTerm, setSearchTerm] = useState("");
  //   const [item, setItem] = useState("UuTien");

  //   const handleItemSelected = (value) => {
  //     onItemSelected(value);
  //   };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="h-[68px] w-full flex-1 flex-col">
      <div className="w-full flex-1 flex-col border-b px-4">
        <div className="mb-1 flex items-center py-4">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            size="sm"
            className="absolute pl-3"
            style={{ color: "RGB(71, 85, 100)" }}
          />
          <input
            type="text"
            placeholder="Tìm kiếm"
            value={searchTerm}
            onChange={handleSearchChange}
            className="h-8 w-full rounded-md border bg-[#EAEDF0] p-2 pl-[30px] text-sm focus:outline-none"
          />
          <AddFriendDialog />
          <Fragment>
            <button className="w-11 z-50 cursor-pointer hover:bg-gray-200 mr-1 justify-center items-center">
              <img
                src="/src/assets/group-user-plus.png"
                alt=""
                className="cursor-pointer items-center justify-center"
                style={{ width: "100%", height: "100%" }}
              />
            </button>
          </Fragment>
        </div>
      </div>
      <div className="flex-1 pl-4 ">
        <Outlet />
      </div>
    </div>
  );
}

export default SearchBox;
