import CameraCard from './components/CameraCard/CameraCard';
import { CameraStatus } from './types/camera';
import './App.css';

function App() {
  const cameraData = {
    id: '1',
    name: 'Камера парковки',
    ip: '192.168.1.101',
    address: 'Парковка, северная сторона',
    status: CameraStatus.NOT_WORKING,
    lastUpdate: new Date().toISOString(),
    errorHistory: [
      {
        id: '1',
        date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        description: 'Периодические потери сигнала, нестабильное соединение'
      },
      {
        id: '2',
        date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        description: 'Отсутствовало питание, заменен блок питания'
      },
      {
        id: '3',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'Загрязнен объектив, проведена чистка'
      },
      {
        id: '4',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'Обрыв сетевого кабеля, произведена замена'
      }
    ]
  };

  return (
    <div className="App">
      <CameraCard camera={cameraData} />
    </div>
  );
}

export default App;