import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";

export default function App() {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    axios
      .get("https://crio-location-selector.onrender.com/countries")
      .then((response) => {
        const uniqueCountries = removeDuplicates(response.data);
        setCountries(uniqueCountries);
      })
      .catch((error) => {
        console.log("Error fetching countries: ", error);
      });
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      axios
        .get(
          `https://crio-location-selector.onrender.com/country=${selectedCountry}/states`
        )
        .then((response) => {
          const uniqueStates = removeDuplicates(response.data);
          setStates(uniqueStates);
          setSelectedState("");
          setCities([]);
          setSelectedCity("");
        })
        .catch((error) => {
          console.log("Error fetching states: ", error);
        });
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedCountry && selectedState) {
      axios
        .get(
          `https://crio-location-selector.onrender.com/country=${selectedCountry}/state=${selectedState}/cities`
        )
        .then((response) => {
          const uniqueCities = removeDuplicates(response.data);
          setCities(uniqueCities);
          setSelectedCity("");
        })
        .catch((error) => {
          console.log("Error fetching cities: ", error);
        });
    }
  }, [selectedCountry, selectedState]);

  const removeDuplicates = (data) => {
    const uniqueSet = new Set();
    const resultArray = [];

    for (const value of data) {
      if (uniqueSet.has(value.trim())) {
        resultArray.push("Duplicate");
      } else {
        uniqueSet.add(value.trim());
        resultArray.push(value.trim());
      }
    }

    return resultArray;
  };
  return (
    <div className="city-selector">
      <h1>Select Location</h1>
      <div className="dropdown-container">
        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="dropdown"
        >
          <option disabled value="">
            Select Country
          </option>
          {countries.map((country) => (
            <option key={country}>{country}</option>
          ))}
        </select>
        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          className="dropdown"
        >
          <option disabled value="">
            Select State
          </option>
          {states.map((state) => (
            <option key={state}>{state}</option>
          ))}
        </select>
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="dropdown"
        >
          <option disabled value="">
            Select City
          </option>
          {cities.map((city) => (
            <option key={city}>{city}</option>
          ))}
        </select>
      </div>

      {selectedCity && (
        <h2 className="result">
          You Selected {selectedCity}, {selectedState}, {selectedCountry}
        </h2>
      )}
    </div>
  );
}
