// import React, { useEffect, useRef, useState } from 'react';
// import { fetchWeatherApi } from 'openmeteo';
// import { FaCloudMoon, FaLongArrowAltRight, FaMoon, FaUmbrella } from "react-icons/fa";
// import { CiDroplet } from "react-icons/ci";
// import { GoSun } from "react-icons/go";
// import axios from "axios";
// import "./App.css"
// import Typed from 'typed.js'; 

// const WeatherComponent = () => {
//   const [weatherData, setWeatherData] = useState([]);
//   const [climateApi, setClimateApi] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [query,setQuery]= useState({
//     lon:"",
//     lat:" ",
    
//   })
//   const [temperatureUnit, setTemperatureUnit] = useState("fahrenheit");
//   const [highLow, setLowHigh] = useState([]);

//   // Function to fetch location data
//   async function getLocation (){
//     try {
//       const responses = await axios.get("https://api.geoapify.com/v1/geocode/search?text=berlin&lang=en&limit=18&type=city&apiKey=631382853c464fdaa8992dc41b6fdad2");
//       console.log(responses.data.features);
//       setWeatherData(responses.data.features);
//     } catch (error) {
//       console.error("Error fetching location data:", error);
//     }
//   }

//   useEffect(() => {
//     getLocation();
//   }, []);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentIndex(prevIndex => (prevIndex + 1) % weatherData.length);
//       setQuery(prevQuery => ({
//         ...prevQuery,
//         lon: weatherData[currentIndex]?.properties?.lon,
//         lat: weatherData[currentIndex]?.properties?.lat
//       }));
//     }, 5000);

//     return () => clearInterval(interval);
//   }, [weatherData, currentIndex]);

//   const el = useRef(null); // Create a ref to store the Typed instance

//   useEffect(() => {
//     if (el.current) {
//       // Initialize Typed instance when the component mounts
//       const options = {
//         strings: [weatherData[currentIndex]?.properties.formatted],
//         typeSpeed: 150,
//         backSpeed: 50,
//         loop: true
//       };
      
//       const typedInstance = new Typed(el.current, options);

//       // Clean up Typed instance when the component unmounts
//       return () => {
//         typedInstance.destroy();
//       };
//     }
//   }, [currentIndex]);
  
//   // Function to find highest and lowest temperature per day
//   function findHighestLowestTemperaturePerDay(temperatureArray, readingsPerDay) {
//     const numDays = temperatureArray.length / readingsPerDay;
    

//     for (let i = 0; i < numDays; i++) {
//       const startIndex = i * readingsPerDay;
//       const endIndex = (i + 1) * readingsPerDay;
//       const temperaturesOfDay = temperatureArray.slice(startIndex, endIndex);
//       const highestTemperatureOfDay = Math.max(...temperaturesOfDay);
//       const lowestTemperatureOfDay = Math.min(...temperaturesOfDay);
//       setLowHigh({ highest: highestTemperatureOfDay, lowest: lowestTemperatureOfDay });
//     }
//     console.log( "latitude",highLow);

   
//   }

//   useEffect(() => {
//     const fetchData = async () => {
//       const params = {
//         "latitude": query?.lat,
//         "longitude": query?.lon,
//         "hourly": ["temperature_2m", "precipitation", "cloud_cover"], // Include precipitation and cloud cover
//         "timezone": "Europe/Berlin",
//         "temperature_unit": temperatureUnit,
//         "wind_speed_unit": "mph",
//         "precipitation_unit": "mm", // Specify precipitation unit
//         "forecast_days": 5
//       };
//       const url = "https://api.open-meteo.com/v1/forecast";
//       try {
//         const responses = await fetchWeatherApi(url, params);
//         console.log(responses);
//         const response = responses[0];
//         console.error("response", response);
//         const utcOffsetSeconds = response.utcOffsetSeconds();
//         console.error("utcOffsetSeconds", utcOffsetSeconds);
//         const hourly = response.hourly();
//         console.error("hourly", hourly);
//         const startTimestamp = Number(hourly.time());
//         const endTimestamp = Number(hourly.timeEnd());
//         const intervalSeconds = 24 * 3600; // 24 hours in seconds

//         const timeRange = range(startTimestamp, endTimestamp, intervalSeconds);
//         console.error("timeRange", timeRange);
//         const timeArray = timeRange.map(t => new Date((t + utcOffsetSeconds) * 1000));
//         console.error("timeArray", timeArray);
//         const temperatureArray = hourly.variables(0).valuesArray();
//         console.error("temperatureArray", temperatureArray);
//         const precipitationArray = hourly.variables(1).valuesArray(); // Extract precipitation data
//         console.error("precipitationArray", precipitationArray);
//         const cloudCoverArray = hourly.variables(2).valuesArray(); // Extract cloud cover data
//         console.error("cloudCoverArray", cloudCoverArray);

//         // Set climate data including time, temperature, precipitation, and cloud cover
//         setClimateApi({ time: timeArray, temperature2m: temperatureArray, precipitation: precipitationArray, cloud_cover: cloudCoverArray });

