import React, { ChangeEvent, FormEvent } from "react";
import styled from "styled-components";

const StyledForm = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 8px;
  width: auto;
  padding: 12px;
  /* margin-left: 2%; */
`;

const StyledBoong = styled.div`
  width: auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #ffffffb1;
  border-radius: 10px;
  background-color: #5c5c5c34;
`;

const StyledSearchForm = styled.form`
  display: flex;
  align-items: center;
  margin: 5px;
`;

const StyledInput = styled.input`
  margin: 3px;
  padding: 10px;
  width: 250px;
  border: 1px solid #474747;
  border-radius: 4px;
`;

const StyledButton = styled.button`
  margin: 5px;
  padding: 10px 15px;
  border: 1px solid #ffffffb2;
  border-radius: 4px;
  background-color: #00000063;
  color: white;
  transition: 0.4s;
  cursor: pointer;
  &:hover {
    background-color: #484848;
  }
`;

const FormComponent: React.FC<{
  movieName: string;
  setMovieName: (name: string) => void;
  fetchMovies: () => void;
  title: string;
  titleInput: (e: ChangeEvent<HTMLInputElement>) => void;
  count: string;
  countInput: (e: ChangeEvent<HTMLInputElement>) => void;
  date: string;
  dateInput: (e: ChangeEvent<HTMLInputElement>) => void;
  addMovie: (event: FormEvent) => void;
}> = ({
  movieName,
  setMovieName,
  fetchMovies,
  title,
  titleInput,
  count,
  countInput,
  date,
  dateInput,
  addMovie,
}) => (
  <div style={{ display: "flex" }}>
    <StyledForm>
      <StyledBoong>
        <StyledSearchForm
          onSubmit={(e) => {
            e.preventDefault();
            fetchMovies();
          }}
        >
          <StyledInput
            value={movieName}
            onChange={(e) => setMovieName(e.target.value)}
            type="text"
            placeholder="검색할 영화명을 입력하세요."
          />
          <StyledButton type="submit">검색</StyledButton>
        </StyledSearchForm>
        <StyledSearchForm
          onSubmit={(e) => {
            e.preventDefault();
            addMovie(e);
          }}
        >
          <div>
            <StyledInput
              value={title}
              onChange={titleInput}
              type="text"
              placeholder="영화명을 입력하세요."
            />
            <br />
            <StyledInput
              value={count}
              onChange={countInput}
              type="number"
              placeholder="매수를 입력하세요."
            />
            <br />
            <StyledInput
              value={date}
              onChange={dateInput}
              type="text"
              placeholder="개봉일을 입력하세요."
            />
          </div>
          <StyledButton type="submit">등록</StyledButton>
        </StyledSearchForm>
      </StyledBoong>
    </StyledForm>
  </div>
);

export default FormComponent;
