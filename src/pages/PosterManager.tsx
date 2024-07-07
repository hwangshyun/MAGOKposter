import React, { useState, useEffect } from "react";
import styled from "styled-components";

interface SavedMovie {
  id: string;
  title: string;
  count: string;
  date: string;
  status: string;
}

const CenterSection = styled.div`
  justify-content: center;
  /* background-color: green; */
`;

const AllSection = styled.div`
  display: flex;
  /* background-color: green; */
  justify-content: center;
`;

const StyledSection = styled.div`
  display: flex;
  width: 38%;
  margin-top: 10px;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const StyledHeader = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  color: white;
  font-weight: lighter;
`;

const StyledList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const StyledListItem = styled.li`
  background-color: #f9f9f9b1;
  margin: 10px 0;
  padding: 10px;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyeldComingsoon = styled.div`
  width: 50%;
  background-color: "#ffea32f";
  border: 1px solid #ffffff6f;
  padding: 8px;
  border-radius: 10px;
  margin-right: 8px;
`;
const StyeldNowShowing = styled.div`
  width: 50%;
  background-color: #37954d1e;
  border: 1px solid #ffffff6f;
  padding: 10px;
  border-radius: 10px;
`;
const MovieTitle = styled.div`
  font-size: 0.8em;
  font-weight: 500;
  margin-bottom: 2px;
`;

const MovieInfo = styled.div`
  font-size: 0.7em;
`;
const StyledH2 = styled.h2`
  font-weight: lighter;
  color: white;
  margin: 20px 0px;
  /* background-color: white; */
`;
const PosterLocation = styled.div`
  width: 40%;
  margin-top: 20px;
  padding: 0px 0px 20px 10px;
  border: 1px solid #ffffff6f;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #5b5b5b55;
  align-items: center;
`;

const StyledInput = styled.input<{ isDoubleClicked: boolean; isAssigned: boolean }>`
  margin-left: 5px;
  width: 130px;
  padding: 4px;
  background-color: ${({ isDoubleClicked, isAssigned }) => 
    isAssigned ? 'yellow' : isDoubleClicked ? 'orange' : '#ffffffe6'};
  border: 1px solid #0000009d;
  border-radius: 5px;
  text-align: center;
  font-weight: ${({ isDoubleClicked }) => (isDoubleClicked ? 'bold' : 'normal')};
`;

const StyledButton = styled.button`
  background-color: #000000ad;
  border-radius: 5px;
  border: 1px solid #ffffffb2;
  padding: 8px;
  margin: 3px;
  margin-bottom: 10px;
  color: white;
  font-weight: medium;
  cursor: pointer;
  transition: 0.3s;
  &:hover {
    background-color: none;
    transform: scale(1.1);
    font-weight: bold;
  }
