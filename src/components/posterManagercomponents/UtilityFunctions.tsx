import { LocationData, SavedMovie } from "../../types/types";
import { MovieInfo, MovieTitle, StyledButton, StyledInput, StyledList, StyledListItem } from "./StyledComponents";

export const renderRatingStars = (
  id: string,
  ratings: { [id: string]: number },
  handleRating: (id: string, rating: number) => void
) => {
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

export const renderMovieList = (
  movies: SavedMovie[],
  status: string,
  renderRatingStars: (id: string) => JSX.Element[]
) => (
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

export const renderLocationInputs = (
  locations: LocationData[],
  inputValues: { [key: string]: string },
  type: string,
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>, key: string, type: string) => void,
  handleInputDoubleClick: (key: string) => void,
  doubleClickedInputs: { [key: string]: boolean },
  assignedInputs: { [key: string]: boolean },
  handleAddInput: (location: string) => void,
  locationInputCounts: { [key: string]: number }
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
        {[...Array(locationInputCounts[location.location] || 1)].map((_, i) => (
          <StyledInput
            key={i}
            type="text"
            value={inputValues[`${location.location}-${i}`] || ""}
            onChange={(e) => handleInputChange(e, `${location.location}-${i}`, type)}
            onDoubleClick={() => handleInputDoubleClick(`${location.location}-${i}`)}
            isDoubleClicked={!!doubleClickedInputs[`${location.location}-${i}`]}
            isAssigned={!!assignedInputs[`${location.location}-${i}`]}
          />
        ))}
        <StyledButton onClick={() => handleAddInput(location.location)}>
          인풋창 추가
        </StyledButton>
        <br />
      </div>
    ))}
  </div>
);
