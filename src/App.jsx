// App.jsx
import React from 'react';
import MapComponent from './components/MapComponent';
import './App.css'

const App = () => {
  return (
    <div>
      <h2 id="text-center">Spatial_Distribution_of_NO2_and_PM2.5</h2>
      <MapComponent />
    </div>
  );
};

export default App;
