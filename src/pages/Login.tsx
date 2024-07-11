import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 300px;
`;

const Input = styled.input`
  margin-bottom: 20px;
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
  min-height: 70vh;
`;

const Pages = styled.div`
  height: 40vh;
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

const LogInText = styled.div`
  color: white;
  font-weight: bolder;
  font-size: 2.5rem;
  margin-bottom: 50px;
`;

const Message = styled.p`
  color: white;
  margin-top: 20px;
`;

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setMessage(''); // Clear previous messages

    const { error } = await login(username, password);

    if (error) {
      setMessage(`뭐하세요? ${error}`);
    } else {
      setMessage('로그인 성공!');
      setTimeout(() => {
        navigate('/main');
      }, 1000); // Delay navigation to let the animation complete
    }
  };

  return (
    <All>
      <Pages>
        <Form onSubmit={handleLogin}>
          <LogInText>LOGIN</LogInText>
          <Input
            type="text"
            placeholder="아이디를 입력하세요"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit">로그인</Button>
          {message && <Message>{message}</Message>}
        </Form>
      </Pages>
    </All>
  );
};

export default Login;
