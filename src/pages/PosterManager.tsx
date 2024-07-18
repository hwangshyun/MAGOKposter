import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { supabase } from "../api/supabaseClient";
import { useAuth } from "../contexts/AuthContext";

interface SavedMovie {
  id: string;
  title: string;
  count: string;
  date: string;
  status: string;
  rating: number;
  user_id: string;
}

interface LocationData {
  id: string;
  location: string;
  input_count: number;
  type: string;
}

const CenterSection = styled.div`
  justify-content: center;
`;

const AllSection = styled.div`
  display: flex;
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
  margin: 20px 0px;
`;
const PosterLocation = styled.div`
  width: auto;
  margin-top: 20px;
  padding: 0px 10px 20px 10px;
  border: 1px solid #ffffff6f;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #5b5b5b55;
  align-items: center;
`;

const StyledInput = styled.input<{
  isDoubleClicked: boolean;
  isAssigned: boolean;
}>`
  margin-left: 5px;
  width: 130px;
  padding: 4px;
  background-color: ${({ isDoubleClicked, isAssigned }) =>
    isAssigned ? "yellow" : isDoubleClicked ? "orange" : "#ffffffe6"};
  border: 1px solid #0000009d;
  border-radius: 5px;
  text-align: center;
  font-weight: ${({ isDoubleClicked }) =>
    isDoubleClicked ? "bold" : "normal"};
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

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 40%;
  height: 80%;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  margin-bottom: 10px;
  width: 130px;
  padding: 4px;
  border-radius: 4px;
  border: 1px solid #ddd;
`;

const AddButton = styled.button`
  background-color: #4d684e;
  width: 80px;
  border: none;
  padding: 8px;
  margin: 3px;
  color: white;
  padding: 5px 10px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  border-radius: 8px;
  cursor: pointer;
`;

