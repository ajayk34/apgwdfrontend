import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Admin = () => {
  const [search, setSearch] = useState('');
  const [district, setDistrict] = useState([]);

  // Define the fetchData function
  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8000/welcome');
      setDistrict(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Fetch data from the server when the component mounts
  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdate = async (city) => {
    try {
      const response = await axios.post('http://localhost:8000/adminupdate', {
        cityId: city._id,
        newValue: city.value, // Use the specific updateValue for the city
      });

      if (response.data.success) {
        // Refresh the data after a successful update
        fetchData();
      } else {
        console.error('Update failed.');
      }
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  const handleCancel = async (city) => {
    try {
      const response = await axios.post('http://localhost:8000/admincancel', {
        cityId: city._id,
      });

      if (response.data.success) {
        // Refresh the data after a successful update
        fetchData();
      } else {
        console.error('Update failed.');
      }
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  return (
    <div>
      <center>
        <h4>Enter the city</h4>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        /><br />

        {district
          .filter((city) => city.name.includes(search))
          .map((city) => {
            const isRed = city.finalvalue === null && city.value !== null;

            return (
              <div
                key={city._id}
                style={{
                  border: '1px solid black',
                  padding: '10px',
                  color: isRed ? 'red' : 'green',
                }}
              >
                {city.name} {city.value} {city.finalvalue}

                {/* Input for updating value */}
                {isRed && (
                  <>
                    <button onClick={() => handleUpdate(city)}>
                      Submit Value
                    </button>
                    <button onClick={() => handleCancel(city)}>
                      Cancel Value
                    </button>
                  </>
                )}
              </div>
            );
          })}
      </center>
    </div>
  );
};

export default Admin;
