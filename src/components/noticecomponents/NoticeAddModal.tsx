// import React, { useState } from "react";
import styled from "styled-components";

const ModalBackGround = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const NoticeAddModal = () => {
  return (
    <ModalBackGround>
      <div>
      <option value="">영화를 선택하세요</option>
        <input type="text" placeholder="작성자를 입력하세요" />
        <input type="text" placeholder="제목을 작성하세요" />
        <input type="text" placeholder="내용을 입력하세요" />
      </div>
    </ModalBackGround>
  );
};

export default NoticeAddModal;
