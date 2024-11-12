import React from 'react';
import "../styles/footer.css";

const Footer = () => {
  return (
    <footer id="footer">
      <div className="footer-container">
        <div className="footer-row">
          <div className="footer-column">
            <h5 className="footer-title">Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="/" className="footer-link">Home</a></li>
              <li><a href="about_us" className="footer-link">About Us</a></li>
              <li><a href="contact_us" className="footer-link">Contact Us</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h5 className="footer-title">Features</h5>
            <ul className="list-unstyled">
              <li><a href="Room_Management" className="footer-link">Room Management</a></li>
              <li><a href="get_available_rooms" className="footer-link">Display Available Rooms</a></li>
              <li><a href="Booking_Management" className="footer-link">Booking Management</a></li>
              <li><a href="Booked_Rooms" className="footer-link">Display Booked Rooms</a></li>
              <li><a href="Staff_Management" className="footer-link">Staff Management</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h5 className="footer-title"><a  href= "Contact_us" >Contact Us</a></h5>
            <ul className="list-unstyled">
              <li><strong>Details:</strong><br />+91 9725370778<br /><a href="/" className="footer-link">ganpatajmera12@gmail.com</a></li>
              <li><strong>Support:</strong><br />24x7 live support<br /></li>
            </ul>
          </div>
          <div className="footer-column">
            <h5 className="footer-title">Social Networks</h5>
            <div className="social-networks">
              <a href="https://x.com/Ganpat8903" target='_blank' className="social-link"><i className="fa fa-twitter"></i></a>
              <a href="https://www.linkedin.com/in/ganpat-kumawat-b51571302/" target='_blank' className="social-link"><i className="fa fa-linkedin"></i></a>
              <a href="https://www.facebook.com/ganpat8903" target='_blank' className="social-link"><i className="fa fa-facebook"></i></a>
              <a href="https://www.instagram.com/ganpat_8_9_0_3/" target='_blank' className="social-link"><i className="fa fa-instagram"></i></a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2024. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
