import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import '../styles/about_us.css'; // Assuming you have a custom CSS file for the About Us page

const About_us = () => {
    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="about-us col-md-8 text-center">
                    <h1 className="mb-4">About Us</h1>
                    <p>
                        Welcome to My Hotel Management System, where comfort and luxury meet! We pride ourselves on offering the best in class 
                        services for our guests, ensuring a memorable stay every time.
                    </p>
                    <p>
                        Our hotel management system is designed with you in mind, providing a seamless booking experience, 
                        effortless room management, and top-notch customer service. You can add room,add booking,add staff and more.
                    </p>
                    <h2 className="mt-5">Our Mission</h2>
                    <p>
                        To provide exceptional hospitality and offer our guests a home away from home with the highest level of comfort and convenience.
                    </p>
                    <h2 className="mt-5">Why Choose Us?</h2>
                    <ul className="list-unstyled">
                        <li>✔️ Spacious and comfortable rooms</li>
                        <li>✔️ State-of-the-art room management system</li>
                        <li>✔️ 24/7 customer service and support</li>
                        <li>✔️ Easy and secure booking</li>
                    </ul>
                    <p>
                        We invite you to experience the ultimate in luxury and comfort at our Hotel. Our commitment to excellence ensures that every guest leaves with lasting memories.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default About_us;
