import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../AdminControls.css';
import MainPage from './mainPage';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import logoImage from '../images/logo.png'

import Modal from 'react-modal';

import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from "@fullcalendar/interaction";
import InteractiveIcons from './headerAndFooter';

Modal.setAppElement('#root');

const AdminControls = ({ isAdmin }) => {
    const [showStaffSection, setShowStaffSection] = useState(false);
    const [showNewsletterSection, setShowNewsletterSection] = useState(false);
    const [showEventsSection, setShowEventsSection] = useState(false);
    const [showOtherSection, setShowOtherSection] = useState(false);
    const [showAnnocuments, setshowAnnocuments] = useState(false);

    const clockIn = async () => {
        const userEmail = Cookies.get('userEmail');
        const response = await fetch('/api/clockin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: userEmail }),
        });
        const data = await response.json();
        alert(data.message);
    };

    const clockOut = async () => {
        const userEmail = Cookies.get('userEmail');
        const response = await fetch('/api/clockout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: userEmail }),
        });
        const data = await response.json();
        alert(data.message);
    };

    return (
        <div id='controls4'>
            <div className="header">
                <div className="logo-container">
                    <img src={logoImage} alt="OLLI Logo" /> {/* Replace logoImage with your logo import */}
                </div>
                <h1 className="title">
                    <span className="main">OLLI</span>
                    <br></br>
                    <span className="sub">Ongoing Living & Learning Inc</span>
                </h1>
                <div className="buttons-container">
                    <Link to="/" className="header-button user-login" >Home</Link>
                    <Link to="/login" className="header-button user-login" >User Login</Link>
                    <Link to="/childlogin" className="header-button admin-login" >Child Login</Link>
                    <Link to="/Gallery" className="header-button admin-login" >Gallery</Link>
                    <Link to="/Reviews" className="header-button admin-login" >Reviews</Link>

                </div>
            </div>
            <div id='controlnav'>
                <a href='https://analytics.google.com/analytics/web/?pli=1#/p434272565/reports/reportinghub?params=_u..pageSize%3D25%26_u..nav%3Dmaui' target="_blank">View Analytics</a>

            </div>
            {isAdmin ? (
                <h1>Admin Controls:</h1>
            ) : (
                <h1>Staff Controls:</h1>
            )}
            <p> Welcome to the Admin Controls page of Ongoing Living & Learning Inc (OLLI)! </p>
            <p>This page serves as a centralized hub for managing various aspects of our organization. As an administrator, you have access to a range of controls to streamline operations and enhance efficiency.</p>
            <p>Use the buttons below to toggle the visibility of different sections, such as staff management, newsletters and galleries, events and calendars, and more. </p>
            <p>Simply click on the respective button to reveal or hide the corresponding functionality.</p>
            <p>Feel free to explore and utilize the features available to you to effectively manage OLLI's activities and resources.</p>
            <div id='buttonsshow'>
                <button onClick={() => setShowStaffSection(!showStaffSection)}>Staff</button>
                <button onClick={() => setShowNewsletterSection(!showNewsletterSection)}>Newsletter/Gallery</button>
                <button onClick={() => setShowEventsSection(!showEventsSection)}>Events/Calendar</button>
                <button onClick={() => setShowOtherSection(!showOtherSection)}>Caregiver List/Attendee List/Reviews Admin</button>
                <button onClick={() => setshowAnnocuments(!showAnnocuments)}>Show Announcements</button>

            </div>

            {showStaffSection && <div>
                <h1>Staff time tracker: </h1>
                <div id='clockinclockout'>
                    <button onClick={clockIn}>Clock In</button>
                <button onClick={clockOut}>Clock Out</button>
                </div>
                
            </div>}


            {showAnnocuments &&<AnnouncementForm /> }

            {showStaffSection && isAdmin && <StaffTable />}
            {showStaffSection && isAdmin && <AttendanceTable />}

            {showNewsletterSection && isAdmin && <NewsletterSender />}
            {showNewsletterSection && isAdmin && <NewsletterUpload />}
            {showNewsletterSection && isAdmin && <ImageUpload />}

            {showOtherSection && isAdmin && <ChildrenTable />}
            {showOtherSection && isAdmin && <ReviewsAdmin />}
            {showOtherSection && <ParentList />}

            {showEventsSection && <EventsTable />}
            {showEventsSection && <MyCalendar />}
        </div>
    );
};

export default AdminControls;

