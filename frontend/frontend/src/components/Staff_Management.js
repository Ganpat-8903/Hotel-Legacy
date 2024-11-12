import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../styles/staff_management.css";

const Staff_Management = () => {
    const [staff, setStaff] = useState([]);
    const [currentStaff, setCurrentStaff] = useState(null);
    const [newStaff, setNewStaff] = useState({
        staff_name: '', staff_email: '', staff_position: '', staff_phone: '', hire_date: '', salary: ''
    });
    const [searchTerm, setSearchTerm] = useState("");
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        try {
            const response = await axios.get('http://localhost:8000/get_staff/');
            setStaff(response.data);
        } catch (error) {
            console.error('Error fetching staff:', error);
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewStaff({ ...newStaff, [name]: value });
    };

    const handleEditInputChange = (event) => {
        const { name, value } = event.target;
        setCurrentStaff({ ...currentStaff, [name]: value });
    };

    const handleAddStaff = async (e) => {
        try {
            e.preventDefault();
            if (newStaff.staff_phone.length !== 10) {
                setErrorMessage('phone number must be 10 digits');
                return;
            }
            const response = await axios.post('http://localhost:8000/add_staff/', newStaff);
            console.log(response.data)
            if (response.data.message === "Staff added successfully") {
                setStaff([...staff, { ...newStaff, staff_id: response.data.staff_id }]);
                setNewStaff({ staff_name: '', staff_email: '', staff_position: '', staff_phone: '', hire_date: '', salary: '' });
                setErrorMessage('');
            } else {
                setErrorMessage('Error adding staff');
            }
            e.target.reset();
        } catch (error) {
            setErrorMessage('Error adding staff');
        }
    };

    const handleEditStaff = async (e) => {
        e.preventDefault()
        if (currentStaff && currentStaff.staff_id) {
            try {
                const response = await axios.put(`http://localhost:8000/edit_staff/${currentStaff.staff_id}/`, currentStaff);
                if (response.data.message === "Staff updated successfully") {
                    setStaff(staff.map(s => s.staff_id === currentStaff.staff_id ? { ...currentStaff } : s));
                    setCurrentStaff(null);
                    setErrorMessage('');
                } else {
                    setErrorMessage('Error updating staff');
                }
                e.target.reset();
            } catch (error) {
                setErrorMessage('Error updating staff');
            }
        }
    };

    const handleDeleteStaff = async (staff_id) => {
        try {
            await axios.delete(`http://localhost:8000/delete_staff/${staff_id}/`);
            setStaff(staff.filter(s => s.staff_id !== staff_id));
        } catch (error) {
            setErrorMessage('Error deleting staff');
        }
    };

    const handleFilter = () => {
        if (searchTerm === "") {
            return staff;
        }
        return staff.filter(s => s.staff_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.staff_phone.toLowerCase().includes(searchTerm.toLowerCase()));
    };

    return (
        <div className="container">
            <h2>Staff Management</h2>

            <div className="add-staff-container" >
                <form className="add-staff" onSubmit={handleAddStaff}>
                    <h3>Add New Staff</h3>
                    <label htmlFor="staff_name">Name</label>
                    <input
                        type="text"
                        name="staff_name"
                        placeholder="Name"
                        value={newStaff.staff_name}
                        onChange={handleInputChange}
                        required
                    />
                    <label htmlFor="staff_email">Email</label>
                    <input
                        type="email"
                        name="staff_email"
                        placeholder="Email"
                        value={newStaff.staff_email}
                        onChange={handleInputChange}
                        required
                    />
                    <label htmlFor="staff_position">Position</label>
                    <input
                        type="text"
                        name="staff_position"
                        placeholder="Position"
                        value={newStaff.staff_position}
                        onChange={handleInputChange}
                        required
                    />
                    <label htmlFor="staff_phone">Phone Number</label>
                    <input
                        type="number"
                        name="staff_phone"
                        placeholder="Phone Number"
                        value={newStaff.staff_phone}
                        onChange={handleInputChange}
                        required
                    />
                    <label htmlFor="hire_date">Hire Date</label>
                    <input
                        type="date"
                        name="hire_date"
                        placeholder="Hire Date"
                        value={newStaff.hire_date}
                        onChange={handleInputChange}
                        required
                    />
                    <label htmlFor="salary">Salary</label>
                    <input
                        type="number"
                        name="salary"
                        placeholder="Salary"
                        value={newStaff.salary}
                        onChange={handleInputChange}
                        required
                    />
                    <button type='submit'>Add Staff</button>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                </form>
            </div>

            <div className="search-staff">
                <input
                    type="text"
                    placeholder="Search Staff by Name or Phone Number"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {currentStaff && (
                <div className="edit-staff-container">
                    <form className="edit-staff" onSubmit={handleEditStaff}>
                        <h3>Edit Staff</h3>
                        <label htmlFor="staff_name">Name:</label>
                        <input
                            type="text"
                            name="staff_name"
                            placeholder="Name"
                            value={currentStaff.staff_name}
                            onChange={handleEditInputChange}
                        />
                        <label htmlFor="staff_email">Email</label>
                        <input
                            type="email"
                            name="staff_email"
                            placeholder="Email"
                            value={currentStaff.staff_email}
                            onChange={handleEditInputChange}
                        />
                        <label htmlFor="staff_position">Position</label>
                        <input
                            type="text"
                            name="staff_position"
                            placeholder="Position"
                            value={currentStaff.staff_position}
                            onChange={handleEditInputChange}
                        />
                        <label htmlFor="staff_phone">Phone Number</label>
                        <input
                            type="number"
                            name="staff_phone"
                            placeholder="Phone Number"
                            value={currentStaff.staff_phone}
                            onChange={handleEditInputChange}
                        />
                        <label htmlFor="hire_date">Hire Date</label>
                        <input
                            type="date"
                            name="hire_date"
                            placeholder="Hire Date"
                            value={currentStaff.hire_date}
                            onChange={handleEditInputChange}
                        />
                        <label htmlFor="salary">Salary</label>
                        <input
                            type="number"
                            name="salary"
                            placeholder="Salary"
                            value={currentStaff.salary}
                            onChange={handleEditInputChange}
                        />
                        <button type="submit">Save</button>
                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                    </form>
                </div>
            )}

            <div className="staff-list">
                <h3>Staff List</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Position</th>
                            <th>Phone</th>
                            <th>Hire Date</th>
                            <th>Salary</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {handleFilter().map(staffMember => (
                            <tr key={staffMember.staff_id}>
                                <td>{staffMember.staff_name}</td>
                                <td>{staffMember.staff_email}</td>
                                <td>{staffMember.staff_position}</td>
                                <td>{staffMember.staff_phone}</td>
                                <td>{staffMember.hire_date}</td>
                                <td>{staffMember.salary}</td>
                                <td>
                                    <button className="edit" onClick={() => setCurrentStaff(staffMember)}>Edit</button>
                                    <button className="delete" onClick={() => handleDeleteStaff(staffMember.staff_id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Staff_Management;
