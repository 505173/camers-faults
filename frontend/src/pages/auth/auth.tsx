import React, { useState } from 'react';
import Auth from '../../components/auth/Auth';
import './auth.module.css';

function Authorization() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({ username: '', password: '' });

  const handleLogin = (username: string, password: string) => {


    console.log('Логин:', { username, password });
    setUser({ username, password });
    setIsAuthenticated(true);
  };



  return (
    <div className="Auth">
      {isAuthenticated ? (
        <div>
          <div className="user-header">
            <span>Пользователь: {user.username}</span>
          </div>
        
        </div>
      ) : (
        <Auth onLogin={handleLogin} />
      )}
    </div>
  );
}

export default Authorization;