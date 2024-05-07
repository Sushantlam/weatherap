import React, { useEffect, useRef, useState } from 'react';
import { fetchWeatherApi } from 'openmeteo';
import { FaCloudMeatball, FaCloudMoon, FaCloudRain, FaLongArrowAltRight, FaMoon, FaUmbrella } from "react-icons/fa";
import { CiDroplet } from "react-icons/ci";
import { IoCloud, IoThunderstorm } from "react-icons/io5";
import { GoSun } from "react-icons/go";
import axios from "axios";
import "./App.css"

import Typed from 'typed.js';

const Try = () => {

  const [weatherData, setWeatherData] = useState([]);
  const [climateApi, setClimateApi] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [query, setQuery] = useState({
    lon: "",
    lat: " ",

  })
  const [loading, setLoading] = useState(false)
  const [temperatureUnit, setTemperatureUnit] = useState("fahrenheit");

  



  useEffect(() => {
    async function getLocation() {
      try {
        const responses = await axios.get("https://api.geoapify.com/v1/geocode/search?text=berlin&lang=en&limit=18&type=city&apiKey=631382853c464fdaa8992dc41b6fdad2");

        setWeatherData(responses.data.features);
      } catch (error) {
        console.error("Error fetching location data:", error);
      }
    }
    getLocation()
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % weatherData.length);
      setQuery(prevQuery => ({
        ...prevQuery,
        lon: weatherData[currentIndex]?.properties?.lon,
        lat: weatherData[currentIndex]?.properties?.lat
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, [weatherData, currentIndex]);


  //after the lon lat receive huncha hamle teslae condition ma update garne 

  useEffect(() => {
    const fetchWeatherData = async () => {
      const params = {
        latitude: query?.lat,
        longitude: query?.lon,
        current: ["temperature_2m", "relative_humidity_2m", "rain", "showers"],
        hourly: "temperature_2m",
        temperature_unit: temperatureUnit,
        daily: ["weather_code", "temperature_2m_max", "temperature_2m_min", "wind_speed_10m_max", "rain_sum"],
        wind_speed_unit: "mph",
        timezone: "Asia/Tokyo",
        forecast_days: 5
      };
      const url = "https://api.open-meteo.com/v1/forecast";


      try {
        const responses = await fetchWeatherApi(url, params);
        const response = responses[0]
        const utcOffsetSeconds = response.utcOffsetSeconds();
        const hourlyData = response.hourly();
        const dailyData = response.daily();
        const range = (start, stop, step) => Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set time to start of the day

        const startTimestamp = Number(hourlyData.time());
        const endTimestamp = Number(hourlyData.timeEnd());
        const intervalSeconds = 24 * 3600;

        const timeRange = range(startTimestamp, endTimestamp, intervalSeconds);

        const timeArray = timeRange.map(t => new Date((t + utcOffsetSeconds) * 1000));


        const hourlyTemperature = hourlyData.variables(0).valuesArray();

        const dailyTime = range(Number(dailyData.time()), Number(dailyData.timeEnd()), dailyData.interval()).map(
          (t) => new Date((t + utcOffsetSeconds) * 1000)
        );

        const dailyWeatherCode = dailyData.variables(0).valuesArray();

        const dailyTemperatureMax = dailyData.variables(1).valuesArray();

        const dailyTemperatureMin = dailyData.variables(2).valuesArray();

        const dailyWindSpeed = dailyData.variables(3).valuesArray();

        const dailyRain = dailyData.variables(4).valuesArray();


        setClimateApi({ rain_sum: dailyRain, wind_speed_10m_max: dailyWindSpeed, time: dailyTime, temperature_2m: hourlyTemperature, weather_code: dailyWeatherCode, temperature_2m_max: dailyTemperatureMax, temperature_2m_min: dailyTemperatureMin })


      } catch (error) {
        console.error("Error fetching location data:", error);
      }

    };

    fetchWeatherData();
  }, [query.lon, query.lat]);


  // Function to set temperature unit to Celsius
  const setToFahrenheit = () => {
    setTemperatureUnit("fahrenheit");
  };


  const setToCelsius = () => {
    setTemperatureUnit("celsius");
  };



  //its nothing but the track back of the text 
  const el = useRef(null);



  useEffect(() => {
    if (el.current) {

      const options = {
        strings: [weatherData[currentIndex]?.properties.formatted],
        typeSpeed: 150,
        backSpeed: 50,
        loop: true
      };

      const typedInstance = new Typed(el.current, options);


      return () => {
        typedInstance.destroy();
      };
    }
  }, [currentIndex]);



  //weather icon lae change garne according to the code
  const getWeatherIcon = (code, includeIcon = true) => {
    switch (code) {
      case 0:
        return includeIcon ? <GoSun className='sunIcon' /> : <div>Its sunny </div>;
      case 1:
      case 2:
      case 3:
      case 45:
      case 48:
      case 57:
      case 56:
        return includeIcon ? <IoCloud className='cloudIcon' size={20} /> : <div>Its mostly cloudy</div>
      // Add more cases for other weather codes and their corresponding icons

      case 51:
      case 55:
      case 53:
      case 65:
      case 61:
      case 63:
      case 66:
      case 67:
      case 81:
      case 80:
      case 82:
        return includeIcon ? <FaCloudRain className='cloudIcon' size={20} /> : <div>There is  raining</div>

      case 71:
      case 75:
      case 73:
      case 77:
      case 85:
      case 86:

        return includeIcon ? <FaCloudMeatball className='cloudIcon' size={20} /> : <div>Snowing on</div>
      case 95:
      case 96:
      case 99:
        return includeIcon ? <IoThunderstorm className='cloudIcon' size={20} /> : <div>Thunder around</div>

      default:
        return <div>No icon available</div>;
    }
  };



  return (
    <>

      {loading ? (<div>Loading</div>) : (<div className=' w-full h-[100vh]  '>

        <div className='w-[100vw] p-0 m-0 md:flex md:justify-center md:items-center md:gap-3 md:h-full md:max-w-[1340px] md:mx-auto md:px-4'>
          <div className='  flex flex-col w-[100vw] bg-blue-500 rounded-lg px-2 gap-8 md:min-w-[450px] md:w-auto'>

{/* track back ko lagi heading ho  */}

            {weatherData.length > 0 && (
              <div className=' text-center'>
                <p className=' text-sm text-gray-600 md:text-[16px] font-mono'>Right now <span ref={el} className=' font-bold text-black' ></span>, {climateApi && climateApi?.weather_code && climateApi?.weather_code[currentIndex] !== undefined && (getWeatherIcon(climateApi?.weather_code[currentIndex], false))}</p>
                <hr />
              </div>
            )}
  {/* today ko weather fetch  */}
           {loading ? (<div>Loading</div>) : (climateApi?.time?.slice(0, 1).map((time, index) => (
              <div className=' flex flex-col justify-between items-center gap-3  md:flex-row md:justify-between md:px-3 md:gap-5 md:items-center  md:pr-4' key={index}>
                <div className="sun-icon">

                  {climateApi && climateApi.weather_code && climateApi.weather_code[index] !== undefined && (getWeatherIcon(climateApi?.weather_code[index], true))}
                </div>
                <div className=' flex flex-col items-center justify-center gap-2'>
                  <p className='text-3xl'>{temperatureUnit === "fahrenheit" ? climateApi?.temperature_2m[index].toFixed(2) + " °F" : Math.abs(((climateApi?.temperature_2m[index] - 32) * 5 / 9)).toFixed(2) + " °C"}</p>

                  
                  <p className=' text-center text-sm font-sans text-gray-300'> {climateApi?.temperature_2m_max?.[index]?.toFixed(2)} / {climateApi?.temperature_2m_min?.[index]?.toFixed(2)}  </p>
            
                </div>

                <div className=' flex justify-between items-center gap-4 md:flex md:flex-col md:gap-2 jmd:ustify-between md:items-center'>

                  <div className=' flex justify-between gap-2 items-center'>
                    <FaUmbrella size={15} color='white' />
                    {climateApi?.rain_sum[currentIndex] !== null && climateApi?.rain_sum[currentIndex] !== undefined && (
  <p>
    {climateApi?.rain_sum[currentIndex]?.toFixed(2)  } <small>%</small>
  </p>
)}

                  </div>

                  <div className=' flex justify-between gap-2 items-center'>
                    <FaLongArrowAltRight size={25} color='white' />

                    <p>{climateApi?.wind_speed_10m_max[index]?.toFixed(2)} <small>mph</small></p>

                  </div>

                </div>



              </div>
            )))}

            <div className=' flex flex-col md:flex-row md:justify-between'>

     {/* next day haru lae data map gareko  */}
              {climateApi?.time?.slice(1, 10).map((time, index) => (
                <div className=' flex flex-col justify-between items-center gap-5 ' key={index}>
                  <div className="sun-icon">
                    {/* <p>{time}</p> */}

                    {climateApi && climateApi.weather_code && climateApi.weather_code[index] !== undefined && (getWeatherIcon(climateApi?.weather_code[index])
                    )}
                  </div>
                  <div className=' flex flex-col gap-2'>
                    <p className=' font-sans text-center text-gray-300'> {temperatureUnit === "fahrenheit" ? climateApi?.temperature_2m[index]?.toFixed(2) + " °F" : Math.abs(((climateApi?.temperature_2m[index] - 32) * 5 / 9))?.toFixed(2) + " °C"}</p>

                
                    <p className=' text-center text-sm font-sans text-gray-300'> {climateApi?.temperature_2m_max?.[index]?.toFixed(2)} / {climateApi?.temperature_2m_min?.[index]?.toFixed(2)}  </p>
                    <small className='text-center'>
  {index === 0 ? "Tom" : time.toLocaleDateString('en-US', { weekday: 'long' })}
</small>
                  </div>



                </div>

              ))}
            </div>

            {/* Buttons to switch temperature unit */}
            <div className='flex gap-6 justify-center items-center'>
              <button onClick={setToFahrenheit} className={`text-${temperatureUnit === "fahrenheit" ? "black" : "gray-300"}`}>F</button>
              <div className='border border-black h-6'></div> {/* Border */}
              <button onClick={setToCelsius} className={`text-${temperatureUnit === "celsius" ? "black" : "gray-300"}`}>C</button>
            </div>

          </div>
        </div>
      </div>)}
    </>

  )
}

export default Try