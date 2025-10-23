import React, { useState } from 'react';
import styles from './CameraChecker.module.css'; 
import { useNavigate } from 'react-router-dom';

interface Camera {
  id: number;
  name: string;
  ip: string;
  status: 'online' | 'offline' | 'recording';
}

const CameraChecker: React.FC = () => { 
  const navigate = useNavigate();
  
  const [cameras] = useState<Camera[]>([
    {
      id: 1,
      name: 'INS_046',
      ip: '89.208.118.174',
      status: 'online'
    },
    {
      id: 2,
      name: 'INS_046',
      ip: '89.208.118.174',
      status: 'recording'
    },
    {
      id: 3,
      name: 'INS_046',
      ip: '89.208.118.174',
      status: 'offline'
    }
  ]);

  const [statusFilter, setStatusFilter] = useState<string>('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return '#4CAF50';
      case 'offline': return '#FFFF00';
      case 'recording': return '#FF0000';
      default: return '#757575';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'Работает';
      case 'offline': return 'Работает с перебоями';
      case 'recording': return 'Не работает';
      default: return status;
    }
  };

  const toCard = () => {
    navigate("/card");
  };

  const toEmule = () => {
    navigate("/emule");
  };

  const filteredCameras = cameras.filter(camera => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'works' && camera.status === 'online') return true;
    if (statusFilter === 'not-works' && camera.status === 'recording') return true;
    if (statusFilter === 'interruptions' && camera.status === 'offline') return true;
    return false;
  });

  return (
    <div className={styles.cameraTableContainer}>
      <div className={styles.cameraTableHeader}>
        <h1>Камеры</h1>
        <div className={styles.filterContainer}></div>
        <button 
          className={styles.emulatorButton}
          onClick={toEmule}
        >
          Эмулятор
        </button>
      </div>
    

      <div className={styles.cameraTable}>
        <div className={styles.tableHeader}>
          <div className={styles.headerCell}>Название</div>
          <div className={styles.headerCell}>IP</div>
          <div className={styles.headerCell}>Статус: 
        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="all">Все</option>
          <option value="works">Работает</option>
          <option value="not-works">Не работает</option>
          <option value="interruptions">Работает с перебоями</option>
        </select>
      </div>
        </div>
        
        <div className={styles.tableBody}>
          {filteredCameras.map((camera) => (
            <div key={camera.id} className={styles.tableRow}>
              <div className={styles.tableCell}>{camera.name}</div>
              <div className={styles.tableCell}>{camera.ip}</div>
              <div className={styles.statusCell}>
                <span 
                  className={styles.statusIndicator}
                  style={{ backgroundColor: getStatusColor(camera.status) }}
                ></span>
                {getStatusText(camera.status)}
              </div>
              <div className={styles.actionsCell}>
                <button 
                  className={styles.detailsButton}
                  onClick={toCard}
                >
                  Подробнее
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CameraChecker;