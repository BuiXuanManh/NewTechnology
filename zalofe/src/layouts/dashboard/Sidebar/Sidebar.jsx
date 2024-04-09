import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { Link, NavLink, Outlet } from "react-router-dom";

function Sidebar({ onItemSelected }) {

  return (
    // <MessageFilterBar onItemSelected={onItemSelected} />
    <Outlet />
    
  );
}

export default Sidebar;
