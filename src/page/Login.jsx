import React, { useState } from 'react';
import { FiEye, FiEyeOff, FiLoader } from 'react-icons/fi';

const Login = ({ onLogin }) => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate a network request
        setTimeout(() => {
            onLogin();
            setLoading(false);
        }, 1500);
    };

    return (
        <div 
            className="flex items-center justify-center min-h-screen bg-gray-900 text-white bg-cover bg-center"
            style={{ backgroundImage: "url('src/images/image.png')" }}
        >
            <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 bg-opacity-80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700">
                <div className="text-center">
                    <img src="src/images/logo.png" alt="Sainya Samvaad Logo" className="mx-auto h-19 w-16 mb-4" />
                    <h1 className="text-3xl font-bold ">Sainya Samvaad</h1>
                    <p className="mt-2 text-gray-400">HQ Command Center Login</p>
                </div>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="relative">
                        <label htmlFor="username" className="block text-sm font-medium text-gray-300">
                            Username / Service ID
                        </label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            required
                            className="w-full px-4 py-3 mt-2 text-white bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            placeholder="Enter your username"
                        />
                    </div>
                    <div className="relative">
                        <label htmlFor="password"className="block text-sm font-medium text-gray-300">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type={passwordVisible ? "text" : "password"}
                            required
                            className="w-full px-4 py-3 mt-2 text-white bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            placeholder="Enter your password"
                        />
                         <button
                            type="button"
                            onClick={() => setPasswordVisible(!passwordVisible)}
                            className="absolute inset-y-0 right-0 top-7 px-4 text-gray-400 hover:text-white"
                        >
                            {passwordVisible ? <FiEyeOff /> : <FiEye />}
                        </button>
                    </div>
                    <div className="flex items-center justify-end">
                        
                        <div className="text-sm">
                            <a href="#" className="font-medium text-yellow-500 hover:text-yellow-400">
                                Forgot password?
                            </a>
                        </div>
                    </div>
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full px-4 py-3 font-bold text-gray-900 bg-yellow-500 rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-yellow-500 transition-all duration-200 flex items-center justify-center"
                        >
                            {loading ? <FiLoader className="animate-spin h-5 w-5" /> : "Secure Login"}
                        </button>
                    </div>
                </form>
                 <p className="text-xs text-center text-gray-500">
                    © 2025 Sainya Samvaad Initiative. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default Login;