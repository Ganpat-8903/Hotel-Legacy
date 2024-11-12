import React, { useState } from 'react';
import '../styles/contact_us.css';

const Contact_us = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = async(e) => {
    e.preventDefault();
    alert("Email sent successfully");
  //  const res=await fetch('http://localhost:8000/contact_us/', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(formData),
  //   })
  //   .then((response) => response.text())
  //   .then((data) => {
  //     alert("Email sent successfully");
  //   })
  //   .catch((error) => {
  //     alert("Error sending email");
  //   });
  //   const data = await res.json();
    e.target.reset();
  };
  
  return (
    <div className="container_contact my-5 pb-5">
      <h2 className="text-center mb-4">Contact Us</h2>
      <p className="text-center mb-4">
        We are here to assist you 24/7. Reach out to us with any inquiries or concerns, and we'll be happy to help.
      </p>
      
      <div className="row justify-content-center">
        <div className="col-md-6">
          <form onSubmit={handleSubmit}>
            <div className='contact-us'>
            <div className="form-group mb-3">
              <label htmlFor="name">Your Name</label>
              <input type="text" className="form-control" id="name" name="name" placeholder="Enter your name" onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="email">Your Email</label>
              <input type="email" className="form-control" id="email" name="email" placeholder="Enter your email" onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="subject">Subject</label>
              <input type="text" className="form-control" id="subject" name="subject" placeholder="Enter subject" onChange={(e) => setFormData({ ...formData, subject: e.target.value })} required />
            </div>

            <div className="form-group mb-4">
              <label htmlFor="message">Message</label>
              <textarea className="form-control" id="message" name="message" rows="4" placeholder="Enter your message" onChange={(e) => setFormData({ ...formData, message: e.target.value })} required></textarea>
            </div>
            </div>
            <button type="submit" className="btn btn-primary w-100">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact_us;
