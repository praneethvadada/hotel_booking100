/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-props-no-spreading */
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../Components/Input/Input';
import Navbar from '../../Components/Navbar/Navbar';
import Sidebar from '../../Components/Sidebar/Sidebar';
import './addroom.scss';

function AddRoom({ inputs, title, type }) {
    const [inpVal, setInpVal] = useState({
        title: '',
        desc: '',
        price: '',
        maxPeople: '',
    });

    const [loading, setLoading] = useState(false);
    const [roomData, setRoomData] = useState([]);
    const [roomNums, setRoomNums] = useState([]);
    const [hotelId, setHotelId] = useState(null);
    const nevigate = useNavigate();

    useEffect(() => {
        const roomsss = async () => {
            try {
                const hotel = await axios.get('http://localhost:4000/api/hotels');
                console.log('Fetched hotel data:', hotel.data.message);
                setRoomData(hotel.data.message);
            } catch (err) {
                console.error('Error fetching hotel data:', err);
            }
        };

        roomsss();
    }, []);

    const handleChange = (e) => {
        const updatedVal = { ...inpVal, [e.target.name]: e.target.value };
        console.log('Input changed:', updatedVal);
        setInpVal(updatedVal);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Submit triggered');

        const rooms = roomNums.split(',').map((room) => ({ number: room.trim() }));
        const datas = {
            ...inpVal,
            roomNumbers: rooms,
        };

        console.log('Form data to submit:', datas);
        console.log('Hotel ID selected:', hotelId);

        try {
            setLoading(true);

            const response = await axios.post(`http://localhost:4000/api/room/${hotelId}`, datas);
            console.log('Room creation response:', response.data);

            setLoading(false);
            nevigate(`/rooms`);
        } catch (error) {
            console.error('Error while submitting room:', error);
            setLoading(false);
        }
    };

    return (
        <div className="add_new_room">
            <Sidebar />

            <div className="new_page">
                <Navbar />

                <div className="new_page_main">
                    <div className="new_page_content">
                        <form onSubmit={handleSubmit} className="form">
                            <div className="form_main">
                                {inputs.map((detail) => (
                                    <Input
                                        key={detail.id}
                                        {...detail}
                                        value={inpVal[detail.name]}
                                        onChange={handleChange}
                                    />
                                ))}

                                <div className="select_inp_title">
                                    <label>Select Rooms</label>
                                    <select
                                        id="hotelId"
                                        onChange={(e) => {
                                            console.log('Selected hotel ID:', e.target.value);
                                            setHotelId(e.target.value);
                                        }}
                                    >
                                        <option value="">-- Select a Hotel --</option>
                                        {roomData &&
                                            roomData.map((item) => (
                                                <option key={item._id} value={item._id}>
                                                    {item.name}
                                                </option>
                                            ))}
                                    </select>
                                </div>

                                <div className="select_inp_textarea">
                                    <label> Room Numbers</label>
                                    <input
                                        placeholder="222, 333, 444"
                                        onChange={(e) => {
                                            console.log('Room numbers input:', e.target.value);
                                            setRoomNums(e.target.value);
                                        }}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="submit_btn"
                                style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
                                disabled={loading}
                            >
                                {loading ? 'Loading..' : 'Submit'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddRoom;
