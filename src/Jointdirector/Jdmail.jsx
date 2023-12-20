import React, { useEffect, useState } from 'react';
import axios from 'axios';
import emailjs from 'emailjs-com';
const Jdmail = () => {
  const [data, setData] = useState([]);
    const [allwells, setAllwells] = useState('');
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/getalldd');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchData();
  }, []);
  const fetchallwell = async (userDistrict) => {
    try {
      const response = await axios.get('http://localhost:8000/pendinglist',{params:{userDistrict}});
      console.log(response.data);
      const extractedValues = response.data.map(item => `${item.name}`);
        console.log(extractedValues);
      // Join the extracted values into a single string, separated by a newline character
      const concatenatedString = extractedValues.join('\n');
      //  console.log(concatenatedString);
      // Update the state with the concatenated string 
        return concatenatedString;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const sendEmail = (email,username,rcount, message) => {
    emailjs
      .send('service_c17ljwf', 'template_1r4wb0q', { email,username,rcount, message }, 'cZVSDv5SxvThNvQw0')
      .then(
        (result) => {
          console.log(result.text);
          // You can add further logic here, such as displaying a success message to the user.
        },
        (error) => {
          console.log(error.text);
          // Handle errors, e.g., display an error message to the user.
        }
      );
  };


  const handleSubmit = (username, email,district,rcount) => {
    // Your submit logic here
    fetchallwell(district).then((message)=>{
        sendEmail(email,username,rcount, message);
    });
  };

  return (
    <div>
      <h1>Data:</h1>
      <ul>
        {data.map((item, index) => (
          <li key={index}>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <p style={{ marginRight: '10px' }}>Username: {item.username}</p>
              <p style={{ marginRight: '10px' }}>RCount: {item.rcount}</p>
              <p>Email: {item.email}</p>
              <button onClick={() => handleSubmit(item.username, item.email,item.district,item.rcount)}>Send Mail</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Jdmail;
