import { useState } from "react";

export default function RegisterPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [dob, setDob] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const validateForm = () => {
        if (!username || !email || !password || !dob) {
            return "All fields are required";
        }
        // Example validation for email format
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            return "Please enter a valid email address";
        }
        return null; // No errors
    };

    async function register(ev) {
        ev.preventDefault();
        
        const validationError = validateForm();
        if (validationError) {
            setErrorMessage(validationError);
            return;
        }
        
        const response = await fetch('http://localhost:4000/register', {
            method: 'POST',
            body: JSON.stringify({ username, email, password, dob }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.status === 201) {
            alert('Registration successful');
        } else {
            const data = await response.json();
            setErrorMessage(data.message || 'Registration failed');
        }
    }

    return (
        <form className="register default-form-input default-form-button" onSubmit={register}>
            <h1>Register</h1>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={ev => setUsername(ev.target.value)}
                />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={ev => setEmail(ev.target.value)}
                />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={ev => setPassword(ev.target.value)}
                />
            <input
                type="date"
                placeholder="Date of Birth"
                value={dob}
                onChange={ev => setDob(ev.target.value)}
                />
            <p className="error">{errorMessage}</p>
            <button>Register</button>
        </form>
    );
}
