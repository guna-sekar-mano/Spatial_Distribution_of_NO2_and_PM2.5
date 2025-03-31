// App.jsx
import React from 'react';
import MapComponent from './components/MapComponent';
import './App.css'

const App = () => {
  return (
    <div>
      <h2 id="text-center">Spatial Distribution of NO2 and PM2.5</h2>
      <MapComponent />
    </div>
  );
};

export default App;
