import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Transfer from './districtdirector/Transfer';
import PendingList from './districtdirector/PendingList';
import ApprovalList from './districtdirector/ApprovalList';
import DDupdate from './districtdirector/DDupdate';

const Admin = () => {
  const [search, setSearch] = useState('');
  const [updateTimeFilter, setUpdateTimeFilter] = useState('');
  const [district, setDistrict] = useState([]);
  const [checkedRecords, setCheckedRecords] = useState({});
  const [selectAll, setSelectAll] = useState(false);

  const location = useLocation();
  const userDistrict = location.state.district;
  const userName = location.state.name;

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8000/adminretrieve', {
        params: { userDistrict },
      });
      setDistrict(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdate = async (city) => {
    try {
      const response = await axios.post('http://localhost:8000/adminupdate', {
        cityId: city._id,
        newValue: city.value,
      });

      if (response.data.success) {
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
        fetchData();
      } else {
        console.error('Update failed.');
      }
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  const handleCheckboxChange = (cityId) => {
    setCheckedRecords((prevCheckedRecords) => ({
      ...prevCheckedRecords,
      [cityId]: !prevCheckedRecords[cityId],
    }));
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);

    const filteredAndSortedCities = district
      .filter(
        (city) =>
          city.name.includes(search) && city.updatetime.includes(updateTimeFilter)
      )
      .sort((a, b) => a.name.localeCompare(b.name) || a.updatetime.localeCompare(b.updatetime));

    const newCheckedRecords = {};

    filteredAndSortedCities.forEach((city) => {
      newCheckedRecords[city._id] = !selectAll;
    });

    setCheckedRecords(newCheckedRecords);
  };

  const handleBulkAction = async (action) => {
    const selectedCityIds = Object.keys(checkedRecords).filter(
      (cityId) => checkedRecords[cityId]
    );

    if (selectedCityIds.length === 0) {
      console.log('No records selected');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:8000/admin${action}`, {
        cityIds: selectedCityIds,
      });

      if (response.data.success) {
        fetchData();
      } else {
        console.error(`${action} failed.`);
      }
    } catch (error) {
      console.error(`Error ${action} data:`, error);
    }
  };

  const handleUpdateTimeFilter = (e) => {
    setUpdateTimeFilter(e.target.value);
  };

  return (
    <div>
      <center>
        <h4>Enter the city</h4>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="City Name"
        />
        <br />

        <input
          type="text"
          value={updateTimeFilter}
          onChange={handleUpdateTimeFilter}
          placeholder="Update Time"
        />
        <br />

        <input
          type="checkbox"
          checked={selectAll}
          onChange={handleSelectAll}
        />
        <label>Select All</label>

        {district
          .filter(
            (city) =>
              city.name.includes(search) &&
              city.updatetime.includes(updateTimeFilter)
          )
          .sort((a, b) => a.name.localeCompare(b.name) || a.updatetime.localeCompare(b.updatetime))
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
                <input
                  type="checkbox"
                  checked={checkedRecords[city._id] || false}
                  onChange={() => handleCheckboxChange(city._id)}
                />
                {city.name} {city.value} {city.finalvalue} {city.updatetime}

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

        <div>
          <button onClick={() => handleBulkAction('submitall')}>
            Submit Selected
          </button>
          <button onClick={() => handleBulkAction('cancelall')}>
            Cancel Selected
          </button>
        </div>

        <Transfer />
        <PendingList data={userDistrict} />
        <ApprovalList data={userDistrict} />
        <DDupdate data={{ userDistrict, userName }} />
      </center>
    </div>
  );
};

export default Admin;
