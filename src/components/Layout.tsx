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
  /* justify-content: space-between; */

  border-bottom: 1px solid #65656542;
`;
const Headerleft = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
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
  &:hover {
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
  &:hover {
    transform: scale(1.5);
  }
`;
const Btns = styled.div`
  /* margin-left: 10px; */
  margin-right: 10px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: lighter;
  transition: 0.3s;
  &:hover {
    transform: scale(1.1);
  }
`;

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();

  const gotohomeBtn = () => {
    navigate("/");
  };
  const gotoposterpage = () => {
    navigate("/poster");
  };
  const gotoOfferPage = () => {
    navigate("/offer");
  };
  const gotoNoticePage = () => {
    navigate("/notice");
  };
  const gotoBack = () => {
    navigate(-1);
  };
  return (
    <Container>
      <Header>
        <StyledDivDiv onClick={gotohomeBtn}>MEGABOX MAGOK</StyledDivDiv>
        <Headerleft>
          <Btns onClick={gotoBack}>뒤로가기</Btns>
          <Btns onClick={gotoposterpage}>대국전관리</Btns>
          <Btns onClick={gotoOfferPage}>특전관리</Btns>
          <Btns onClick={gotoNoticePage}>크루공지</Btns>
          <StyledButton onClick={gotohomeBtn}>
            <GoHome />
          </StyledButton>
        </Headerleft>
      </Header>
      <Main>{children}</Main>
      <Footer>© 여러분 화이팅</Footer>
    </Container>
  );
};

export default Layout;
