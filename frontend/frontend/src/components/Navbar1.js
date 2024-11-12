import React, { useEffect, useState } from 'react';
import "../styles/navbar1.css"
import { useLocation } from 'react-router-dom';
import logo from "../assets/hotel_logo.png"
function deleteCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; secure; SameSite=Lax`;
}

const Navbar1 = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  const location = useLocation()

  useEffect(() => {

    const getCookie = (name) => {
      const cookieName = `${name}=`;
      const decodedCookie = decodeURIComponent(document.cookie);
      const cookies = decodedCookie.split(';');

      for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        while (cookie.charAt(0) === ' ') {
          cookie = cookie.substring(1);
        }
        if (cookie.indexOf(cookieName) === 0) {
          return cookie.substring(cookieName.length, cookie.length);
        }
      }
      return null;
    };

    const fetchData = async () => {
      const userId = getCookie('userId');
      if (userId) {
        setLoggedIn(true);
      }
    };

    fetchData();
  }, [location]);

  return (
    <nav className="navbar">
      <div className='logo'><img  src={logo} alt="Logo" /></div>
      <ul className="nav-links">
        <li><a href="/">Home</a></li>
        <li><a href="/contact_us">Contact Us</a></li>
        <li><a href="/about_us">About Us</a></li>
        {!loggedIn && <li><a href="/sign_in">Sign In</a></li>}
        {!loggedIn && <li><a href="/sign_up">Sign Up</a></li>}
        {loggedIn && <li><a href="/dashboard">Dashboard</a></li>}
        {loggedIn && <li><a className='signout' href="/" onClick={() => { deleteCookie("userId"); setLoggedIn(false); }}>Sign Out</a></li>}
      </ul>
    </nav>
  );
};

export default Navbar1;
