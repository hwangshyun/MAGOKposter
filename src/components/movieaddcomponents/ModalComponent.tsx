import React from "react";
import styled from "styled-components";


interface Movie {
  movieCd: string;
  movieNm: string;
}

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 500px;
  max-height: 80%;
  overflow-y: auto;
`;

const ModalList = styled.ul`
  max-height: 300px;
  overflow-y: auto;
  overflow-x: hidden;
`;

const StyledLi = styled.li`
padding: 3px;
  cursor: pointer;
  transition: 0.1s;
  &:hover{
    transform: scale(1.02);
    font-weight: bold;
  }
`

const ModalComponent: React.FC<{
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  movies: Movie[];
  fetchMovieInfo: (movieCd: string) => void;
}> = ({ isModalOpen, setIsModalOpen, movies, fetchMovieInfo }) => (
  <>
    {isModalOpen && (
      <ModalBackground onClick={() => setIsModalOpen(false)}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <h2>검색 결과</h2>
          <ModalList>
            {movies.map((movie) => (
              <StyledLi
                key={movie.movieCd}
                onClick={() => fetchMovieInfo(movie.movieCd)}
              >
                {movie.movieNm}
              </StyledLi>
            ))}
          </ModalList>
        </ModalContent>
      </ModalBackground>
    )}
  </>
);

export default ModalComponent;