`;

const PosterManager: React.FC<{ savedMovies: SavedMovie[] }> = ({ savedMovies }) => {
  const [ratings, setRatings] = useState<{ [id: string]: number }>(() => {
    const storedRatings = localStorage.getItem("ratings");
    return storedRatings ? JSON.parse(storedRatings) : {};
  });

  const [nowShowingInputValues, setNowShowingInputValues] = useState<{ [key: string]: string }>(() => {
    const storedValues = localStorage.getItem("nowShowingInputValues");
    return storedValues ? JSON.parse(storedValues) : {};
  });

  const [upcomingInputValues, setUpcomingInputValues] = useState<{ [key: string]: string }>(() => {
    const storedValues = localStorage.getItem("upcomingInputValues");
    return storedValues ? JSON.parse(storedValues) : {};
  });

  const [doubleClickedInputs, setDoubleClickedInputs] = useState<{ [key: string]: boolean }>(() => {
    const storedValues = localStorage.getItem("doubleClickedInputs");
    return storedValues ? JSON.parse(storedValues) : {};
  });

  const [assignedInputs, setAssignedInputs] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    localStorage.setItem("ratings", JSON.stringify(ratings));
  }, [ratings]);

  useEffect(() => {
    localStorage.setItem("nowShowingInputValues", JSON.stringify(nowShowingInputValues));
  }, [nowShowingInputValues]);

  useEffect(() => {
    localStorage.setItem("upcomingInputValues", JSON.stringify(upcomingInputValues));
  }, [upcomingInputValues]);

  useEffect(() => {
    localStorage.setItem("doubleClickedInputs", JSON.stringify(doubleClickedInputs));
  }, [doubleClickedInputs]);

  const handleRating = (id: string, rating: number) => {
    setRatings({ ...ratings, [id]: rating });
  };

  const renderRatingStars = (id: string) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          onClick={() => handleRating(id, i)}
          style={{
            cursor: "pointer",
            color: i <= (ratings[id] || 0) ? "gold" : "gray",
            fontSize: "14px",
          }}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, key: string, type: string) => {
    if (type === "nowShowing") {
      setNowShowingInputValues({
        ...nowShowingInputValues,
        [key]: event.target.value,
      });
    } else {
      setUpcomingInputValues({
        ...upcomingInputValues,
        [key]: event.target.value,
      });
    }
  };

  const handleInputDoubleClick = (key: string) => {
    setDoubleClickedInputs((prevState) => {
      const newState = { ...prevState, [key]: !prevState[key] };
      localStorage.setItem("doubleClickedInputs", JSON.stringify(newState));
      return newState;
    });
  };

  const handleButtonClick = (status: string, type: string) => {
    const movies = savedMovies
      .filter((movie) => movie.status === status)
      .sort((a, b) => (ratings[b.id] || 0) - (ratings[a.id] || 0));

    const newInputValues = type === "nowShowing" ? { ...nowShowingInputValues } : { ...upcomingInputValues };
    const inputIds = type === "nowShowing"
      ? [
          "4층",
          "4층 뒷쪽",
          "4-6층 에스컬레이터",
          "6층 2관옆",
          "6층 3관 복도",
          "6-8층 에스컬레이터",
          "8층",
        ]
      : [
          "5층 에스컬레이터 앞",
          "1관 퇴장문 앞",
          "사무실 앞",
          "7층 에스컬레이터 앞",
          "4관 퇴장문 앞",
          "천조창고 앞",
        ];

    const movieCounts: { [title: string]: number } = {};
    movies.forEach((movie) => {
      movieCounts[movie.title] = Number(movie.count);
    });

    const newAssignedInputs: { [key: string]: boolean } = {};

    inputIds.forEach((inputId) => {
      const lineMovies: Set<string> = new Set();

      for (let i = 0; i < 3; i++) {
        const inputKey = `${inputId}-${i}`;
        if (newInputValues[inputKey]) {
          // 이미 값이 있으면 넘어감
          continue;
        }

        let movieAssigned = false;

        for (const movie of movies) {
          if (movieCounts[movie.title] > 0 && !lineMovies.has(movie.title)) {
            lineMovies.add(movie.title);
            newInputValues[inputKey] = movie.title;
            newAssignedInputs[inputKey] = true;
            movieCounts[movie.title] -= 1;
            movieAssigned = true;
            break;
          }
        }

        if (!movieAssigned) break; // 더 이상 배치할 영화가 없으면 중단
      }
    });

    if (type === "nowShowing") {
      setNowShowingInputValues(newInputValues);
    } else {
      setUpcomingInputValues(newInputValues);
    }
    setAssignedInputs(newAssignedInputs);
  };

  const handleClearInputs = (type: string) => {
    if (type === "nowShowing") {
      setNowShowingInputValues({});
      setDoubleClickedInputs((prevState) => {
        const updatedState = { ...prevState };
        Object.keys(nowShowingInputValues).forEach(key => {
          updatedState[key] = false;
        });
        localStorage.removeItem("nowShowingInputValues");
        localStorage.setItem("doubleClickedInputs", JSON.stringify(updatedState));
        return updatedState;
      });
    } else {
      setUpcomingInputValues({});
      setDoubleClickedInputs((prevState) => {
        const updatedState = { ...prevState };
        Object.keys(upcomingInputValues).forEach(key => {
          updatedState[key] = false;
        });
        localStorage.removeItem("upcomingInputValues");
        localStorage.setItem("doubleClickedInputs", JSON.stringify(updatedState));
        return updatedState;
      });
    }
    setAssignedInputs({});
  };

  const handleSaveDefaults = (type: string) => {
    if (type === "nowShowing") {
      localStorage.setItem("defaultNowShowingInputValues", JSON.stringify(nowShowingInputValues));
    } else {
      localStorage.setItem("defaultUpcomingInputValues", JSON.stringify(upcomingInputValues));
    }
  };

  const handleLoadDefaults = (type: string) => {
    if (type === "nowShowing") {
      const storedDefaults = localStorage.getItem("defaultNowShowingInputValues");
      if (storedDefaults) {
        setNowShowingInputValues(JSON.parse(storedDefaults));
      }
    } else {
      const storedDefaults = localStorage.getItem("defaultUpcomingInputValues");
      if (storedDefaults) {
        setUpcomingInputValues(JSON.parse(storedDefaults));
      }
    }
  };

  return (
    <CenterSection>
      <AllSection>
        <StyledSection>
          <StyeldComingsoon>
            <StyledHeader>상영 예정작</StyledHeader>
            <StyledList>
              {savedMovies
                .filter((movie) => movie.status === "상영 예정")
                .map((movie) => (
                  <StyledListItem key={movie.id}>
                    <div>
                      <MovieTitle>{movie.title}</MovieTitle>
                      <MovieInfo>
                        {movie.date} 개봉 <br />
                        {movie.count} 장
                      </MovieInfo>
                    </div>
                    <div>{renderRatingStars(movie.id)}</div>
                  </StyledListItem>
                ))}
            </StyledList>
          </StyeldComingsoon>
          <StyeldNowShowing>
            <StyledHeader>상영중</StyledHeader>
            <StyledList>
              {savedMovies
                .filter((movie) => movie.status === "상영중")
                .map((movie) => (
                  <StyledListItem key={movie.id}>
                    <div>
                      <MovieTitle>{movie.title}</MovieTitle>
                      <MovieInfo>
                        {movie.date} 개봉 <br />
                        {movie.count} 장
                      </MovieInfo>
                    </div>
                    <div>{renderRatingStars(movie.id)}</div>
                  </StyledListItem>
                ))}
            </StyledList>
          </StyeldNowShowing>
        </StyledSection>
        <PosterLocation>
          <CenterSection>
            <StyledH2>Now Showing</StyledH2>
            <StyledButton onClick={() => handleButtonClick("상영중", "nowShowing")}>영화 배치</StyledButton>
            <StyledButton onClick={() => handleClearInputs("nowShowing")}>비우기</StyledButton>
            <StyledButton onClick={() => handleSaveDefaults("nowShowing")}>저장하기</StyledButton>
            <StyledButton onClick={() => handleLoadDefaults("nowShowing")}>불러오기</StyledButton>
            <div>
              {[
                "4층",
                "4층 뒷쪽",
                "4-6층 에스컬레이터",
                "6층 2관옆",
                "6층 3관 복도",
                "6-8층 에스컬레이터",
                "8층",
              ].map((floor, index) => (
                <div key={index}>
                  <h4 style={{ margin: "5px", color: "#ffffff", fontWeight: "normal" }}>{floor}</h4>
                  {[0, 1, 2].map((i) => (
                    <StyledInput
                      key={i}
                      type="text"
                      value={nowShowingInputValues[`${floor}-${i}`] || ""}
                      onChange={(e) => handleInputChange(e, `${floor}-${i}`, "nowShowing")}
                      onDoubleClick={() => handleInputDoubleClick(`${floor}-${i}`)}
                      isDoubleClicked={!!doubleClickedInputs[`${floor}-${i}`]}
                      isAssigned={!!assignedInputs[`${floor}-${i}`]}
                    />
                  ))}
                  <br />
                </div>
              ))}
            </div>
            <StyledH2>Coming Soon</StyledH2>
            <StyledButton onClick={() => handleButtonClick("상영 예정", "upcoming")}>영화 배치</StyledButton>
            <StyledButton onClick={() => handleClearInputs("upcoming")}>비우기</StyledButton>
            <StyledButton onClick={() => handleSaveDefaults("upcoming")}>저장하기</StyledButton>
            <StyledButton onClick={() => handleLoadDefaults("upcoming")}>불러오기</StyledButton>
            <div>
              {[
                "5층 에스컬레이터 앞",
                "1관 퇴장문 앞",
                "사무실 앞",
                "7층 에스컬레이터 앞",
                "4관 퇴장문 앞",
                "천조창고 앞",
              ].map((location, index) => (
                <div key={index}>
                  <h4 style={{ margin: "5px", color: "#ffffff", fontWeight: "normal" }}>{location}</h4>
                  {[0, 1, 2].map((i) => (
                    <StyledInput
                      key={i}
                      type="text"
                      value={upcomingInputValues[`${location}-${i}`] || ""}
                      onChange={(e) => handleInputChange(e, `${location}-${i}`, "upcoming")}
                      onDoubleClick={() => handleInputDoubleClick(`${location}-${i}`)}
                      isDoubleClicked={!!doubleClickedInputs[`${location}-${i}`]}
                      isAssigned={!!assignedInputs[`${location}-${i}`]}
                    />
                  ))}
                  <br />
                </div>
              ))}
            </div>
          </CenterSection>
        </PosterLocation>
      </AllSection>
    </CenterSection>
  );
};

export default PosterManager;
