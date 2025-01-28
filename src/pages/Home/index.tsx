import { useEffect, useState } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
  setToken: (token: string) => void
  token: string
}
function Home({token, setToken}: LoginProps) {
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  async function postLogin() {
    setError('');
    api.post('/login', {
      email,
      password
    }).then((response) => {
      setToken(response.data.accessToken);
      navigate('/journey');
    }).catch((error) => {
      setError(error.response.data.message);
    });
  };

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      if (token != "") {
        navigate('/journey');
      }
    }
  }, [token]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
      <div className='flex justify-center mb-3'>
        <img src="eva.avif" alt="Logo" className="w-32" />
      </div>
        <form >
          <div className="mb-4">
            <label className="block text-blue-500 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-blue-500 text-sm font-bold mb-2" htmlFor="password">
              Senha
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          {error !== '' && <p className="text-red-500">{error}</p>}
          <button
            onClick={(e) => {
              e.preventDefault();
              postLogin();
            }}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline float-right"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}

export default Home;