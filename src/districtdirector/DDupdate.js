import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DDupdate = (props) => {
  const [search, setSearch] = useState('');
  const [district, setDistrict] = useState([]);
  const [updateValues, setUpdateValues] = useState({}); // Use an object to store update values for each city
  const userDistrict=props.data.userDistrict;  
  const editname=props.data.userName;
  // Define the fetchData function
  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8000/ddretrieve',{params:{userDistrict}});
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
        console.log(editname);
      const response = await axios.post('http://localhost:8000/ddupdate', {
        cityId: city._id,
        newValue: updateValues[city._id] || '', // Use the specific updateValue for the city
        editname
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
          .map((city) => (
            <div
              key={city._id}
              style={{
                border: '1px solid black',
                padding: '10px',
                color: city.value === null ? 'red' : 'green',
              }}
            >
              {city.name} 
              {city.value === null && (
                <>
                  <input
                    type="text"
                    value={updateValues[city._id] || ''}
                    onChange={(e) =>
                      setUpdateValues({
                        ...updateValues,
                        [city._id]: e.target.value,
                      })
                    }
                  />
                  <button onClick={() => handleUpdate(city)}>
                    Update Value
                  </button>
                </>
              )}
            </div>
          ))}
      </center>
    </div>
  );
};

export default DDupdate;
