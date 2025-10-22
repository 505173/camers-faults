import React, { useState } from 'react';
import Auth from './components/Auth';
// import CameraTable from './components/CameraChecker';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({ username: '', password: '' });

  const handleLogin = (username: string, password: string) => {


    console.log('Логин:', { username, password });
    setUser({ username, password });
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser({ username: '', password: '' });
  };

  return (
    <div className="App">
      {isAuthenticated ? (
        <div>
          <div className="user-header">
            <span>Пользователь: {user.username}</span>
            <button onClick={handleLogout} className="logout-button">
              Выйти
            </button>
          </div>
          {/* <CameraTable /> */}
        </div>
      ) : (
        <Auth onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;