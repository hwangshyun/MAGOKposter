import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

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
`;

const Button = styled.button`
  padding: 10px;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
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
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5em;
  font-weight: lighter;
  text-align: center;
`;

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    const { error } = await login(username, password);

    if (error) {
      setMessage(`뭐하세요? ${error}`);
    } else {
      setMessage('로그인 성공!');
      navigate('/main');
    }
  };

  return (
    <Container>
      <All>
        <Pages>
        <h2>로그인</h2>
          <Form onSubmit={handleLogin}>
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
            <Button type="submit">로그인</Button>
          </Form>
          {message && <p>{message}</p>}
        </Pages>
      </All>
    </Container>
  );
};

export default Login;
