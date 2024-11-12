import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import SignIn from './components/Sign_in';
import SignUp from './components/Sign_up';
import RoomManagement from './components/Room_Management';
import Dashboard from './components/Dashboard';
import BookingManagement from "./components/Booking_Management"
import AboutUs from './components/About_us'
import Available_Rooms from './components/Available_Rooms';
import GenerateBill from './components/Generate_Bill';
import StaffManagement from './components/Staff_Management';
import Navbar from './components/Navbar1';
import Footer from './components/Footer';
import Booked_Rooms from './components/Booked_Rooms';
import ContactUs from './components/Contact_us';
const App = () => {
    return (
        <Router>
            <Navbar/>
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/sign_in" element={<SignIn />} />
                <Route path="/sign_up" element={<SignUp />} />
                <Route path="/dashboard" element={<Dashboard />} /> 
                <Route path="/room_management" element={<RoomManagement />} />
                <Route path="/booking_management" element={<BookingManagement />} />
                <Route path="/get_available_rooms" element={<Available_Rooms />} />
                <Route path="/booked_rooms" element={<Booked_Rooms />} />
                <Route path="/about_us" element={<AboutUs />} /> 
                <Route path="/about_us" element={<AboutUs />} /> 
                <Route path="/contact_us" element={<ContactUs />} />
                <Route path="/generate_bill/:bookingId" element={<GenerateBill />} />
                <Route path="/staff_management" element={<StaffManagement />} />
            </Routes>
            <Footer/>
        </Router>
    );
};

export default App;
