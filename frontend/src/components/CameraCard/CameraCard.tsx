import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera } from '../../types/camera';
import CameraStatusBadge from '../CameraStatusBadge/CameraStatusBadge';
import styles from './CameraCard.module.css';

interface CameraCardProps {
  camera: Camera;
}

const CameraCard: React.FC<CameraCardProps> = ({ camera }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/check", { replace: true }); 
  };

  return (
    <div className={styles.card}>
      {/* Кнопка назад */}
      <div className={styles.backButtonContainer}>
        <button 
          className={styles.backButton}
          onClick={handleBack}
        >
          ← Назад
        </button>
      </div>

      <div className={styles.header}>
        <h1 className={styles.title}>{camera.name}</h1>
        <CameraStatusBadge status={camera.status} />
      </div>
      
      <div className={styles.mainInfo}>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <strong className={styles.label}>IP адрес:</strong>
            <span className={styles.value}>{camera.ip}</span>
          </div>
          
          <div className={styles.infoItem}>
            <strong className={styles.label}>Адрес:</strong>
            <span className={styles.value}>{camera.address}</span>
          </div>
          
          <div className={styles.infoItem}>
            <strong className={styles.label}>Последнее обновление:</strong>
            <span className={styles.value}>
              {new Date(camera.lastUpdate).toLocaleString('ru-RU')}
            </span>
          </div>
        </div>
      </div>

      {/* История ошибок */}
      <div className={styles.errorHistory}>
        <h2 className={styles.historyTitle}>История ошибок</h2>
        
        {camera.errorHistory.length > 0 ? (
          <div className={styles.errorList}>
            {camera.errorHistory.map((error) => (
              <div key={error.id} className={styles.errorItem}>
                <div className={styles.errorDate}>
                  {new Date(error.date).toLocaleString('ru-RU')}
                </div>
                <div className={styles.errorDescription}>{error.description}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.noHistory}>
            История ошибок отсутствует
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraCard;