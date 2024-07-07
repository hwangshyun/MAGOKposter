import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { v4 as uuidv4 } from "uuid";
import { searchMovies, getMovieInfo } from "../api/Movie";
import FormComponent from "../components/movieaddcomponents/FormComponent";
import ModalComponent from "../components/movieaddcomponents/ModalComponent";
import MovieListComponent from "../components/movieaddcomponents/MovieListComponent";
// import CurrentShowing from "../components/CurrentShowing";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Swal from 'sweetalert2';

const All = styled.div`
  z-index: 5;
`

const StyledDiv = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
`;

const StyledButton = styled.button`
  margin: 10px;
  padding: 10px 15px;
  border: 1px solid #ffffff95;
  border-radius: 4px;
  background-color: #00000073;
  color: white;
  font-weight: medium;
  font-size: large;
  cursor: pointer;
  transition: 0.5s;
  &:hover {
    background-color: #a5a5a5a7;
    transform: scale(1.2);
    font-weight: bold;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  margin-left: auto;
  margin-top: auto;
`;

interface Movie {
  movieCd: string;
  movieNm: string;
}

interface SavedMovie {
  id: string;
  title: string;
  count: string;
  date: string;
  status: string;
}

const MovieAdd: React.FC = () => {
  const [movieName, setMovieName] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [title, setTitle] = useState("");
  const [count, setCount] = useState("");
  const [date, setDate] = useState("");
  const [savedMovies, setSavedMovies] = useState<SavedMovie[]>(() => {
    const saved = localStorage.getItem("movies");
    return saved ? JSON.parse(saved) : [];
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("movies", JSON.stringify(savedMovies));
  }, [savedMovies]);

  const sortMoviesByDate = (movies: SavedMovie[]) => {
    return movies
      .slice()
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const fetchMovies = async () => {
    if (!movieName) {
      Swal.fire({
        icon: 'warning',
        title: '입력 오류',
        text: '검색할 영화명을 입력해주세요.',
        confirmButtonText: '확인'
      });
      return;
    }

    try {
      const data = await searchMovies(movieName, 100);
      console.log(data);
      console.log(movies);
      setMovies(data.movieListResult.movieList);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  const fetchMovieInfo = async (movieCd: string) => {
    try {
      const data = await getMovieInfo(movieCd);
      console.log(data);
      setTitle(data.movieInfoResult.movieInfo.movieNm);
      setDate(data.movieInfoResult.movieInfo.openDt);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error fetching movie info:", error);
    }
  };

  const titleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const countInput = (e: ChangeEvent<HTMLInputElement>) => {
    setCount(e.target.value);
  };

  const dateInput = (e: ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };

  const addMovie = (event: FormEvent) => {
    event.preventDefault();

    if (!title || !count || !date) {
      Swal.fire({
        icon: 'warning',
        title: '입력 오류',
        text: '영화명, 매수 및 개봉일을 모두 입력해주세요.',
        confirmButtonText: '확인'
      });
      return;
    }

    const isDuplicate = savedMovies.some(
      (movie) => movie.title === title && movie.date === date
    );
    if (isDuplicate) {
      Swal.fire({
        icon: 'warning',
        title: '중복 오류',
        text: '이미 등록된 영화입니다.',
        confirmButtonText: '확인'
      });
      return;
    }

    const newMovie: SavedMovie = {
      id: uuidv4(),
      title: title,
      count: count,
      date: date,
      status: "상영 예정",
    };
    const updatedMovies = [...savedMovies, newMovie];
    setSavedMovies(sortMoviesByDate(updatedMovies));
    setTitle("");
    setCount("");
    setDate("");
  };

  const updateMovieStatus = (id: string, status: string) => {
    const updatedMovies = savedMovies.map((movie) =>
      movie.id === id ? { ...movie, status: status } : movie
    );
    setSavedMovies(sortMoviesByDate(updatedMovies));
  };

  const deleteMovie = (id: string) => {
    const updatedMovies = savedMovies.filter((movie) => movie.id !== id);
    setSavedMovies(sortMoviesByDate(updatedMovies));
  };

  return (
    <All>
      <div style={{ display: "flex", alignItems: "center" }}>
        <FormComponent
          movieName={movieName}
          setMovieName={setMovieName}
          fetchMovies={fetchMovies}
          title={title}
          titleInput={titleInput}
          count={count}
          countInput={countInput}
          date={date}
          dateInput={dateInput}
          addMovie={addMovie}
        />
        {/* <CurrentShowing  movies={savedMovies.filter(movie => movie.status === "상영중")} /> */}
        <ButtonContainer>
          <Link to="/postermanager">
            <StyledButton>대국전관리</StyledButton>
          </Link>
        </ButtonContainer>
      </div>
      <ModalComponent
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        movies={movies}
        fetchMovieInfo={fetchMovieInfo}
      />
      <StyledDiv>
        <MovieListComponent
          title="상영 예정"
          savedMovies={savedMovies.filter(
            (movie) => movie.status === "상영 예정"
          )}
          updateMovieStatus={updateMovieStatus}
          deleteMovie={deleteMovie}
        />
        <MovieListComponent
          title="상영중"
          savedMovies={savedMovies.filter((movie) => movie.status === "상영중")}
          updateMovieStatus={updateMovieStatus}
          deleteMovie={deleteMovie}
        />
        <MovieListComponent
          title="종영"
          savedMovies={savedMovies.filter((movie) => movie.status === "종영")}
          updateMovieStatus={updateMovieStatus}
          deleteMovie={deleteMovie}
        />
      </StyledDiv>
    </All>
  );
};

export default MovieAdd;