const RemoveButton = styled.button`
  width: 50px;
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

const PosterManager: React.FC = () => {
  const { user } = useAuth();
  const [savedMovies, setSavedMovies] = useState<SavedMovie[]>([]);
  const [ratings, setRatings] = useState<{ [id: string]: number }>({});
  const [nowShowingInputValues, setNowShowingInputValues] = useState<{
    [key: string]: string;
  }>(() => {
    const storedValues = localStorage.getItem("nowShowingInputValues");
    return storedValues ? JSON.parse(storedValues) : {};
  });

  const [upcomingInputValues, setUpcomingInputValues] = useState<{
    [key: string]: string;
  }>(() => {
    const storedValues = localStorage.getItem("upcomingInputValues");
    return storedValues ? JSON.parse(storedValues) : {};
  });

  const [doubleClickedInputs, setDoubleClickedInputs] = useState<{
    [key: string]: boolean;
  }>(() => {
    const storedValues = localStorage.getItem("doubleClickedInputs");
    return storedValues ? JSON.parse(storedValues) : {};
  });

  const [assignedInputs, setAssignedInputs] = useState<{
    [key: string]: boolean;
  }>({});
  const [nowShowingLocations, setNowShowingLocations] = useState<
    LocationData[]
  >([]);
  const [upcomingLocations, setUpcomingLocations] = useState<LocationData[]>(
    []
  );
  const [locationInputCounts, setLocationInputCounts] = useState<{
    [key: string]: number;
  }>({});
  const [newLocation, setNewLocation] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentType, setCurrentType] = useState<string>("");

  useEffect(() => {
    if (user) {
      fetchSavedMovies(user.id);
      fetchLocations(user.id);
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem("ratings", JSON.stringify(ratings));
  }, [ratings]);

  useEffect(() => {
    localStorage.setItem(
      "nowShowingInputValues",
      JSON.stringify(nowShowingInputValues)
    );
  }, [nowShowingInputValues]);

  useEffect(() => {
    localStorage.setItem(
      "upcomingInputValues",
      JSON.stringify(upcomingInputValues)
    );
  }, [upcomingInputValues]);

  useEffect(() => {
    localStorage.setItem(
      "doubleClickedInputs",
      JSON.stringify(doubleClickedInputs)
    );
  }, [doubleClickedInputs]);

  const fetchSavedMovies = async (userId: string) => {
    const { data, error } = await supabase
      .from("movies")
      .select("*")
      .eq("user_id", userId);
    if (error) {
      console.error("Error fetching movies:", error);
    } else {
      setSavedMovies(data);
      const initialRatings: { [id: string]: number } = {};
      data.forEach((movie) => {
        initialRatings[movie.id] = movie.rating || 0;
      });
      setRatings(initialRatings);
    }
  };

  const fetchLocations = async (userId: string) => {
    const { data, error } = await supabase
      .from("posterlocations")
      .select("*")
      .eq("user_id", userId);
    if (error) {
      console.error("Error fetching locations:", error);
    } else {
      const nowShowing = data.filter(
        (loc: LocationData) => loc.type === "nowShowing"
      );
      const upcoming = data.filter(
        (loc: LocationData) => loc.type === "upcoming"
      );
      setNowShowingLocations(nowShowing);
      setUpcomingLocations(upcoming);

      const initialInputCounts: { [key: string]: number } = {};
      data.forEach((location: LocationData) => {
        initialInputCounts[location.location] = location.input_count;
      });
      setLocationInputCounts(initialInputCounts);
    }
  };

  const handleRating = async (id: string, rating: number) => {
    setRatings({ ...ratings, [id]: rating });
    const { error } = await supabase
      .from("movies")
      .update({ rating })
      .eq("id", id);
    if (error) {
      console.error("Error updating rating:", error);
    }
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

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    key: string,
    type: string
  ) => {
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

    const newInputValues =
      type === "nowShowing"
        ? { ...nowShowingInputValues }
        : { ...upcomingInputValues };
    const inputIds =
      type === "nowShowing"
        ? nowShowingLocations.map((location) => location.location)
        : upcomingLocations.map((location) => location.location);

    const movieCounts: { [title: string]: number } = {};
    movies.forEach((movie) => {
      movieCounts[movie.title] = Number(movie.count);
    });

    const newAssignedInputs: { [key: string]: boolean } = {};

    inputIds.forEach((inputId) => {
      const lineMovies: Set<string> = new Set();

      for (let i = 0; i < 100; i++) {
        const inputKey = `${inputId}-${i}`;
        if (newInputValues[inputKey]) {
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

        if (!movieAssigned) break;
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
        Object.keys(nowShowingInputValues).forEach((key) => {
          updatedState[key] = false;
        });
        localStorage.removeItem("nowShowingInputValues");
        localStorage.setItem(
          "doubleClickedInputs",
          JSON.stringify(updatedState)
        );
        return updatedState;
      });
    } else {
      setUpcomingInputValues({});
      setDoubleClickedInputs((prevState) => {
        const updatedState = { ...prevState };
        Object.keys(upcomingInputValues).forEach((key) => {
          updatedState[key] = false;
        });
        localStorage.removeItem("upcomingInputValues");
        localStorage.setItem(
          "doubleClickedInputs",
          JSON.stringify(updatedState)
        );
        return updatedState;
      });
    }
    setAssignedInputs({});
  };

  const handleSaveDefaults = (type: string) => {
    if (type === "nowShowing") {
      localStorage.setItem(
        "defaultNowShowingInputValues",
        JSON.stringify(nowShowingInputValues)
      );
      localStorage.setItem(
        "defaultDoubleClickedInputsNowShowing",
        JSON.stringify(doubleClickedInputs)
      );
    } else {
      localStorage.setItem(
        "defaultUpcomingInputValues",
        JSON.stringify(upcomingInputValues)
      );
      localStorage.setItem(
        "defaultDoubleClickedInputsUpcoming",
        JSON.stringify(doubleClickedInputs)
      );
    }
  };

  const handleLoadDefaults = (type: string) => {
    if (type === "nowShowing") {
      const storedDefaults = localStorage.getItem(
        "defaultNowShowingInputValues"
      );
      if (storedDefaults) {
        setNowShowingInputValues(JSON.parse(storedDefaults));
      }
      const storedDoubleClicked = localStorage.getItem(
        "defaultDoubleClickedInputsNowShowing"
      );
      if (storedDoubleClicked) {
        setDoubleClickedInputs(JSON.parse(storedDoubleClicked));
      }
    } else {
      const storedDefaults = localStorage.getItem("defaultUpcomingInputValues");
      if (storedDefaults) {
        setUpcomingInputValues(JSON.parse(storedDefaults));
      }
      const storedDoubleClicked = localStorage.getItem(
        "defaultDoubleClickedInputsUpcoming"
      );
      if (storedDoubleClicked) {
        setDoubleClickedInputs(JSON.parse(storedDoubleClicked));
      }
    }
  };

  const handleAddLocation = async () => {
    const { data, error } = await supabase
      .from("posterlocations")
      .insert([
        {
          location: newLocation,
          input_count: 1,
          user_id: user?.id,
          type: currentType,
        },
      ])
      .select();
    if (error) {
      console.error("Error adding location:", error);
    } else {
      if (currentType === "nowShowing") {
        setNowShowingLocations([...nowShowingLocations, data[0]]);
      } else {
        setUpcomingLocations([...upcomingLocations, data[0]]);
      }
      setLocationInputCounts({ ...locationInputCounts, [newLocation]: 1 });
      setNewLocation("");
    }
  };

  const handleAddInput = (location: string) => {
    setLocationInputCounts({
      ...locationInputCounts,
      [location]: (locationInputCounts[location] || 1) + 1,
    });
  };

  const handleRemoveLocation = async (locationId: string) => {
    const { error } = await supabase
      .from("posterlocations")
      .delete()
      .eq("id", locationId);
    if (error) {
      console.error("Error removing location:", error);
    } else {
      if (currentType === "nowShowing") {
        setNowShowingLocations(
          nowShowingLocations.filter((loc) => loc.id !== locationId)
        );
      } else {
        setUpcomingLocations(
          upcomingLocations.filter((loc) => loc.id !== locationId)
        );
      }
      const { [locationId]: _, ...newLocationInputCounts } =
        locationInputCounts;
      setLocationInputCounts(newLocationInputCounts);
    }
  };

  const handleSave = () => {
    const locationsToSave =
      currentType === "nowShowing" ? nowShowingLocations : upcomingLocations;
    locationsToSave.forEach(async (location) => {
      const { error } = await supabase
        .from("posterlocations")
        .update({ input_count: locationInputCounts[location.location] })
        .eq("id", location.id);
      if (error) {
        console.error("Error updating location:", error);
      }
    });
    setShowModal(false);
  };

  const openModal = (type: string) => {
    setCurrentType(type);
    setShowModal(true);
  };

  const renderMovieList = (movies: SavedMovie[], status: string) => (
    <StyledList>
      {movies
        .filter((movie) => movie.status === status)
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
  );

  const renderLocationInputs = (
    locations: LocationData[],
    inputValues: { [key: string]: string },
    type: string
  ) => (
    <div>
      {locations.map((location) => (
        <div key={location.id}>
          <h4
            style={{
              margin: "5px",
              color: "#ffffff",
              fontWeight: "normal",
            }}
          >
            {location.location}
          </h4>
          {[...Array(locationInputCounts[location.location] || 1)].map(
            (_, i) => (
              <StyledInput
                key={i}
                type="text"
                value={inputValues[`${location.location}-${i}`] || ""}
                onChange={(e) =>
                  handleInputChange(e, `${location.location}-${i}`, type)
                }
                onDoubleClick={() =>
                  handleInputDoubleClick(`${location.location}-${i}`)
                }
                isDoubleClicked={
                  !!doubleClickedInputs[`${location.location}-${i}`]
                }
                isAssigned={!!assignedInputs[`${location.location}-${i}`]}
              />
            )
          )}
          <br />
        </div>
      ))}
    </div>
  );

  return (
    <CenterSection>
      <AllSection>
        <StyledSection>
          <StyeldComingsoon>
            <StyledHeader>상영 예정작</StyledHeader>
            {renderMovieList(savedMovies, "상영 예정")}
          </StyeldComingsoon>
          <StyeldNowShowing>
            <StyledHeader>상영중</StyledHeader>
            {renderMovieList(savedMovies, "상영중")}
          </StyeldNowShowing>
        </StyledSection>
        <PosterLocation>
          <CenterSection>
            <StyledH2>Now Showing</StyledH2>
            <StyledButton
              onClick={() => handleButtonClick("상영중", "nowShowing")}
            >
              영화 배치
            </StyledButton>
            <StyledButton onClick={() => handleClearInputs("nowShowing")}>
              비우기
            </StyledButton>
            <StyledButton onClick={() => handleSaveDefaults("nowShowing")}>
              저장하기
            </StyledButton>
            <StyledButton onClick={() => handleLoadDefaults("nowShowing")}>
              불러오기
            </StyledButton>
            <StyledButton onClick={() => openModal("nowShowing")}>
              위치 수정
            </StyledButton>
            {renderLocationInputs(
              nowShowingLocations,
              nowShowingInputValues,
              "nowShowing"
            )}
            <StyledH2>Coming Soon</StyledH2>
            <StyledButton
              onClick={() => handleButtonClick("상영 예정", "upcoming")}
            >
              영화 배치
            </StyledButton>
            <StyledButton onClick={() => handleClearInputs("upcoming")}>
              비우기
            </StyledButton>
            <StyledButton onClick={() => handleSaveDefaults("upcoming")}>
              저장하기
            </StyledButton>
            <StyledButton onClick={() => handleLoadDefaults("upcoming")}>
              불러오기
            </StyledButton>
            <StyledButton onClick={() => openModal("upcoming")}>
              위치 수정
            </StyledButton>
            {renderLocationInputs(
              upcomingLocations,
              upcomingInputValues,
              "upcoming"
            )}
          </CenterSection>
        </PosterLocation>
      </AllSection>
      {showModal && (
        <ModalOverlay>
          <ModalContent>
            <h3>위치 추가</h3>
            <Input
              type="text"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              placeholder="새로운 위치 이름"
            />
            <AddButton onClick={handleAddLocation}>위치 추가</AddButton>
            <RemoveButton onClick={() => setShowModal(false)}>
              취소
            </RemoveButton>
            <StyledH2>현재 위치</StyledH2>
            {(currentType === "nowShowing"
              ? nowShowingLocations
              : upcomingLocations
            ).map((location) => (
              <div key={location.id}>
                <div style={{ display: "flex" }}>
                  <h4
                    style={{
                      margin: "5px",
                      color: "#000000",
                      fontWeight: "normal",
                    }}
                  >
                    {location.location}
                  </h4>
                  <StyledButton
                    onClick={() => handleRemoveLocation(location.id)}
                  >
                    삭제
                  </StyledButton>
                </div>
                {[...Array(locationInputCounts[location.location] || 1)].map(
                  (_, i) => (
                    <StyledInput
                      key={i}
                      type="text"
                      value={
                        (currentType === "nowShowing"
                          ? nowShowingInputValues
                          : upcomingInputValues)[`${location.location}-${i}`] ||
                        ""
                      }
                      onChange={(e) =>
                        handleInputChange(
                          e,
                          `${location.location}-${i}`,
                          currentType
                        )
                      }
                      onDoubleClick={() =>
                        handleInputDoubleClick(`${location.location}-${i}`)
                      }
                      isDoubleClicked={
                        !!doubleClickedInputs[`${location.location}-${i}`]
                      }
                      isAssigned={!!assignedInputs[`${location.location}-${i}`]}
                    />
                  )
                )}
                <StyledButton onClick={() => handleAddInput(location.location)}>
                  추가
                </StyledButton>
                <br />
              </div>
            ))}
            <AddButton onClick={handleSave}>저장</AddButton>
          </ModalContent>
        </ModalOverlay>
      )}
    </CenterSection>
  );
};

export default PosterManager;
