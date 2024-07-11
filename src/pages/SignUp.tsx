import { useState, FormEvent } from 'react';
import styled from 'styled-components';
import { supabase } from '../api/supabaseClient';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 300px;
`;

const Input = styled.input`
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 100%;
`;

const Button = styled.button`
  padding: 10px;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
  &:hover {
    background-color: #000;
  }
`;

const All = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 70vh;
`;

const Pages = styled.div`
  margin: 20px;
  border: 1px solid #ffffffd2;
  border-radius: 10px;
  padding: 30px;
  background-color: #ffffff2b;
  color: white;
  width: 20%;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 1.5em;
  font-weight: lighter;
  text-align: center;
`;

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [message, setMessage] = useState('');

  const handleSignUp = async (event: FormEvent) => {
    event.preventDefault();

    const { error } = await supabase
      .from('users')
      .insert([{ username, password, nickname }]);

    if (error) {
      setMessage(`회원가입 실패: ${error.message}`);
    } else {
      setMessage('회원가입 성공!');
    }
  };

  return (
    <Container>
      <All>
        <Pages>
          <h2>회원가입</h2>
          <Form onSubmit={handleSignUp}>
            <Input
              type="text"
              placeholder="아이디"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Input
              type="text"
              placeholder="닉네임"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
            />
            <Button type="submit">가입하기</Button>
          </Form>
          {message && <p>{message}</p>}
        </Pages>
      </All>
    </Container>
  );
};

export default SignUp;
