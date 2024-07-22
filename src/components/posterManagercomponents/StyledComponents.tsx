import styled from "styled-components";

export const CenterSection = styled.div`
  justify-content: center;
`;

export const AllSection = styled.div`
  display: flex;
  justify-content: center;
`;

export const StyledSection = styled.div`
  display: flex;
  width: 38%;
  margin-top: 10px;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

export const StyledHeader = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  color: white;
  font-weight: lighter;
`;

export const StyledList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

export const StyledListItem = styled.li`
  background-color: #f9f9f9b1;
  margin: 10px 0;
  padding: 10px;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const StyeldComingsoon = styled.div`
  width: 50%;
  background-color: "#ffea32f";
  border: 1px solid #ffffff6f;
  padding: 8px;
  border-radius: 10px;
  margin-right: 8px;
`;

export const StyeldNowShowing = styled.div`
  width: 50%;
  background-color: #37954d1e;
  border: 1px solid #ffffff6f;
  padding: 10px;
  border-radius: 10px;
`;

export const MovieTitle = styled.div`
  font-size: 0.8em;
  font-weight: 500;
  margin-bottom: 2px;
`;

export const MovieInfo = styled.div`
  font-size: 0.7em;
`;

export const StyledH2 = styled.h2`
  font-weight: lighter;
  margin: 20px 0px;
`;

export const PosterLocation = styled.div`
  width: 40%;
  margin-top: 20px;
  padding: 0px 0px 20px 10px;
  border: 1px solid #ffffff6f;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #5b5b5b55;
  align-items: center;
`;

export const StyledInput = styled.input<{
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

export const StyledButton = styled.button`
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

export const ModalOverlay = styled.div`
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

export const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 40%;
  height: 80%;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
`;

export const Input = styled.input`
  margin-bottom: 10px;
  width: 130px;
  padding: 4px;
  border-radius: 4px;
  border: 1px solid #ddd;
`;

export const AddButton = styled.button`
  background-color: #4caf50;
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

export const RemoveButton = styled.button`
  background-color: #f44336;
  border: none;
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
