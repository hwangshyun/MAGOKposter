import React, { useState } from "react";
import {  useNavigate } from "react-router-dom";
import styled from "styled-components";

const All = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 70vh;
`;

const Pages = styled.div`
  position: relative;
  margin: 20px;
  border: 1px solid #ffffffd2;
  border-radius: 10px;
  padding: 30px;
  background-color: #ffffff2b;
  color: white;
  width: 20%;
  height: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 1.5em;
  font-weight: lighter;
  text-align: center;
  transition: 0.8s;
  &:hover {
    transform: scale(1.5);
    background-color: #ffffff4b;
    border: 1px solid #ffffff;
    font-size: 1.75em;
  }
`;

interface HoverImageProps {
  isHovered: boolean;
}

const HoverImage = styled.img<HoverImageProps>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  object-fit: cover;
  opacity: ${({ isHovered }) => (isHovered ? 1 : 0)};
  transition: opacity 1s;
  pointer-events: none; /* 이미지가 클릭되지 않도록 설정 */
`;

const Notice: React.FC = () => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const goBack = () => {
    navigate("/");
  };

  return (
    <All>
      <Pages
        onClick={goBack}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {isHovered ? "윤은경대머리깎아라" : "만드는중..."}
        <HoverImage
          src="/file.png" // public 폴더 내의 이미지 경로
          alt="Hover Image"
          isHovered={isHovered}
        />
      </Pages>
    </All>
  );
};

export default Notice;
