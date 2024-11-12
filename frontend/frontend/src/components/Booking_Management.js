import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../styles/booking_management.css";
import { useNavigate } from 'react-router-dom';
const Booking_Management = () => {
    const [bookings, setBookings] = useState([]);
    const [currentBooking, setCurrentBooking] = useState(
        null
    );
    const [newBooking, setNewBooking] = useState({
        customer_name: '',
        customer_email: '',
        check_in_date: '',
        check_out_date: '',
        total_amount: '',
        amount_per_day: '',
        room: { room_type: "", room_number: "" }
    });

    const [searchTerm, setSearchTerm] = useState("");
    const [errorMessage, setErrorMessage] = useState('');
    const [availableRoomNumbers, setAvailableRoomNumbers] = useState([]);
    const [roomTypes, setRoomTypes] = useState([]);
    useEffect(() => {
        fetchBookings();
        fetchRoomType();
        fetchAvailableRoomNumbers()
    }, []);
    useEffect(() => {
        if (currentBooking?.room?.room_type) {
            fetchAvailableRoomNumbers(currentBooking.room.room_type);
        }
    }, [currentBooking?.room?.room_type]);  // This will trigger only when the room type changes


    useEffect(() => {
        if (newBooking.check_in_date && newBooking.check_out_date && newBooking.amount_per_day) {
            setNewBooking(prev => ({
                ...prev,
                total_amount: calculateTotalAmount(prev.check_in_date, prev.check_out_date, prev.amount_per_day)
            }));
        }
    }, [newBooking.check_in_date, newBooking.check_out_date, newBooking.amount_per_day]);

    useEffect(() => {
        if (currentBooking && currentBooking.check_in_date && currentBooking.check_out_date && currentBooking.amount_per_day) {
            setCurrentBooking(prev => ({
                ...prev,
                total_amount: calculateTotalAmount(prev.check_in_date, prev.check_out_date, prev.amount_per_day)
            }));
        }
    }, [currentBooking?.check_in_date, currentBooking?.check_out_date, currentBooking?.amount_per_day]);

    // useEffect(() => {
    //     if (currentBooking?.check_in_date && currentBooking?.check_out_date && currentBooking?.room?.room_type) {
    //         const selectedRoom = availableRoomNumbers.find(room => room.room_type === currentBooking.room.room_type);
    //         if (selectedRoom) {
    //             setCurrentBooking(prev => ({
    //                 ...prev,
    //                 amount_per_day: selectedRoom.price,
    //                 total_amount: calculateTotalAmount(prev.check_in_date, prev.check_out_date, selectedRoom.price)
    //             }));

    //         }
    //     }
    // }, [currentBooking?.check_in_date, currentBooking?.check_out_date, currentBooking?.room_type, availableRoomNumbers]);

    const fetchBookings = async () => {
        try {
            const response = await axios.get('http://localhost:8000/get_bookings/');
            setBookings(response.data);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    };
    // Fetch available room numbers based on room type


    const fetchAvailableRoomNumbers = async (selectedRoomType) => {
        try {
            const response = await axios.get(`http://localhost:8000/get_rooms/`);
            const roomList = response.data;

            const filteredRooms = roomList.filter(room => room.room_type === selectedRoomType);

            const availableRoomNumbers = filteredRooms.map(room => room.room_number);

            var avaiRooms = [...new Set(availableRoomNumbers)];
            setAvailableRoomNumbers(avaiRooms);
            console.log(availableRoomNumbers);
            if (filteredRooms.length > 0) {
                setNewBooking(prev => ({
                    ...prev,
                    amount_per_day: filteredRooms[0].price,
                    total_amount: calculateTotalAmount(prev.check_in_date, prev.check_out_date, filteredRooms[0].price)
                }));
            }

        } catch (error) {
            console.error('Error fetching room numbers:', error);
        }
    };

    const fetchEditAvailableRoomNumbers = async (selectedRoomType) => {
        try {
            const response = await axios.get(`http://localhost:8000/get_rooms/`);
            const roomList = response.data;

            const filteredRooms = roomList.filter(room => room.room_type === selectedRoomType);

            const availableRoomNumbers = filteredRooms.map(room => room.room_number);

            var avaiRooms = [...new Set(availableRoomNumbers)];
            setAvailableRoomNumbers(avaiRooms);
            console.log(availableRoomNumbers);
            if (filteredRooms.length > 0) {
                setCurrentBooking(prev => ({
                    ...prev,
                    room: { ...prev.room, room_number: filteredRooms[0].room_number },
                    amount_per_day: filteredRooms[0].price,
                    total_amount: calculateTotalAmount(prev.check_in_date, prev.check_out_date, filteredRooms[0].price)
                }));
            }

        } catch (error) {
            console.error('Error fetching room numbers:', error);
        }
    };


    const fetchRoomType = async () => {
        const response = await axios.get(`http://localhost:8000/get_rooms/`);
        var uniqueRooms = [];
        for (var room of response.data) {
            if (!uniqueRooms.includes(room.room_type)) {
                uniqueRooms.push(room.room_type)
            }
        }
        setRoomTypes(uniqueRooms)
    }
    const handleRoomTypeChange = (event) => {
        const selectedRoomType = event.target.value;
        setNewBooking({ ...newBooking, room_type: selectedRoomType });
        if (selectedRoomType !== "") {
            fetchAvailableRoomNumbers(selectedRoomType);
        }
    };
    const handleEditRoomTypeChange = (event) => {
        const selectedRoomType = event.target.value;
        setCurrentBooking({ ...currentBooking, room_type: selectedRoomType });
        if (selectedRoomType !== "") {
            fetchEditAvailableRoomNumbers(selectedRoomType);
        }
    };
    const calculateTotalAmount = (checkInDate, checkOutDate, price) => {
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const numberOfDays = (checkOut - checkIn) / (1000 * 60 * 60 * 24);
        return String(parseInt(numberOfDays) * parseInt(price));
    };

    const handleInputChange = async (event) => {
        const { name, value } = event.target;

        if (name === "room_number") {
            try {
                const roomResponse = await axios.get('http://localhost:8000/get_rooms/');
                const room = roomResponse.data.find(room => room.room_number === value);

                if (room) {
                    setNewBooking(prev => ({
                        ...prev,
                        room: { room_number: value },
                        amount_per_day: room.price,
                        total_amount: calculateTotalAmount(newBooking.check_in_date, newBooking.check_out_date, room.price)
                    }));
                    setErrorMessage('');
                } else {
                    setErrorMessage('Room not found');
                    setNewBooking(prev => ({ ...prev, room: { room_number: value }, amount_per_day: '', total_amount: '' }));
                }
            } catch (error) {
                console.error('Error fetching room:', error);
                setErrorMessage('Error fetching room details');
            }
        } else {
            setNewBooking(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleEditInputChange = async (event) => {
        event.preventDefault();
        const { name, value } = event.target;

        if (name === "room_number") {
            try {
                const roomResponse = await axios.get('http://localhost:8000/get_rooms/');
                const room = roomResponse.data.find(room => room.room_number === value);
                console.log("hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii")
                if (room) {
                    setCurrentBooking(prev => ({
                        ...prev,
                        room_number: value,
                        amount_per_day: room.price,
                        total_amount: calculateTotalAmount(prev.check_in_date, prev.check_out_date, room.price)
                    }));
                    setErrorMessage("");
                } else {
                    setErrorMessage('Room not found');
                    setCurrentBooking(prev => ({
                        ...prev,
                        room_number: value,
                        amount_per_day: 0,
                        total_amount: 0
                    }));
                }
            } catch (error) {
                console.error('Error fetching room:', error);
                setErrorMessage('Error fetching room details');
            }
        } else if (name === "room_type") {
            // Fetch available room numbers based on room type
            try {
                fetchEditAvailableRoomNumbers(value);
                setCurrentBooking(prev => ({ ...prev, [name]: value }));
            } catch (error) {
                console.error('Error fetching available rooms:', error);
                setErrorMessage('Error fetching available rooms');
            }
        } else {
            setCurrentBooking(prev => ({ ...prev, [name]: value }));
        }
    };


    const handleAddBooking = async (e) => {
        e.preventDefault();
        if (newBooking.check_in_date >= newBooking.check_out_date) {
            setErrorMessage('Check-in date must be before the check-out date.');
            return;
        }
        try {
            const response = await axios.get('http://localhost:8000/get_bookings/');
            const conflictingBooking = response.data.find(booking =>
                booking.room.room_number === newBooking.room.room_number &&
                (
                    (newBooking.check_in_date >= booking.check_in_date && newBooking.check_in_date <= booking.check_out_date) ||
                    (newBooking.check_out_date >= booking.check_in_date && newBooking.check_out_date <= booking.check_out_date)
                )
            );

            if (conflictingBooking) {
                setErrorMessage('Room is already booked for the selected dates.');
                return;
            }

            const addBookingResponse = await axios.post('http://localhost:8000/add_booking/', newBooking);

            if (addBookingResponse.data.message === "Booking added successfully") {
                setBookings([...bookings, { ...newBooking, booking_id: addBookingResponse.data.booking_id }]);
                setNewBooking({
                    customer_name: '',
                    customer_email: '',
                    check_in_date: '',
                    check_out_date: '',
                    room: { room_number: '' },
                    total_amount: '',
                    amount_per_day: '',
                    room_number: '',
                    room_type: ''
                });
                setErrorMessage('');
            } else {
                setErrorMessage(addBookingResponse.data.error);
            }
            e.target.reset();
        } catch (error) {
            console.error('Error adding booking:', error);
            setErrorMessage('Error adding booking. Please try again.');
        }
    };

    const handleEditBooking = async (e) => {
        e.preventDefault();
        if (currentBooking) {
            if (new Date(currentBooking.check_in_date) >= new Date(currentBooking.check_out_date)) {
                setErrorMessage('Check-in date must be before the check-out date.');
                return;
            }

            try {
                const response = await axios.get('http://localhost:8000/get_bookings/');
                const conflictingBooking = response.data.find(booking =>
                    booking.room.room_number === currentBooking.room.room_number &&
                    booking.booking_id !== currentBooking.booking_id && // Exclude the current booking from the check
                    (
                        (new Date(currentBooking.check_in_date) >= new Date(booking.check_in_date) && new Date(currentBooking.check_in_date) <= new Date(booking.check_out_date)) ||
                        (new Date(currentBooking.check_out_date) >= new Date(booking.check_in_date) && new Date(currentBooking.check_out_date) <= new Date(booking.check_out_date))
                    )
                );

                if (conflictingBooking) {
                    setErrorMessage('Room is already booked for the selected dates.');
                    return;
                }

                const roomResponse = await axios.get('http://localhost:8000/get_rooms/');
                const room = roomResponse.data.find(room => room.room_number === currentBooking.room.room_number);

                if (!room) {
                    setErrorMessage('Room not found');
                    return;
                }

                const updatedBooking = {
                    customer_name: currentBooking.customer_name,
                    customer_email: currentBooking.customer_email,
                    check_in_date: currentBooking.check_in_date,
                    check_out_date: currentBooking.check_out_date,
                    room: { room_number: currentBooking.room.room_number }, // Keep room number for display
                    room_id: room.room_id, // Use room ID for backend processing
                    amount_per_day: room.price,// Calculate total amount based on the room's price
                    total_amount: calculateTotalAmount(currentBooking.check_in_date, currentBooking.check_out_date, room.price)
                };
                console.log(currentBooking)
                const editResponse = await axios.put(`http://localhost:8000/edit_booking/${currentBooking.booking_id}/`, updatedBooking);

                if (editResponse.data.message === "Booking updated successfully") {
                    setBookings(bookings.map(booking =>
                        booking.booking_id === currentBooking.booking_id
                            ? { ...updatedBooking, amount_per_day: room.price, total_amount: calculateTotalAmount(currentBooking.check_in_date, currentBooking.check_out_date, room.price), booking_id: currentBooking.booking_id }
                            : booking
                    ));
                    setCurrentBooking(null);
                    setErrorMessage('');
                } else {
                    setErrorMessage('Error updating booking');
                }
                e.target.reset();
            } catch (error) {
                console.error('Error updating booking:', error.response ? error.response.data : error.message);
                setErrorMessage('Error updating booking');
            }
        }
    };

    const handleDeleteBooking = async (booking_id) => {
        try {
            const response = await axios.delete(`http://localhost:8000/delete_booking/${booking_id}/`);

            if (response.status === 200) {
                setBookings(bookings.filter(booking => booking.booking_id !== booking_id));
                setErrorMessage('');
            } else {
                setErrorMessage('Error deleting booking');
            }
        } catch (error) {
            console.error('Error deleting booking:', error.response ? error.response.data : error.message);
            setErrorMessage(error.response?.data?.error || `Error: ${error.message}`);
        }
    };

    const handleFilter = () => {
        if (searchTerm === "") {
            return bookings;
        }
        const filteredBookings = bookings.filter(booking => {
            const customerNameMatches = booking.customer_name && booking.customer_name.toLowerCase().includes(searchTerm.toLowerCase());
            const roomNumberMatches = booking.room && booking.room.room_number && booking.room.room_number.toLowerCase().includes(searchTerm.toLowerCase());

            return customerNameMatches || roomNumberMatches;
        });

        console.log(filteredBookings)
        return filteredBookings;
    };
    const navigate = useNavigate()
    const handleGenerateBill = (booking) => {
        // Assuming you have a page for generating bills, redirect to that page
        // You can pass the booking details via state or URL parameters
        navigate(`/Generate_Bill/${booking.booking_id}`, { state: { booking } });
    };

    return (
        <div className="container">
            <h2>Booking Management</h2>

            <div className="add-booking-container">
                <form className="add-booking" onSubmit={handleAddBooking}>
                    <h3>Add New Booking</h3>
                    <label htmlFor="customer_name">Customer Name</label>
                    <input
                        type="text"
                        name="customer_name"
                        value={newBooking.customer_name}
                        onChange={handleInputChange}
                        required
                    />
                    <label htmlFor="customer_email">Customer Email</label>
                    <input
                        type="email"
                        name="customer_email"
                        value={newBooking.customer_email}
                        onChange={handleInputChange}
                        required
                    />
                    <label htmlFor="check_in_date">Check In Date</label>
                    <input
                        type="date"
                        name="check_in_date"
                        value={newBooking.check_in_date}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={handleInputChange}
                        required
                    />
                    <label htmlFor="check_out_date">Check Out Date</label>
                    <input
                        type="date"
                        name="check_out_date"
                        value={newBooking.check_out_date}
                        min={newBooking.check_in_date ? new Date(new Date(newBooking.check_in_date).getTime() + 86400000).toISOString().split("T")[0] : undefined}
                        onChange={handleInputChange}
                        required
                    />

                    <label htmlFor="room_type">Room Type</label>
                    <select
                        name="room_type"
                        value={newBooking.room_type}
                        required
                        onChange={handleRoomTypeChange}
                    >
                        <option value="" hidden>Select Room Type</option>
                        {roomTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>

                    <label htmlFor="room_number">Room Number</label>
                    <select
                        name="room_number"
                        value={newBooking.room_number}
                        onClick={() => { fetchAvailableRoomNumbers(newBooking.room_type) }}
                        onChange={handleInputChange}
                    >
                        <option value="" hidden>Select Room Number</option>
                        {availableRoomNumbers.map(room => (
                            <option key={room} value={room}>{room}</option>
                        ))}
                    </select>
                    <label htmlFor="amount_per_day">Amount Per Day</label>
                    <input
                        type="number"
                        name="amount_per_day"
                        value={newBooking.amount_per_day}
                        readOnly
                    />
                    <label htmlFor="total_amount">Total Amount</label>
                    <input
                        type="number"
                        name="total_amount"
                        value={newBooking.total_amount}
                        readOnly
                    />
                    <button type="submit">Add Booking</button>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                </form>
            </div>

            <div className="search-booking">
                <input
                    type="text"
                    placeholder="Search Booking by Customer Name or Room Number"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            {currentBooking && (
                <div className="edit-booking-container">
                    <form className="edit-booking" onSubmit={handleEditBooking}>
                        <h3>Edit Booking</h3>
                        <label htmlFor="customer_name">Customer Name</label>
                        <input
                            type="text"
                            name="customer_name"
                            value={currentBooking.customer_name}
                            onChange={handleEditInputChange}
                        />
                        <label htmlFor="customer_email">Customer Email</label>
                        <input
                            type="email"
                            name="customer_email"
                            value={currentBooking.customer_email}
                            onChange={handleEditInputChange}
                        />
                        <label htmlFor="check_in_date">Check In Date</label>
                        <input
                            type="date"
                            min={new Date().toISOString().split("T")[0]}
                            name="check_in_date"
                            value={currentBooking.check_in_date}
                            onChange={handleEditInputChange}
                        />
                        <label htmlFor="check_out_date">Check Out Date</label>
                        <input
                            type="date"
                            name="check_out_date"
                            min={currentBooking.check_in_date ? new Date(new Date(currentBooking.check_in_date).getTime() + 86400000).toISOString().split("T")[0] : undefined}
                            value={currentBooking.check_out_date}
                            onChange={handleEditInputChange}
                        />

                        <label htmlFor="room_type">Room Type</label>
                        <select
                            name="room_type"
                            value={currentBooking.room_type}
                            onChange={handleEditRoomTypeChange}

                        >
                            <option value="" hidden>Select Room Type</option>
                            {roomTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>

                        <label htmlFor="room_number">Room Number</label>
                        <select
                            name="room_number"
                            value={currentBooking.room.room_number}
                            onClick={() => { fetchEditAvailableRoomNumbers(currentBooking.room_type) }}
                            onChange={handleEditInputChange}
                        >
                            {/* <option value="" hidden>Select Room Number</option> */}
                            {availableRoomNumbers.map(room => (
                                <option key={room} value={room}>{room}</option>
                            ))}
                        </select>

                        <label htmlFor="amount_per_day">Amount Per Day</label>
                        <input
                            type="number"
                            name="amount_per_day"
                            value={currentBooking.amount_per_day}
                            readOnly
                        />
                        <label htmlFor="total_amount">Total Amount</label>
                        <input
                            type="number"
                            name="total_amount"
                            value={currentBooking.total_amount}
                            readOnly
                        />
                        <button type='submit'>Save</button>
                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                    </form>
                </div>
            )}

            <div className="bookings-list">
                <h3>Bookings List</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Customer Name</th>
                            <th>Email</th>
                            <th>Check-in Date</th>
                            <th>Check-out Date</th>
                            <th>Room Number</th>
                            <th>Amount Per Day</th>
                            <th>Total Amount</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {handleFilter().map(booking => (
                            <tr key={booking.booking_id}>
                                <td>{booking.customer_name}</td>
                                <td>{booking.customer_email}</td>
                                <td>{booking.check_in_date}</td>
                                <td>{booking.check_out_date}</td>
                                <td>{booking.room.room_number}</td>
                                <td>{booking.amount_per_day}</td>
                                <td>{booking.total_amount}</td>
                                <td>
                                    <div className="button-container">
                                        <div>
                                            <button className="edit" onClick={() => { setCurrentBooking(booking) }}>Edit</button>
                                        </div>
                                        <div>
                                            <button className="delete" onClick={() => handleDeleteBooking(booking.booking_id)}>Delete</button>
                                        </div>
                                        <div>
                                            <button className="generate-bill" onClick={() => handleGenerateBill(booking)}>Generate Bill</button>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Booking_Management;
