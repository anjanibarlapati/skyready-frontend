import { useEffect, useState } from 'react';
import './ImageSlider.css';
import slide1 from '../../assets/slide1.jpg';
import slide2 from '../../assets/slide2.jpg';
import slide3 from '../../assets/slide3.jpg';
import slide4 from '../../assets/slide4.jpg';
import slide5 from '../../assets/slide5.jpg';

const images: string[] = [slide1, slide2, slide3, slide4, slide5];

export const ImageSlider = () => {


  const [index, setIndex] = useState<number>(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 2000);

    return () => clearInterval(intervalId);
  }, []);


  return (
    <div className="slider-container">
      <img src={images[index]} alt={`Slide ${index + 1}`} className="slider" />
      <div className="slider-text">
        <p>Let’s Fly</p>
        <h1>One Tap To Take Off</h1>
      </div>
    </div>
  );
};
