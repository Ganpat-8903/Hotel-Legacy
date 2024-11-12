import React from 'react';
import { Carousel } from 'react-bootstrap'; // Import Carousel from react-bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import "../styles/carousel.css"

const BootstrapCarousel = ({ images, captions }) => {
  return (
    <Carousel controls={true} indicators={false} interval={2000}> 
      {images.map((image, index) => (
        <Carousel.Item key={index}>
          <img
            src={image}
            alt={`Slide ${index}`}
            className="d-block w-100 carousel-image"
          />
          <Carousel.Caption>
            <h3 className="carousel-heading">{captions[index].title}</h3>
            <p className="carousel-text">{captions[index].text}</p>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default BootstrapCarousel;
