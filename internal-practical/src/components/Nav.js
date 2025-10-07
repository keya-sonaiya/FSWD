import React from "react";
import "./Nav.css";

function Nav() {
  return (
    <div className="nav nav__black">
      <div className="nav__left">
        <img
          className="nav__logo"
          src="https://upload.wikimedia.org/wikipedia/commons/7/7a/Logonetflix.png"
          alt="Netflix Logo"
        />

        <ul className="nav__links">
          <li>Home</li>
          <li>TV Shows</li>
          <li>Movies</li>
          <li>New & Popular</li>
          <li>My List</li>
        </ul>
      </div>

      <div className="nav__right">
        <img
          className="nav__avatar"
          src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png"
          alt="Avatar"
        />
      </div>
    </div>
  );
}

export default Nav;
