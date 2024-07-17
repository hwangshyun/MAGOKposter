import React, { useState } from "react";
import styled from "styled-components";

const All = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 70vh;
`;
const NoticeList = styled.div`
  display: flex;

`;

const Notice: React.FC = () => {
  const [createModal , setCreateModal] = useState(false);
  return (
    <All>
      <button onClick={()=>{setCreateModal(true)}}>작성하기</button>
      <div>{createModal &&<div>
        안녕하세요 <button onClick={()=>{setCreateModal(false)}}>닫기</button></div>}
        <NoticeList>전체</NoticeList>
        <NoticeList>Box</NoticeList>
        <NoticeList>Con</NoticeList>
        <NoticeList>Usher</NoticeList>
      </div>
    </All>
  );
};

export default Notice;
