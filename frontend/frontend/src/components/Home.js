import React from 'react';
import BootstrapCarousel from './Carousel'; 
import image1 from "../assets/hotel1.png";
import image2 from "../assets/hotel2.png";
import image3 from "../assets/hotel3.png";

const Home = () => {
  const images = [image1, image2, image3];
  const captions = [
    {
      title: "Monitor Hotel Operations",
      text: "Get real-time insights into room availability, bookings, and staff performance with our comprehensive dashboard."
    },
    {
      title: "Manage Bookings Efficiently",
      text: "Easily handle guest reservations, cancellations, and modifications with our intuitive booking management system."
    },
    {
      title: "Optimize Resource Allocation",
      text: "Track inventory, manage supplies, and ensure optimal resource usage to maximize profitability and efficiency."
    }
  ];

  return (
    <div className="home-container">
      <BootstrapCarousel images={images} captions={captions} />
    </div>
  );
};

export default Home;