//         // Find the highest and lowest temperatures for each day
//         const temperatureData = findHighestLowestTemperaturePerDay(temperatureArray, 24);
//         console.log("Highest and lowest temperatures for each day:", temperatureData);

//       } catch (error) {
//         console.error("Error fetching weather data:", error);
//       }
//     };

//     fetchData();
//   }, [query.lon, query.lat]);

//   console.error("Climate Weather Api", climateApi);

//   // Helper function to form time ranges
//   const range = (start, stop, step) =>
//     Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

//   // Function to set temperature unit to Fahrenheit
//   const setToFahrenheit = () => {
//     setTemperatureUnit("fahrenheit");
//   };

//   // Function to set temperature unit to Celsius
//   const setToCelsius = () => {
//     setTemperatureUnit("celsius");
//   };

//   // Render loading message if climateApi is not yet available
  // if (!climateApi) {
  //   return <div>Loading...</div>;
  // }

//   return (
//     <div className=' w-full h-[100vh] bg-green-85bc22 overflow-hidden'>

//     <div className='w-[100vw] p-0 m-0 md:flex md:justify-center md:items-center md:gap-3 md:h-full md:max-w-[1340px] md:mx-auto md:px-4'>
//       <div className=' bg-yellow-600 flex flex-col w-[100vw] gap-3 md:min-w-[450px] md:w-auto'>

     
     
//       {weatherData.length > 0 && (
//         <div className=' text-center'>
//           <p className=' text-sm text-gray-300 md:text-[16px] font-sans'>Right now <span ref={el} className=' font-bold text-black' ></span>, it is mostly </p> 
//           <hr />
//         </div>
//       )}

//       {climateApi?.time?.slice(0, 1).map((time, index) => (
//         <div className=' flex flex-col justify-between items-center gap-3  md:flex-row md:justify-between md:gap-5 md:items-center  md:pr-4' key={index}>
//           <div className="sun-icon">
//         <GoSun  className='sunIcon' size={20}  />
//       </div>
//           <div className=' flex flex-col items-center justify-center gap-2'>
//           <p className='text-3xl'>{temperatureUnit === "fahrenheit" ? climateApi.temperature2m[index].toFixed(2) + " °F" : Math.abs(((climateApi.temperature2m[index] - 32) * 5 / 9)).toFixed(2) + " °C"}</p>
          
//           {/* Render highest and lowest temperatures for each day */}
//           <p className=' text-xs text-gray-200'> {highLow?.highest.toFixed(2)}/ {highLow?.lowest.toFixed(2)}</p>
//           </div>

//           <div className=' flex justify-between items-center gap-4 md:flex md:flex-col md:gap-2 jmd:ustify-between md:items-center'>

//             <div className=' flex justify-between gap-2 items-center'>
//             <FaUmbrella size={15}  color='gray'/>
//             <p>15kph</p>
            

//             </div>
//             <div className=' flex justify-between gap-2 items-center'>
           
//             <CiDroplet />
//             <p>15kph</p>

//             </div>
//             <div className=' flex justify-between gap-2 items-center'>
//             <FaLongArrowAltRight size={25}  color='gray'/>
            
//             <p>15kph</p>

//             </div>

//           </div>

         
         
//         </div>
//       ))}

// <div className=' flex flex-col md:flex-row md:justify-between'>


// {climateApi?.time?.slice(1, 5).map((time, index) => (
//         <div className=' flex flex-col justify-between items-center gap-5 ' key={index}>
//           <div className="sun-icon">
//         <GoSun  className='sunIcon' style={{ height: '50px', width: '50px' }} />
//       </div>
//           <div className=' flex flex-col gap-2'>
//           <p className=' font-sans text-center text-gray-300'> {temperatureUnit === "fahrenheit" ? climateApi.temperature2m[index].toFixed(2) + " °F" : Math.abs(((climateApi.temperature2m[index] - 32) * 5 / 9)).toFixed(2) + " °C"}</p>
          
//           {/* Render highest and lowest temperatures for each day */}
//           <p className=' text-center text-sm font-sans text-gray-300'>  {highLow?.highest.toFixed(2)}/ {highLow?.lowest.toFixed(2)}</p>
//           </div>

         
         
//         </div>

//       ))}
//       </div>

//       {/* Buttons to switch temperature unit */}
//       <div className='flex gap-6 justify-center items-center'>
//   <button onClick={setToFahrenheit} className={`text-${temperatureUnit === "fahrenheit" ? "black" : "gray-300"}`}>F</button>
//   <div className='border border-black h-6'></div> {/* Border */}
//   <button onClick={setToCelsius} className={`text-${temperatureUnit === "celsius" ? "black" : "gray-300"}`}>C</button>
// </div>

// </div>
//       </div>
//       </div>
//   );
// };

// export default WeatherComponent;

import React from 'react'
import Try from './Try'

const App = () => {
  return (
    <div>
      <Try/>
    </div>
  )
}

export default App
