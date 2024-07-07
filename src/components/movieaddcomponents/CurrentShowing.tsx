import React, { useState } from "react";
import styled from "styled-components";
import { SavedMovie } from "../pages/MovieAdd";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 20px;
`;

const Arrow = styled.div`
  cursor: pointer;
  font-size: 2em;
  user-select: none;
  padding: 10px;
  &:hover {
    color: #a5a5a5a7;
  }
`;

const MovieContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  border: 1px solid #ffffff95;
  border-radius: 4px;
  background-color: #00000073;
  color: white;
  width: 200px;
  height: 100px;
`;

const MovieTitle = styled.div`
  font-size: 1.2em;
  font-weight: bold;
`;

const CurrentShowing: React.FC<{ movies: SavedMovie[] }> = ({ movies }) => {
  const [index, setIndex] = useState(0);

  const nextMovie = () => {
    setIndex((prevIndex) => (prevIndex + 1) % movies.length);
  };

  const prevMovie = () => {
    setIndex((prevIndex) => (prevIndex - 1 + movies.length) % movies.length);
  };

  if (movies.length === 0) {
    return <MovieContainer>현재 상영중인 영화가 없습니다.</MovieContainer>;
  }

  return (
    <Container>
      <Arrow onClick={prevMovie}>&lt;</Arrow>
      <MovieContainer>
        <MovieTitle>{movies[index].title}</MovieTitle>
      </MovieContainer>
      <Arrow onClick={nextMovie}>&gt;</Arrow>
    </Container>
  );
};

export default CurrentShowing;
