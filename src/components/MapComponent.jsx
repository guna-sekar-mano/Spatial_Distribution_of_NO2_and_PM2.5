import React, { useEffect, useRef, useState } from "react";
import "@arcgis/core/assets/esri/themes/light/main.css";
import "@arcgis/core/assets/esri/css/main.css";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer";

const MapComponent = () => {
  const viewDivRef = useRef(null);
  const [showNO2, setShowNO2] = useState(true);
  const [showPM25, setShowPM25] = useState(true);
  const no2LayerRef = useRef(null);
  const pm25LayerRef = useRef(null);
  const mapRef = useRef(null);
  const viewRef = useRef(null);

  // === Initialize Map Only Once ===
  useEffect(() => {
    const initMap = async () => {
      try {
        // === API URLs ===
        const no2Url =
          "https://aqs.epa.gov/data/api/dailyData/byState?email=prasaathibe@gmail.com&key=cobaltwren71&param=42602&bdate=20240328&edate=20240329&state=06";
        const pm25Url =
          "https://aqs.epa.gov/data/api/dailyData/byState?email=prasaathibe@gmail.com&key=cobaltwren71&param=88101&bdate=20240328&edate=20240329&state=06";

        // === Fetch and Prepare NO2 Data ===
        const no2Response = await fetch(no2Url);
        const no2Result = await no2Response.json();

        const no2GeoJSON = {
          type: "FeatureCollection",
          features: no2Result.Data.filter(
            (item) => item.aqi !== null
          ).map((item) => ({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [item.longitude, item.latitude],
            },
            properties: {
              aqi: item.aqi,
              local_site_name: item.local_site_name,
              date_local: item.date_local,
            },
          })),
        };

        // === Fetch and Prepare PM2.5 Data ===
        const pm25Response = await fetch(pm25Url);
        const pm25Result = await pm25Response.json();

        const pm25GeoJSON = {
          type: "FeatureCollection",
          features: pm25Result.Data.filter(
            (item) => item.aqi !== null
          ).map((item) => ({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [item.longitude, item.latitude],
            },
            properties: {
              aqi: item.aqi,
              local_site_name: item.local_site_name,
              date_local: item.date_local,
            },
          })),
        };

        // Create GeoJSON Layers
        no2LayerRef.current = new GeoJSONLayer({
          url: URL.createObjectURL(
            new Blob([JSON.stringify(no2GeoJSON)], {
              type: "application/json",
            })
          ),
          title: "NO2 Data (AQI)",
          popupTemplate: {
            title: "{local_site_name}",
            content: "AQI: {aqi}<br/>Date: {date_local}",
          },
          renderer: {
            type: "heatmap",
            field: "aqi",
            colorStops: [
              { ratio: 0, color: "rgba(255, 255, 255, 0)" },
              { ratio: 0.2, color: "#deebf7" },
              { ratio: 0.4, color: "#9ecae1" },
              { ratio: 0.6, color: "#3182bd" },
              { ratio: 0.8, color: "#08519c" },
              { ratio: 1, color: "#08306b" },
            ],
          },
        });

        pm25LayerRef.current = new GeoJSONLayer({
          url: URL.createObjectURL(
            new Blob([JSON.stringify(pm25GeoJSON)], {
              type: "application/json",
            })
          ),
          title: "PM2.5 Data (AQI)",
          popupTemplate: {
            title: "{local_site_name}",
            content: "AQI: {aqi}<br/>Date: {date_local}",
          },
          renderer: {
            type: "heatmap",
            field: "aqi",
            colorStops: [
              { ratio: 0, color: "rgba(255, 255, 255, 0)" },
              { ratio: 0.2, color: "#fee5d9" },
              { ratio: 0.4, color: "#fcae91" },
              { ratio: 0.6, color: "#fb6a4a" },
              { ratio: 0.8, color: "#de2d26" },
              { ratio: 1, color: "#a50f15" },
            ],
          },
        });

        // === Create Map and MapView ===
        mapRef.current = new Map({
          basemap: "gray-vector",
        });

        viewRef.current = new MapView({
          container: viewDivRef.current,
          map: mapRef.current,
          zoom: 7,
          center: [-116.85841, 33.92086],
        });

        // Add Initial Layers
        if (showNO2) mapRef.current.add(no2LayerRef.current);
        if (showPM25) mapRef.current.add(pm25LayerRef.current);
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    };

    initMap();

    return () => {
      if (viewRef.current) {
        viewRef.current.destroy();
      }
    };
  }, []);

  // === Add/Remove Layers without Reloading ===
  useEffect(() => {
    if (mapRef.current) {
      if (showNO2) {
        if (!mapRef.current.layers.includes(no2LayerRef.current)) {
          mapRef.current.add(no2LayerRef.current);
        }
      } else {
        mapRef.current.remove(no2LayerRef.current);
      }

      if (showPM25) {
        if (!mapRef.current.layers.includes(pm25LayerRef.current)) {
          mapRef.current.add(pm25LayerRef.current);
        }
      } else {
        mapRef.current.remove(pm25LayerRef.current);
      }
    }
  }, [showNO2, showPM25]);

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      {/* Checkbox for Layer Selection */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          backgroundColor: "white",
          padding: "10px",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          zIndex: 999,
        }}
      >
        <label>
          <input
            type="checkbox"
            checked={showNO2}
            onChange={() => setShowNO2(!showNO2)}
          />
          Show NO2
        </label>
        <br />
        <label>
          <input
            type="checkbox"
            checked={showPM25}
            onChange={() => setShowPM25(!showPM25)}
          />
          Show PM2.5
        </label>
      </div>

      {/* Map Container */}
      <div
        id="viewDiv"
        ref={viewDivRef}
        style={{ width: "100%", height: "95vh" }}
      />

      {/* Legend */}
      <div
        style={{
          position: "absolute",
          bottom: "100px",
          right: "10px",
          backgroundColor: "white",
          padding: "8px",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          zIndex: 999,
        }}
      >
        <strong>Legend</strong>
        <div style={{ marginTop: "5px" }}>
          <div
            style={{
              width: "15px",
              height: "15px",
              backgroundColor: "#08306b",
              display: "inline-block",
              marginRight: "5px",
            }}
          />
          NO2 Data
        </div>
        <div style={{ marginTop: "5px" }}>
          <div
            style={{
              width: "15px",
              height: "15px",
              backgroundColor: "#a50f15",
              display: "inline-block",
              marginRight: "5px",
            }}
          />
          PM2.5 Data
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
