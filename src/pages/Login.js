import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap-icons/font/bootstrap-icons.css';

const Login = () => {
    const navigate = useNavigate();
    const [showPass, setShowPass] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const validEmail = "tes@mail.com";
    const validPassword = "tes123";

    const onLogin = (e) => {
        e.preventDefault();

        if (email === validEmail && password === validPassword) {
            localStorage.setItem('loggedIn', 'true');
            localStorage.removeItem('quizState');
            navigate("/welcome");  // setelah login mengarah ke halaman welcome
        } else {
            alert("Login Failed !!");
        }
    };

    return (
        <section className="d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4 shadow-lg" style={{ maxWidth: '400px', width: '100%' }}>
                <h1 className="text-center mb-4">Login</h1>
                <form onSubmit={onLogin}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            className="form-control bg-light border-1"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div className="mb-3 position-relative">
                        <label htmlFor="password" className="form-label">Password</label>
                        <div className="d-flex align-items-center">
                            <input
                                id="password"
                                type={showPass ? 'text' : 'password'}
                                className="form-control bg-light border-1 pe-5"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                            />
                            <button
                                type="button"
                                title={showPass ? 'Hide Password' : 'Show Password'}
                                className="position-absolute end-0 top-50 translate-middle-y border-0 bg-transparent"
                                onClick={() => setShowPass(!showPass)}
                                style={{ transform: 'translateY(-50%)', padding: '0 0.75rem', marginTop: '15px' }}
                            >
                                <i
                                    className={`bi ${showPass ? 'bi-eye-slash' : 'bi-eye'} text-secondary`}
                                    style={{ fontSize: '1.25rem' }}
                                ></i>
                            </button>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary w-100 mb-3"
                    >
                        Login
                    </button>
                </form>
            </div>
        </section>
    );
};

export default Login;
