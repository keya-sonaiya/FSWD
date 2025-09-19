import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaInfoCircle, FaPhone, FaSearch } from "react-icons/fa";
import "./Sidebar.css";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();

  const navItems = [
    { label: "Home", icon: <FaHome />, path: "/" },
    { label: "About", icon: <FaInfoCircle />, path: "/about" },
    { label: "Contact Us", icon: <FaPhone />, path: "/contact" },
  ];

  const filteredItems = navItems.filter((item) =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`sidebar ${isOpen ? "" : "collapsed"}`}>
      <div className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </div>

      <div className="search-container" title={isOpen ? "" : "Search"}>
        <div className="search-bar">
          <FaSearch className="search-icon" />
          {isOpen && (
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          )}
        </div>
      </div>

      <ul>
        {filteredItems.map((item) => (
          <li
            key={item.path}
            className={location.pathname === item.path ? "active" : ""}
          >
            <Link to={item.path}>
              <span className="icon">{item.icon}</span>
              {isOpen && <span className="label">{item.label}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
