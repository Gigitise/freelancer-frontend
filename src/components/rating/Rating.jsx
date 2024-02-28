import React from "react";
import { IoStar } from "react-icons/io5";
import { IoStarHalf } from "react-icons/io5";

const Rating = ({ stars }) => {
  const fullStars = Math.floor(stars);
  const hasHalfStar = stars % 1 !== 0;
  const renderFullStars = () => {
    const fullStarsArray = [];
    for (let i = 0; i < fullStars; i++) {
      fullStarsArray.push(<IoStar key={i} size={20} color="orange" />);
    }
    return fullStarsArray;
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      {/* <small>{stars}</small> */}
      {renderFullStars()}
      {hasHalfStar && <IoStarHalf size={20} color="orange" />}
    </div>
  );
};

export default Rating;
