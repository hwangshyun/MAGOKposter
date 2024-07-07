import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import styled from "styled-components";
import Swal from "sweetalert2";
import { v4 as uuidv4 } from "uuid";

const Select = styled.select`
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 100%;
`;

const Input = styled.input`
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 90%;
  margin-right: auto;
`;

const Button = styled.button`
  padding: 5px 5px;
  width: 50px;
  height: 30px;
  border: none;
  border-radius: 4px;
  background-color: #333;
  color: white;
  cursor: pointer;
  &:hover {
    background-color: #000;
  }
`;

const OfferListContainer = styled.div`
  margin-top: 20px;
  width: 100%;
`;

const OfferItem = styled.div`
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f9f9f8;
  display: flex;
`;

const StyledTitle = styled.h3`
  width: 10%;
`;

const Section = styled.div`
  text-align: center;
  padding: 0px 20px;
  border-right: 0.8px solid black;
  justify-content: center;
`;

const ItemSection = styled.div`
  margin-top: 10px;
  font-size: medium;
  justify-content: center;
  display: flex;
  text-align: center;
`;

const ModalContainer = styled.div<{ $isOpen: boolean }>`
  display: ${(props) => (props.$isOpen ? "flex" : "none")};
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: #fefefe;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  max-width: 500px;
  border-radius: 8px;
`;

const MethodContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
`;

const MethodList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 10px 0;
  width: 100%;
`;

interface MethodListItemProps {
  highlighted: boolean;
}

const MethodListItem = styled.li<MethodListItemProps>`
  background-color: #f1f1f1;
  margin: 5px 0;
  padding: 10px;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${(props) => (props.highlighted ? "red" : "black")};
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: red;
  cursor: pointer;
`;

interface HighlightButtonProps {
  isHighlighted: boolean;
}

const HighlightButton = styled.button<HighlightButtonProps>`
  background: none;
  border: none;
  color: ${(props) => (props.isHighlighted ? "red" : "black")};
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const ImageInput = styled.input`
  margin: 10px 0;
`;

const ImageGrid = styled.div`
  border: 0.8px solid #00000078;
  border-radius: 8px;
  padding: 15px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 10px;
  margin: auto;
`;

const ImageBox = styled.div`
  border: 0.8px solid #00000078;
  border-radius: 8px;
  padding: 14px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 10px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 3px;
  margin-left: auto;
  margin-top: auto;
`;

const AddButton = styled.button`
  padding: 5px 5px;
  border: 1px solid #333;
  border-radius: 4px;
  background-color: #333;
  color: white;
  cursor: pointer;
  &:hover {
    background-color: #000;
    color: white;
  }
