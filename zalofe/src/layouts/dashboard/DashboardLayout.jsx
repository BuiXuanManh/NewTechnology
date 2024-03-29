import React, { useState, useLayoutEffect } from "react";
import Sidebar from "./Sidebar/Sidebar";
import Navbar from "./Navbar/Navbar";
import { Outlet } from "react-router-dom";

import OtherMessage from "../../pages/Message/OtherMessage";
import Conversation from "../../components/Conversation";

function DashboardLayout({component}) {
  const [width, setWidth] = useState(window.innerWidth);

  useLayoutEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div className="flex h-screen w-full ">
        <Navbar />
        <div className="flex h-screen w-full grid-flow-col ">
          <div className="ml-16 w-full max-w-fit flex-1 md:w-[345px] border-r">
            <div className="flex-1 text-gray-500 ">
              <Outlet />
            </div>
          </div>
          <div className="hidden w-full overflow-hidden md:flex ">
            <div className="h-fit w-max flex-1">
              {/* <div className="text-gray-500">
                This is content Lorem ipsum dolor sit amet consectetur
                adipisicing elit. Nam consequuntur quae modi, quia adipisci hic
                iure dolor dicta, dolores repellendus molestias suscipit, ipsum
                totam. Culpa cupiditate dolor unde ipsam nobis!
              </div> */}
              {component}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
