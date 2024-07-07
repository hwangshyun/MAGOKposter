
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const All = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 70vh; /* 화면의 전체 높이를 차지하도록 설정 */
`;
const Pages = styled.div`
  margin: 20px;
  border: 1px solid #ffffffd2;
  border-radius: 10px;
  padding: 30px;
  background-color: #ffffff2b;
  color: white;
  width: 20%;
  height: 80%; /* 높이를 50%로 변경하여 더 길어지도록 설정 */
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer; /* 클릭 가능한 포인터 추가 */
  font-size: 1.5em; /* 텍스트 크기 증가 */
  font-weight: lighter;
  text-align: center; /* 텍스트 가운데 정렬 */
  transition: 0.5s;
  &:hover {
    transform: scale(1.05);
    content: '뒤로가자';
    background-color: #ffffff4b;
    border: 1px solid #ffffff;
    font-size: 1.75em;
  }
`;
const Notice = () => {
  const navigate = useNavigate();
  const goBack = () => {
    navigate("/");
  };
  return (
    <All>
      <Pages onClick={goBack}>
        만드는중...
      </Pages>
    </All>
  );
};

export default Notice;