const AttendanceTable = () => {
    const [attendanceRecords, setAttendanceRecords] = useState([]);

    useEffect(() => {
        const fetchAttendanceRecords = async () => {
            try {
                const response = await fetch('/api/attendance/today');
                if (response.ok) {
                    const data = await response.json();
                    setAttendanceRecords(data);
                } else {
                    console.error('Failed to fetch attendance records');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchAttendanceRecords();
    }, []);

    return (
        <div id='controls2'>
            <h1>Today's Attendance Records: </h1>
            <table>
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Clock In Time</th>
                        <th>Clock Out Time</th>
                    </tr>
                </thead>
                <tbody>
                    {attendanceRecords.map((record) => (
                        <tr key={record._id}>
                            <td>{record.email}</td>
                            <td>{record.clockInTime ? new Date(record.clockInTime).toLocaleTimeString() : 'N/A'}</td>
                            <td>{record.clockOutTime ? new Date(record.clockOutTime).toLocaleTimeString() : 'N/A'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};


function ReviewsAdmin() {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        fetch('/api/reviewsadmin')
            .then(response => response.json())
            .then(data => setReviews(data))
            .catch(error => console.error('Error fetching reviews:', error));
    }, []);

    const handleToggleStatus = (reviewId, isHidden) => {
        console.log(reviewId);
        fetch(`/api/reviews/${reviewId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ isHidden: !isHidden })
        })
            .then(response => {
                if (response.ok) {
                    // Update the review status in the UI
                    setReviews(prevReviews => {
                        return prevReviews.map(review => {
                            if (review._id === reviewId) {
                                return { ...review, ishidden: !isHidden };
                            }
                            return review;
                        });
                    });
                } else {
                    throw new Error('Failed to update review status');
                }
            })
            .catch(error => console.error('Error updating review status:', error));
    };


    return (
        <div id='controls2'>
            <h1>Reviews Admin: </h1>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Rating</th>
                        <th>Comment</th>
                        <th>Anonymous</th>
                        <th>Created At</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {reviews.map(review => (
                        <tr key={review._id}>
                            <td>{review.name}</td>
                            <td>{review.rating}</td>
                            <td>{review.comment}</td>
                            <td>{review.anonymous ? 'Yes' : 'No'}</td>
                            <td>{new Date(review.createdAt).toLocaleString()}</td>
                            <td>{review.ishidden ? 'Hidden' : 'Visible'}</td>
                            <td>
                                <button onClick={() => handleToggleStatus(review._id, review.ishidden)}>
                                    {review.ishidden ? 'Unhide' : 'Hide'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function NewsletterSender() {
    const [message, setMessage] = useState('');
    const [pdfExists, setPdfExists] = useState(false);
    const [year, setYear] = useState(new Date().getFullYear().toString());
    const [month, setMonth] = useState(new Date().toLocaleString('default', { month: 'long' }));

    const years = Array.from({ length: 20 }, (_, i) => Number(year) + i);
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    useEffect(() => {
        const fetchNewsletterData = async () => {
            try {
                const response = await fetch(`/api/newsletters?year=${year}&month=${month}`);
                if (response.ok) {
                    const data = await response.json();
                    setPdfExists(data.length > 0);
                    setMessage('PDF exists');
                } else {
                    setPdfExists(false);
                    setMessage('Error fetching newsletter data.');
                }
            } catch (error) {
                console.error('Error fetching newsletter data:', error);
                setMessage('Error fetching newsletter data. Please try again later.');
            }
        };

        if (year && month) {
            fetchNewsletterData();
        }
    }, [year, month]);

    const sendNewsletter = async () => {
        try {
            const response = await fetch('/api/send-newsletter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ month, year })
            });

            if (!response.ok) {
                throw new Error('Failed to send newsletter');
            }

            const data = await response.json();
            setMessage(data.message);
        } catch (error) {
            console.error('Error sending newsletter:', error);
            setMessage('Error sending newsletter. Please try again later.');
        }
    };

    return (
        <div>
            <h1>Send Newsletter:</h1>
            <label htmlFor="month">Month:</label>
            <select id="month" value={month} onChange={(e) => setMonth(e.target.value)}>
                <option value="">Select Month</option>
                {months.map((month) => (
                    <option key={month} value={month}>{month}</option>
                ))}
            </select>
            <label htmlFor="year">Year:</label>
            <select id="year" value={year} onChange={(e) => setYear(e.target.value)}>
                <option value="">Select Year</option>
                {years.map((year) => (
                    <option key={year} value={year}>{year}</option>
                ))}
            </select>
            <button onClick={sendNewsletter} disabled={!pdfExists} >Send Newsletter</button>
            {message && <p>{message}</p>}
            {!pdfExists && <p>No PDF available for the selected month and year.</p>}
        </div>
    );
}



function ImageUpload() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [message, setMessage] = useState('');

    const handleFileSelect = event => {
        setSelectedFile(event.target.files[0]);
    };

    const handleImageUpload = () => {
        const formData = new FormData();
        formData.append('image', selectedFile);

        fetch('/api/images', {
            method: 'POST',
            body: formData,
        })
            .then(response => response.json())
            .then(data => {
                setMessage('Image uploaded successfully');
                setSelectedFile(null);  // Clear the selected file
            })
            .catch(error => {
                console.error('Error:', error);
                setMessage('Failed to upload image');
            });
    };

    return (
        <div>
            <h1>Gallery Upload: </h1>
            <input type="file" onChange={handleFileSelect} />
            <button onClick={handleImageUpload}>Submit</button>
            <p>{message}</p>
        </div>
    );
}

function NewsletterUpload() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [year, setYear] = useState('');
    const [month, setMonth] = useState('');
    const [message, setMessage] = useState('');

    const handleFileSelect = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleFileUpload = () => {
        const formData = new FormData();
        formData.append('pdf', selectedFile);
        formData.append('year', year);
        formData.append('month', month);

        fetch('/api/newsletters', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                setMessage('File uploaded successfully');
            })
            .catch(error => {
                setMessage('Error uploading file');
            });
    };

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 20 }, (_, i) => currentYear + i);
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    return (
        <div>
            <h1>Newsletter Upload: </h1>
            <input type="file" onChange={handleFileSelect} />
            <select value={year} onChange={(e) => setYear(e.target.value)}>
                <option value="">Select a year</option>
                {years.map(year => <option key={year} value={year}>{year}</option>)}
            </select>
            <select value={month} onChange={(e) => setMonth(e.target.value)}>
                <option value="">Select a month</option>
                {months.map(month => <option key={month} value={month}>{month}</option>)}
            </select>
            <button onClick={handleFileUpload}>Submit</button>
            <p>{message}</p>
        </div>
    );
}


const MyCalendar = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        fetch('/api/events')
            .then(response => response.json())
            .then(data => {
                const formattedEvents = data.map(event => ({
                    title: event.title,
                    start: new Date(event.date + 'T' + event.time),
                    extendedProps: {
                        description: event.description,
                        location: event.location,
                        attendees: event.attendees,
                        interestedInComing: event.interestedInComing,
                    },
                }));
                setEvents(formattedEvents);
            });
    }, []);

    const handleEventClick = (clickInfo) => {
        const attendees = clickInfo.event.extendedProps.attendees || [];
        const interestedInComing = clickInfo.event.extendedProps.interestedInComing || [];

        alert(`
            Title: ${clickInfo.event.title}
            Description: ${clickInfo.event.extendedProps.description}
            Location: ${clickInfo.event.extendedProps.location}
            Attendees: ${attendees.join(', ')}
            Interested: ${interestedInComing.join(', ')}
        `);
    };

    const fetchEvents = () => {
        fetch('/api/events')
            .then(response => response.json())
            .then(data => {
                const formattedEvents = data.map(event => ({
                    title: event.title,
                    start: new Date(event.date + 'T' + event.time),
                    extendedProps: {
                        description: event.description,
                        location: event.location,
                        attendees: event.attendees,
                        interestedInComing: event.interestedInComing,
                    },
                }));
                setEvents(formattedEvents);
            });
    };

    useEffect(fetchEvents, []);

    return (
        <div>
            <h1>Calendar:</h1>

            <div id='calendar-container'>
                <button onClick={fetchEvents}>Refresh</button>
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    events={events}
                    eventClick={handleEventClick}
                />
            </div>
        </div>

    );
};

const StaffTable = () => {
    const [staff, setStaff] = useState([]);

    useEffect(() => {
        fetch('/api/staff')
            .then(response => response.json())
            .then(data => setStaff(data))
            .catch(error => console.error('Error:', error));
    }, []);

    const toggleIsAdmin = (id, isAdmin) => {
        fetch(`/api/staff/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                isAdmin: !isAdmin,
            }),
        })
            .then(() => {
                setStaff(staff.map(item => item._id === id ? { ...item, isAdmin: !isAdmin } : item));
            })
            .catch(error => console.error('Error:', error));
    };

    return (
        <div id='controls3'>
            <h1>Staff table:</h1>

            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone Number</th>
                        <th>Is Admin</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {staff.map(({ _id, name, email, phoneNumber, isAdmin }) => (
                        <tr key={_id}>
                            <td>{name}</td>
                            <td>{email}</td>
                            <td>{phoneNumber}</td>
                            <td>{isAdmin ? 'Yes' : 'No'}</td>
                            <td>
                                <button onClick={() => toggleIsAdmin(_id, isAdmin)}>
                                    Toggle Is Admin
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const ChildrenTable = () => {
    const [children, setChildren] = useState([]);
    const [newChild, setNewChild] = useState({ name: '', parentName: '', allergies: '', age: '', address: '' });
    const [currentChild, setCurrentChild] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);


    const directUser = () => {
        history.push('/AddChild'); // Use the path to your component here
    };

    useEffect(() => {
        fetch('/api/children')
            .then(response => response.json())
            .then(data => setChildren(data))
            .catch(error => console.error('Error:', error));
    }, []);

    const openModal = (child) => {
        setCurrentChild(child);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const updateChild = async (event) => {
        event.preventDefault();
        const response = await fetch(`/api/children/${currentChild._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(currentChild)
        });

        if (response.ok) {
            closeModal();
            fetch('/api/children')
                .then(response => response.json())
                .then(data => setChildren(data))
                .catch(error => console.error('Error:', error));
        }
    };

    const handleInputChange = (event) => {
        setCurrentChild({ ...currentChild, [event.target.name]: event.target.value });
    };
    const history = useHistory();


    const navigateToAddChild = () => {
        history.push('/AddChild');
    };
    const addChild = async () => {
        const response = await fetch('/api/children', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newChild),
        });

        if (response.ok) {
            alert('Child added successfully');
            setChildren([...children, newChild]);
            setNewChild({ name: '', parentName: '', allergies: '', age: '', address: '' });
        } else {
            alert('Failed to add child');
        }
    };

    return (
        <div id='controls2'>
            <h1>Children List:</h1>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Caregiver Name</th>
                        <th>Allergies</th>
                        <th>Age</th>
                        <th>Address</th>
                        <th>Edit</th>
                    </tr>
                </thead>
                <tbody>
                    {children.map(child => (
                        <tr key={child._id}>
                            <td>{child.name}</td>
                            <td>{child.parentName}</td>
                            <td>{child.allergies}</td>
                            <td>{child.age}</td>
                            <td>{child.address}</td>
                            <td>
                                <button onClick={() => openModal(child)}>Edit</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h1>Add Child:</h1>
            

            <button onClick={navigateToAddChild}>Go to Add Attendee</button>

            <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
                <h1>Edit Attendee:</h1>
                <form onSubmit={updateChild}>
                    <label>
                        Name:
                        <input type="text" name="name" value={currentChild?.name} onChange={handleInputChange} />
                    </label>
                    <label>
                        Caregiver Name:
                        <input type="text" name="parentName" value={currentChild?.parentName} onChange={handleInputChange} />
                    </label>
                    <label>
                        Allergies:
                        <input type="text" name="allergies" value={currentChild?.allergies} onChange={handleInputChange} />
                    </label>
                    <label>
                        Age:
                        <input type="number" name="age" value={currentChild?.age} onChange={handleInputChange} />
                    </label>
                    <label>
                        Address:
                        <input type="text" name="address" value={currentChild?.address} onChange={handleInputChange} />
                    </label>
                    <button onClick={closeModal}>Close</button>
                    <button type="submit">Update Attendee</button>
                </form>
            </Modal>
        </div>
    );
};

const EventsTable = () => {
    const [events, setEvents] = useState([]);
    const [newEvent, setNewEvent] = useState({ title: '', description: '', date: '', time: '', location: '', interestedInComing: [], attendees: [] });

    useEffect(() => {
        fetch('/api/events')
            .then(response => response.json())
            .then(data => {
                setEvents(data);
                console.log(data);
            })
            .catch(error => console.error('Error:', error));
    }, []);

    const addEvent = async () => {
        const response = await fetch('/api/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newEvent),
        });

        if (response.ok) {
            setNewEvent({ title: '', description: '', date: '', time: '', location: '', interestedInComing: [], attendees: [] });
            setEvents([...events, newEvent]);
            alert('Event added successfully');
        } else {
            alert('Failed to add event');
        }
    };

    const movePersonToAttendees = async (eventId, person) => {
        const response = await fetch(`/api/events/${eventId}/attendees/${person}`, {
            method: 'PUT',
        });

        if (response.ok) {
            alert('Moved person from interested to attending');
            setEvents(events.map(event => event._id === eventId ? { ...event, interestedInComing: event.interestedInComing.filter(p => p !== person), attendees: [...event.attendees, person] } : event));
        } else {
            alert('Failed to move person');
        }
    };

    const movePersonFromAttendeesToInterested = async (eventId, person) => {
        const response = await fetch(`/api/events/${eventId}/interested/${person}`, {
            method: 'PUT',
        });

        if (response.ok) {
            alert('Moved person from attendees to interested');
            setEvents(events.map(event => event._id === eventId ? { ...event, attendees: event.attendees.filter(p => p !== person), interestedInComing: [...event.interestedInComing, person] } : event));
        } else {
            alert('Failed to move person');
        }
    };

    return (
        <div id='controls'>
            <h1>Events:</h1>
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Location</th>
                        <th>Attendees</th>
                        <th>Interested</th>
                    </tr>
                </thead>
                <tbody>
                    {events.map(event => (
                        <tr key={event._id}>
                            <td>{event.title}</td>
                            <td>{event.description}</td>
                            <td>{event.date}</td>
                            <td>{event.time}</td>
                            <td>{event.location}</td>
                            <td>{event.attendees.length > 0 ? event.attendees.map(person => <button onClick={() => movePersonFromAttendeesToInterested(event._id, person)}>{person}</button>) : 'No attendees currently'}</td>
                            <td>{event.interestedInComing.length > 0 ? event.interestedInComing.map(person => <button onClick={() => movePersonToAttendees(event._id, person)}>{person}</button>) : 'No one currently interested'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <h1>Add Event:</h1>
            <form onSubmit={e => { e.preventDefault(); addEvent(); }}>
                <label>
                    Title:
                    <input type="text" value={newEvent.title} onChange={e => setNewEvent({ ...newEvent, title: e.target.value })} />
                </label>
                <label>
                    Description:
                    <input type="text" value={newEvent.description} onChange={e => setNewEvent({ ...newEvent, description: e.target.value })} />
                </label>
                <label>
                    Date:
                    <input type="date" value={newEvent.date} onChange={e => setNewEvent({ ...newEvent, date: e.target.value })} />
                </label>
                <label>
                    Time:
                    <input type="time" value={newEvent.time} onChange={e => setNewEvent({ ...newEvent, time: e.target.value })} />
                </label>
                <label>
                    Location:
                    <input type="text" value={newEvent.location} onChange={e => setNewEvent({ ...newEvent, location: e.target.value })} />
                </label>
                <button type="submit">Add Event</button>
            </form>
        </div>
    );




};

const ParentList = () => {
    const [parents, setParents] = useState([]);

    const fetchParents = async () => {
        try {
            const response = await fetch('/api/parents');
            const data = await response.json();
            setParents(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchParents();
    }, []);

    const toggleRegistration = async (id, isRegistered) => {
        try {
            await fetch(`/api/parents/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isRegistered: !isRegistered })
            });
            fetchParents(); // re-fetch parents data after updating a parent's registration status
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h1>Parents Admin Registration: </h1>

            <div className="parent-grid">
                {parents.map(parent => (
                    <div key={parent._id}>
                        <h2>{`${parent.firstName} ${parent.lastName}`}</h2>
                        <p>{`Email: ${parent.email}`}</p>
                        <p>{`Phone Number: ${parent.phoneNumber}`}</p>
                        <p>{parent.isRegistered ? 'Status: Registered' : 'Status: Not Registered'}</p>
                        <button onClick={() => toggleRegistration(parent._id, parent.isRegistered)}>
                            {parent.isRegistered ? 'Click to Unregister' : 'Click to Register'}
                        </button>
                    </div>
                ))}
            </div>
        </div>

    );
  };


const AnnouncementForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/announcements', { title, description });
      setTitle('');
      setDescription('');
      alert('Announcement added successfully!');
    } catch (error) {
      console.error('Error adding announcement:', error);
    }
  };

  return (
    <div>
      <h2>Add Announcement</h2>
      <form onSubmit={handleSubmit} id='annoucmentform'>
        <input
          type="text"
          placeholder="Announcement Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Announcement Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <button type="submit">Add Announcement</button>
      </form>
    </div>
  );
};


