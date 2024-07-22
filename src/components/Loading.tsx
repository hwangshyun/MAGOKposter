import React from "react";
import styled from "styled-components";

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 100%;
`;

const LoadingText = styled.h2`
  font-size: 24px;
  font-weight: 100;
  color: #ffffff;
`;

const Loading: React.FC = () => {
  return (
    <LoadingContainer>
      <LoadingText>불러오는중...</LoadingText>
    </LoadingContainer>
  );
};

export default Loading;
