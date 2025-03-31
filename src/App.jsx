// App.jsx
import React from 'react';
import MapComponent from './components/MapComponent';
import './App.css'

const App = () => {
  return (
    <div>
      <h2 id="text-center">ArcGIS Map with GeoJSON Layer</h2>
      <MapComponent />
    </div>
  );
};

export default App;
