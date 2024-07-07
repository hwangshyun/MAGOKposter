import React from "react";
import styled from "styled-components";

const StyledSection = styled.div<{ $bgColor?: string }>`
  width: 29%;
  background-color: ${(props) => props.$bgColor || "#ffffff70"};
  background-blend-mode: multiply;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ffffff6f;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const StyledHeader = styled.h2<{ $underlineColor?: string }>`
  text-align: center;
  font-size: x-large;
  font-weight: lighter;
  color: #ffffff;
  padding-bottom: 15px;
  border-bottom: 5px solid ${(props) => props.$underlineColor || "green"};
`;

const StyledList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin-top: 0;
`;

const StyledListItem = styled.li`
  background-color: #f9f9f9ce;
  margin: 10px 0;
  padding: 5px 3px 3px 10px;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MovieTitle = styled.div`
  font-size: 0.85em;
  font-weight: bold;
  margin-bottom: 2px;
`;

const MovieInfo = styled.div`
  font-size: 0.8em;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 5px;
  margin-left: 20px;
`;

const SetButton = styled.button`
  margin: 5px;
  width: auto;
  height: auto;
  padding: 10px;
  border: 1px solid #ffffff60;
  border-radius: 4px;
  background-color: #000000d0;
  color: white;
  margin-left: auto;
  font-weight: 100px;
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    background-color: #6a6a6aac;
    transform: scale(1.05);
    border: 1px solid transparent;
  }
`;

const TotalCount = styled.div`
  text-align: right;
  padding-right: 5px;
  font-weight: medium;
  color: #ffffff;
  margin-top: auto;
`;

interface SavedMovie {
  id: string;
  title: string;
  count: string;
  date: string;
  status: string;
}

const MovieListComponent: React.FC<{
  title: string;
  savedMovies: SavedMovie[];
  updateMovieStatus: (id: string, status: string) => void;
  deleteMovie: (id: string) => void;
}> = ({ title, savedMovies, updateMovieStatus, deleteMovie }) => {
  const totalCount = savedMovies.reduce((sum, movie) => sum + parseInt(movie.count), 0);

  const getUnderlineColor = (title: string) => {
    switch (title) {
      case "상영 예정":
        return "#ffca39a2";
      case "상영중":
        return "#4dc36997";
      case "종영":
        return "#dc3546af";
      default:
        return "green";
    }
  };

  return (
    <StyledSection $bgColor={title === "상영 예정" ? "#ffea32f" : title === "상영중" ? "#37954d1e" : "#a026321f"}>
      <StyledHeader $underlineColor={getUnderlineColor(title)}>{title}</StyledHeader>
      <StyledList>
        {savedMovies.map((movie) => (
          <StyledListItem key={movie.id}>
            <div>
              <MovieTitle>{movie.title}</MovieTitle>
              <MovieInfo>
                {movie.date} 개봉 <br />
                {movie.count} 장
              </MovieInfo>
            </div>
            <ButtonContainer>
              {title === "종영" ? (
                <>
                  <SetButton onClick={() => updateMovieStatus(movie.id, "상영중")}>상영중</SetButton>
                  <SetButton onClick={() => deleteMovie(movie.id)}>삭제</SetButton>
                </>
              ) : (
                <SetButton onClick={() => updateMovieStatus(movie.id, title === "상영 예정" ? "상영중" : "종영")}>
                  {title === "상영 예정" ? "상영중" : "종영"}
                </SetButton>
              )}
            </ButtonContainer>
          </StyledListItem>
        ))}
      </StyledList>
      <TotalCount>총 {totalCount} 장</TotalCount>
    </StyledSection>
  );
};

export default MovieListComponent;