`;

const EditButton = styled.button`
  padding: 5px 5px;
  width: 50px;
  height: 30px;
  border: 1px solid #333;
  border-radius: 4px;
  background-color: #333;
  color: white;
  cursor: pointer;
  &:hover {
    background-color: #000;
    color: white;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px;
`;

const SearchInput = styled.input`
  margin-right: 10px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 300px;
`;

interface SavedMovie {
  id: string;
  title: string;
  count: string;
  date: string;
  status: string;
}

interface Offer {
  id: string;
  movieId: string;
  week: string;
  period: string;
  content: string;
  methods: { text: string; highlighted: boolean }[];
  images: string[];
}

const AddOffer: React.FC = () => {
  const [movies, setMovies] = useState<SavedMovie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<string>("");
  const [week, setWeek] = useState<string>("");
  const [period, setPeriod] = useState<string>("");
  const [offerContent, setOfferContent] = useState<string>("");
  const [method, setMethod] = useState<string>("");
  const [methods, setMethods] = useState<
    { text: string; highlighted: boolean }[]
  >([]);
  const [offers, setOffers] = useState<Offer[]>(() => {
    const savedOffers = localStorage.getItem("offers");
    return savedOffers ? JSON.parse(savedOffers) : [];
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEditIndex, setCurrentEditIndex] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const savedMovies = localStorage.getItem("movies");
    if (savedMovies) {
      setMovies(JSON.parse(savedMovies));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("offers", JSON.stringify(offers));
  }, [offers]);

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedMovie(e.target.value);
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    setState: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setState(e.target.value);
  };

  const handleAddMethod = () => {
    if (method.trim()) {
      setMethods((prevMethods) => [
        ...prevMethods,
        { text: method, highlighted: false },
      ]);
      setMethod("");
    }
  };

  const handleRemoveMethod = (index: number) => {
    setMethods((prevMethods) => prevMethods.filter((_, i) => i !== index));
  };

  const handleHighlightMethod = (index: number) => {
    setMethods((prevMethods) =>
      prevMethods.map((method, i) =>
        i === index ? { ...method, highlighted: !method.highlighted } : method
      )
    );
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const imagePromises = filesArray.map((file) => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target?.result) {
              resolve(event.target.result as string);
            } else {
              reject(new Error("파일 읽기 실패"));
            }
          };
          reader.readAsDataURL(file);
        });
      });
      Promise.all(imagePromises).then((images) => {
        setImages((prevImages) => [...prevImages, ...images].slice(0, 4)); // 최대 4개 이미지 저장
      });
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (
      !selectedMovie ||
      !week ||
      !period ||
      !offerContent ||
      methods.length === 0 ||
      images.length === 0
    ) {
      Swal.fire({
        icon: "warning",
        title: "입력 오류",
        text: "모든 항목을 입력해주세요.",
        confirmButtonText: "확인",
      });
      return;
    }

    const newOffer: Offer = {
      id: isEditMode && currentEditIndex ? currentEditIndex : uuidv4(),
      movieId: selectedMovie,
      week,
      period,
      content: offerContent,
      methods,
      images,
    };

    if (isEditMode && currentEditIndex) {
      setOffers((prevOffers) =>
        prevOffers.map((offer) =>
          offer.id === currentEditIndex ? newOffer : offer
        )
      );
      setIsEditMode(false);
      setCurrentEditIndex(null);
    } else {
      setOffers((prevOffers) => [...prevOffers, newOffer]);
    }

    setSelectedMovie("");
    setWeek("");
    setPeriod("");
    setOfferContent("");
    setMethods([]);
    setImages([]);
    setIsModalOpen(false);
  };

  const handleEditOffer = (id: string) => {
    const offerToEdit = offers.find((offer) => offer.id === id);
    if (offerToEdit) {
      setSelectedMovie(offerToEdit.movieId);
      setWeek(offerToEdit.week);
      setPeriod(offerToEdit.period);
      setOfferContent(offerToEdit.content);
      setMethods(offerToEdit.methods);
      setImages(offerToEdit.images);
      setIsEditMode(true);
      setCurrentEditIndex(id);
      setIsModalOpen(true);
    }
  };

  const handleDeleteOffer = (id: string) => {
    setOffers((prevOffers) => prevOffers.filter((offer) => offer.id !== id));
  };

  const filteredMovies = movies.filter(
    (movie) => movie.status === "상영 예정" || movie.status === "상영중"
  );
  const filteredOffers = offers.filter((offer) => {
    const movie = movies.find((movie) => movie.id === offer.movieId);
    return (
      movie && movie.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div>
      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="영화명을 입력하세요"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />{" "}
        <AddButton onClick={() => setIsModalOpen(true)}>
          특전 사항 추가
        </AddButton>
      </SearchContainer>

      <OfferListContainer>
        {filteredOffers.map((offer) => (
          <OfferItem key={offer.id}>
            <StyledTitle>
              {movies.find((movie) => movie.id === offer.movieId)?.title}
            </StyledTitle>
            <Section style={{ borderLeft: "1px, solid , black" }}>
              제공 주차
              <br /> <ItemSection>{offer.week}</ItemSection>
            </Section>
            <Section>
              증정기간
              <br />
              <ItemSection>{offer.period}</ItemSection>
            </Section>
            <Section>
              특전 내용
              <br />
              <ItemSection> {offer.content}</ItemSection>
            </Section>

            <Section>
              증정방법
              <ItemSection>
                <div>
                  {offer.methods.map((method, i) => (
                    <li
                      key={`${offer.id}-method-${i}`} // 고유한 key 부여
                      style={{
                        textAlign: "left",
                        listStyle: "none",
                        marginBottom: "5px",
                        color: method.highlighted ? "red" : "black",
                      }}
                    >
                      {method.text}
                    </li>
                  ))}
                </div>
              </ItemSection>
            </Section>
            {offer.images && offer.images.length > 0 && (
              <ImageGrid>
                {offer.images.map((image, i) => (
                  <img
                    key={`${offer.id}-image-${i}`} // 고유한 key 부여
                    src={image}
                    alt={`특전 이미지 ${i + 1}`}
                    style={{ width: "140px", height: "140px" }}
                  />
                ))}
              </ImageGrid>
            )}
            <ButtonContainer>
              <EditButton onClick={() => handleEditOffer(offer.id)}>
                수정
              </EditButton>
              <Button onClick={() => handleDeleteOffer(offer.id)}>삭제</Button>
            </ButtonContainer>
          </OfferItem>
        ))}
      </OfferListContainer>

      <ModalContainer $isOpen={isModalOpen}>
        <ModalContent>
          <h2>특전 사항 추가</h2>
          <form onSubmit={handleSubmit}>
            <Select value={selectedMovie} onChange={handleSelectChange}>
              <option value="">영화를 선택하세요</option>
              {filteredMovies.map((movie) => (
                <option key={movie.id} value={movie.id}>
                  {movie.title}
                </option>
              ))}
            </Select>
            <Input
              value={week}
              onChange={(e) => handleInputChange(e, setWeek)}
              placeholder="제공 주차를 입력하세요"
            />
            <Input
              value={period}
              onChange={(e) => handleInputChange(e, setPeriod)}
              placeholder="증정 기간을 입력하세요"
            />
            <Input
              value={offerContent}
              onChange={(e) => handleInputChange(e, setOfferContent)}
              placeholder="특전 내용을 입력하세요"
            />
            <MethodContainer>
              <Input
                value={method}
                onChange={(e) => handleInputChange(e, setMethod)}
                placeholder="증정 방법을 입력하세요"
              />
              <Button type="button" onClick={handleAddMethod}>
                추가
              </Button>
              <MethodList>
                {methods.map((method, index) => (
                  <MethodListItem
                    key={`method-${index}`} // 고유한 key 부여
                    highlighted={method.highlighted}
                  >
                    {method.text}
                    <ButtonContainer>
                      <HighlightButton
                        type="button"
                        isHighlighted={method.highlighted}
                        onClick={() => handleHighlightMethod(index)}
                      >
                        강조
                      </HighlightButton>
                      <RemoveButton
                        type="button"
                        onClick={() => handleRemoveMethod(index)}
                      >
                        삭제
                      </RemoveButton>
                    </ButtonContainer>
                  </MethodListItem>
                ))}
              </MethodList>
            </MethodContainer>
            <ImageInput type="file" multiple onChange={handleImageChange} />
            <ImageBox>
              {images.map((image, index) => (
                <img
                  key={`preview-${index}`} // 고유한 key 부여
                  src={image}
                  alt={`미리보기 ${index + 1}`}
                  style={{ width: "100px", height: "100px", cursor: "pointer" }}
                  onClick={() => handleRemoveImage(index)} // 이미지 클릭 시 삭제
                />
              ))}
            </ImageBox>
            <ButtonContainer>
              <Button type="submit">저장</Button>
              <Button type="button" onClick={() => setIsModalOpen(false)}>
                취소
              </Button>
            </ButtonContainer>
          </form>
        </ModalContent>
      </ModalContainer>
    </div>
  );
};

export default AddOffer;
