import { Link } from 'react-router-dom';
import logoImage from '../images/logo.png'
import { Document, Page, pdfjs } from 'react-pdf';
import React, { useState, useEffect } from 'react';
import InteractiveIcons from './headerAndFooter';

import '../newsletter.css';


const newsletter = () => {




    return (
        <div>


<InteractiveIcons hideButton="newsletter" />


            <NewsletterPreview />
            <NewsletterSignUp />

        </div>

    );
}

export default newsletter;


function NewsletterPreview() {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [newsletter, setNewsletter] = useState(null);
    const [year, setYear] = useState(new Date().getFullYear().toString());
    const [month, setMonth] = useState(new Date().toLocaleString('default', { month: 'long' }));

    const years = Array.from({ length: 20 }, (_, i) => Number(year) + i);

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    useEffect(() => {
        fetch(`/api/newsletters?year=${year}&month=${month}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Received data:', data);

                if (data && data.length > 0) {
                    setNewsletter(data[0]);
                }
            })
            .catch(error => {
                console.error('Error fetching newsletters:', error);
            });
    }, [year, month]);
    useEffect(() => {
        // Initialize PDF.js worker
        pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
    }, []);

    function onDocumentLoadSuccess({ numPages }) {
        console.log(`Loaded PDF with ${numPages} pages`);

        setNumPages(numPages);
    }

    if (!newsletter) {
        return <div>Loading...</div>;
    }

    return (
        <div id='newsletter'>
            <h1>Newsletters for {month} {year}</h1>
            <div id='newsletterdoc'>

 <Document
                file={`/api/newsletters/${newsletter.filename}`}
                onLoadSuccess={onDocumentLoadSuccess} options={{ worker: new pdfjs.PDFWorker() }}
            >
                <Page pageNumber={pageNumber} width={1000} length={100} />
            </Document>

            </div>
           
            <div className="pdf-controls">
                <p>Page {pageNumber} of {numPages}</p>
                <div className="button-container">
                    <button
                        type="button"
                        disabled={pageNumber <= 1}
                        onClick={() => setPageNumber(pageNumber - 1)}>
                        Previous
                    </button>
                    <button
                        type="button"
                        disabled={pageNumber >= numPages}
                        onClick={() => setPageNumber(pageNumber + 1)}>
                        Next
                    </button>
                </div>
                <div className="select-container">
                    <select value={year} onChange={(e) => setYear(e.target.value)}>
                        {years.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                    <select value={month} onChange={(e) => setMonth(e.target.value)}>
                        {months.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                </div>
            </div>
        </div>
    );
}


function NewsletterSignUp() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email }),
            });

            if (response.ok) {
                setMessage('Thank you for signing up!');
            } else {
                setMessage('Failed to sign up. Please try again later.');
            }
        } catch (error) {
            console.error('Error signing up:', error);
            setMessage('An error occurred. Please try again later.');
        }
    };

    return (
        <div id='signup'>
            <h2>Sign Up for Our Newsletter</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}