import React, { useState } from 'react';
import './analytics.css';
import UserChart from '../../../components/charts/UserChart/UserChart';
import FileChart from '../../../components/charts/filleChart/FileChart';

export default function Analytics() {
  const [selectedChart, setSelectedChart] = useState('user');

  return (
    <div className='analyticsPage'>
      <div className="chartSelector">
        <button
          onClick={() => setSelectedChart('user')}
          className={selectedChart === 'user' ? 'active' : ''}
        >
          User Registrations
        </button>
        <button
          onClick={() => setSelectedChart('file')}
          className={selectedChart === 'file' ? 'active' : ''}
        >
          File Uploads
        </button>
      </div>

      <div className="chartContainer">
        {selectedChart === 'user' && <UserChart />}
        {selectedChart === 'file' && <FileChart />}
      </div>
    </div>
  );
}
