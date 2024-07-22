import React, { useState, useEffect } from "react";
import { supabase } from "../api/supabaseClient";
import { useAuth } from "../contexts/AuthContext";
import {
  renderMovieList,
  renderLocationInputs,
  renderRatingStars,
} from "../components/posterManagercomponents/UtilityFunctions";
import { SavedMovie, LocationData } from "../types/types";
import {
  CenterSection,
  AllSection,
  StyledSection,
  StyledHeader,
  StyeldComingsoon,
  StyeldNowShowing,
  PosterLocation,
  StyledButton,
  ModalOverlay,
  ModalContent,
  Input,
  AddButton,
  RemoveButton,
  StyledH2,
  StyledInput,
} from "../components/posterManagercomponents/StyledComponents";

const PosterManager: React.FC = () => {
  const { user } = useAuth();
  const [savedMovies, setSavedMovies] = useState<SavedMovie[]>([]);
  const [ratings, setRatings] = useState<{ [id: string]: number }>({});
  const [nowShowingInputValues, setNowShowingInputValues] = useState<{
    [key: string]: string;
  }>({});
  const [upcomingInputValues, setUpcomingInputValues] = useState<{
    [key: string]: string;
  }>({});
  const [doubleClickedInputs, setDoubleClickedInputs] = useState<{
    [key: string]: boolean;
  }>({});
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

    let inputIndex = 0;

    while (inputIndex < 100) {
      let anyMovieAssigned = false;
      inputIds.forEach((inputId) => {
        const inputKey = `${inputId}-${inputIndex}`;
        if (newInputValues[inputKey]) {
          return;
        }

        for (const movie of movies) {
          if (movieCounts[movie.title] > 0) {
            newInputValues[inputKey] = movie.title;
            newAssignedInputs[inputKey] = true;
            movieCounts[movie.title] -= 1;
            anyMovieAssigned = true;
            break;
          }
        }
      });

      if (!anyMovieAssigned) {
        break;
      }

      inputIndex += 1;
    }

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

  return (
    <CenterSection>
      <AllSection>
        <StyledSection>
          <StyeldComingsoon>
            <StyledHeader>상영 예정작</StyledHeader>
            {renderMovieList(savedMovies, "상영 예정", (id) =>
              renderRatingStars(id, ratings, handleRating)
            )}
          </StyeldComingsoon>
          <StyeldNowShowing>
            <StyledHeader>상영중</StyledHeader>
            {renderMovieList(savedMovies, "상영중", (id) =>
              renderRatingStars(id, ratings, handleRating)
            )}
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
              "nowShowing",
              handleInputChange,
              handleInputDoubleClick,
              doubleClickedInputs,
              assignedInputs,
              handleAddInput,
              locationInputCounts
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
              "upcoming",
              handleInputChange,
              handleInputDoubleClick,
              doubleClickedInputs,
              assignedInputs,
              handleAddInput,
              locationInputCounts
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
                  인풋창 추가
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
