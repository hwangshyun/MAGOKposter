import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { v4 as uuidv4 } from "uuid";
import { searchMovies, getMovieInfo } from "../api/Movie";
import FormComponent from "../components/movieaddcomponents/FormComponent";
import ModalComponent from "../components/movieaddcomponents/ModalComponent";
import MovieListComponent from "../components/movieaddcomponents/MovieListComponent";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Swal from 'sweetalert2';
import { supabase } from "../api/supabaseClient";
import { useAuth } from "../contexts/AuthContext";

const All = styled.div`
  z-index: 5;
`;

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
  user_id: string;
}

const MovieAdd: React.FC = () => {
  const [movieName, setMovieName] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [title, setTitle] = useState("");
  const [count, setCount] = useState("");
  const [date, setDate] = useState("");
  const [savedMovies, setSavedMovies] = useState<SavedMovie[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchSavedMovies();
  }, [user]);

  const fetchSavedMovies = async () => {
    if (!user) return;
    const { data, error } = await supabase.from("movies").select("*").eq('user_id', user.id);
    if (error) {
      console.error("Error fetching movies:", error);
    } else {
      setSavedMovies(sortMoviesByDate(data));
    }
  };

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
      setMovies(data.movieListResult.movieList);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  const fetchMovieInfo = async (movieCd: string) => {
    try {
      const data = await getMovieInfo(movieCd);
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

  const addMovie = async (event: FormEvent) => {
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
      user_id: user.id,
    };

    const { error } = await supabase.from("movies").insert(newMovie);
    if (error) {
      console.error("Error inserting movie:", error);
    } else {
      fetchSavedMovies();
    }

    setTitle("");
    setCount("");
    setDate("");
  };

  const updateMovieStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("movies").update({ status }).eq("id", id);
    if (error) {
      console.error("Error updating movie status:", error);
    } else {
      fetchSavedMovies();
    }
  };

  const deleteMovie = async (id: string) => {
    const { error } = await supabase.from("movies").delete().eq("id", id);
    if (error) {
      console.error("Error deleting movie:", error);
    } else {
      fetchSavedMovies();
    }
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
