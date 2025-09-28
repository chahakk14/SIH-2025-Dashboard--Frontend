import React, { useState } from 'react';
import { FaUser, FaLock } from 'react-icons/fa';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username === 'admin' || password === 'password') {
            onLogin();
        } else {
            setError('Invalid credentials. Please try again.');
        }
    };

    return (
        <div 
            className="flex items-center justify-center min-h-screen bg-gray-900 text-white bg-cover bg-center"
            style={{ backgroundImage: "url('src/images/image.png')" }}
        >
            <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 bg-opacity-80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700">
                <div className="text-center">
                    <img src="src/images/logo.png" alt="Sainya Samvaad Logo" className="mx-auto h-24 w-24 mb-4" />
                    <h1 className="text-4xl font-bold text-white">Sainya Samvaad</h1>
                    <p className="mt-2 text-gray-300">HQ Command Center Login</p>
                </div>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="relative">
                        <label htmlFor="username" className="sr-only">Username / Service ID</label>
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaUser className="text-gray-400" />
                        </div>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            autoComplete="username"
                            required
                            className="block w-full pl-10 pr-3 py-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 sm:text-sm"
                            placeholder="Username / Service ID"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div className="relative">
                        <label htmlFor="password" className="sr-only">Password</label>
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaLock className="text-gray-400" />
                        </div>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            className="block w-full pl-10 pr-3 py-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 sm:text-sm"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {error && (
                        <div className="flex items-center justify-center text-sm text-red-400">
                            <p>{error}</p>
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 transition duration-300 ease-in-out"
                        >
                            Sign in
                        </button>
                    </div>
                </form>
                <p className="mt-8 text-xs text-center text-gray-400">
                    © 2024 Sainya Samvaad. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default Login;