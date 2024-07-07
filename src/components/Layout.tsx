import React from "react";
import styled from "styled-components";
import { GoHome } from "react-icons/go";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  margin: 0;
`;

const Header = styled.header`
  background-color: #ffffff1b;
  padding: 10px 20px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;

  border-bottom: 1px solid #65656542;
`;

const Footer = styled.footer`
  background-color: #ffffff1b;
  padding: 10px;
  color: white;
  text-align: center;
  font-size: small;
  margin-top: auto;
`;

const Main = styled.main`
  flex: 1;
  padding: 20px;
`;

const StyledDivDiv = styled.div`
  cursor: pointer;
  margin: 0;
  font-size: 1.5em;
  font-weight: bold;
  transition: 0.3s;
  &:hover{
    transform: scale(1.05);
  }
`;

const StyledButton = styled.button`
  background: none;
  border: none;
  font-size: 1.4em;
  color: white;
  cursor: pointer;
  margin-top: 5px;
  transition: 0.3s;
  &:hover{
    transform: scale(1.5);
  }
`;

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();

  const gotohomeBtn = () => {
    navigate("/");
  };

  return (
    <Container>
      <Header>
        <StyledDivDiv onClick={gotohomeBtn}>MEGABOX MAGOK</StyledDivDiv>
        <StyledButton onClick={gotohomeBtn}>
          <GoHome />
        </StyledButton>
      </Header>
      <Main>{children}</Main>
      <Footer>© 여러분 화이팅</Footer>
    </Container>
  );
};

export default Layout;
