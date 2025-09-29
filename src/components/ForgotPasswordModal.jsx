import React, { useState } from 'react';
import { requestPasswordResetApi, verifyOtpApi, setNewPasswordApi } from '../apiService';

const UserIcon = () => (
    <svg className="h-5 w-5 text-[#9ca3af]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
);

const EmailIcon = () => (
    <svg className="h-5 w-5 text-[#9ca3af]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path d="M3 4a2 2 0 012-2h10a2 2 0 012 2v1.586l-4.293 4.293a1 1 0 01-1.414 0L7 5.586V4z" />
        <path d="M3 8.414V16a2 2 0 002 2h10a2 2 0 002-2V8.414L12.293 13.707a3 3 0 01-4.242 0L3 8.414z" />
    </svg>
);

const LockIcon = () => (
    <svg className="h-5 w-5 text-[#9ca3af]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
    </svg>
);

const CloseIcon = () => (
    <svg className="h-6 w-6 text-[#9ca3af] hover:text-[#f9fafb] transition-colors" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const STEPS = {
    USERNAME: 'username',
    OTP: 'otp',
    PASSWORD: 'password',
    SUCCESS: 'success'
};

function ForgotPasswordModal({ isOpen, onClose }) {
    const [currentStep, setCurrentStep] = useState(STEPS.USERNAME);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Form data
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const resetForm = () => {
        setCurrentStep(STEPS.USERNAME);
        setUsername('');
        setEmail('');
        setOtp('');
        setNewPassword('');
        setConfirmPassword('');
        setError('');
        setLoading(false);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    // Step 1: Request password reset OTP
    const handleUsernameSubmit = async (e) => {
        e.preventDefault();
        if (!username.trim()) return;

        setLoading(true);
        setError('');

        try {
            const response = await requestPasswordResetApi(username.trim());
            console.log('Password reset requested:', response);
            // You might want to extract email from response if provided by API
            setCurrentStep(STEPS.OTP);
        } catch (err) {
            setError(err.message || 'Failed to send reset request. Please check your username.');
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verify OTP
    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim() || !otp.trim()) return;

        setLoading(true);
        setError('');

        try {
            const response = await verifyOtpApi(email.trim(), otp.trim());
            console.log('OTP verified:', response);
            setCurrentStep(STEPS.PASSWORD);
        } catch (err) {
            setError(err.message || 'Invalid OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Step 3: Set new password
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        if (!newPassword || !confirmPassword) {
            setError('Please fill in all fields.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await setNewPasswordApi(email.trim(), newPassword);
            console.log('Password set:', response);
            setCurrentStep(STEPS.SUCCESS);
        } catch (err) {
            setError(err.message || 'Failed to set new password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black bg-opacity-75"
                onClick={handleClose}
            ></div>

            {/* Modal */}
            <div className="relative z-10 w-full max-w-md mx-auto">
                <div className="bg-[#1f2937] p-8 rounded-xl shadow-lg">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-[#f9fafb]">
                            {currentStep === STEPS.USERNAME && 'Reset Password'}
                            {currentStep === STEPS.OTP && 'Verify OTP'}
                            {currentStep === STEPS.PASSWORD && 'Set New Password'}
                            {currentStep === STEPS.SUCCESS && 'Password Reset Complete'}
                        </h2>
                        <button
                            onClick={handleClose}
                            className="p-1 rounded-md hover:bg-[#374151] transition-colors"
                        >
                            <CloseIcon />
                        </button>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-md">
                            <p className="text-red-200 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Step 1: Username */}
                    {currentStep === STEPS.USERNAME && (
                        <form onSubmit={handleUsernameSubmit} className="space-y-6">
                            <p className="text-[#9ca3af] text-sm mb-6">
                                Enter your username to receive a password reset OTP via email.
                            </p>

                            <div>
                                <label htmlFor="username" className="text-sm font-medium text-[#9ca3af]">
                                    Username
                                </label>
                                <div className="mt-2 relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                        <UserIcon />
                                    </span>
                                    <input
                                        id="username"
                                        type="text"
                                        required
                                        placeholder="Enter your username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="block w-full rounded-md border-0 py-2.5 pl-10 bg-[#374151] text-[#f9fafb] placeholder:text-[#9ca3af] 
                             focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#1e40af] sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div className="flex space-x-3">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="flex-1 justify-center rounded-md bg-[#374151] px-3 py-2.5 text-sm font-semibold text-[#f9fafb] 
                           shadow-sm hover:bg-[#4b5563]"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 justify-center rounded-md bg-[#1e40af] px-3 py-2.5 text-sm font-semibold text-white 
                           shadow-sm hover:bg-[#1b3a9a] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Sending...' : 'Send OTP'}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Step 2: OTP Verification */}
                    {currentStep === STEPS.OTP && (
                        <form onSubmit={handleOtpSubmit} className="space-y-6">
                            <p className="text-[#9ca3af] text-sm mb-6">
                                An OTP has been sent to your registered email address. Please enter it below.
                            </p>

                            <div>
                                <label htmlFor="email" className="text-sm font-medium text-[#9ca3af]">
                                    Email Address
                                </label>
                                <div className="mt-2 relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                        <EmailIcon />
                                    </span>
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        placeholder="Enter your email address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full rounded-md border-0 py-2.5 pl-10 bg-[#374151] text-[#f9fafb] placeholder:text-[#9ca3af] 
                             focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#1e40af] sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="otp" className="text-sm font-medium text-[#9ca3af]">
                                    OTP Code
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="otp"
                                        type="text"
                                        required
                                        placeholder="Enter the OTP code"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        className="block w-full rounded-md border-0 py-2.5 px-3 bg-[#374151] text-[#f9fafb] placeholder:text-[#9ca3af] 
                             focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#1e40af] sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div className="flex space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setCurrentStep(STEPS.USERNAME)}
                                    className="flex-1 justify-center rounded-md bg-[#374151] px-3 py-2.5 text-sm font-semibold text-[#f9fafb] 
                           shadow-sm hover:bg-[#4b5563]"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 justify-center rounded-md bg-[#1e40af] px-3 py-2.5 text-sm font-semibold text-white 
                           shadow-sm hover:bg-[#1b3a9a] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Verifying...' : 'Verify OTP'}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Step 3: Set New Password */}
                    {currentStep === STEPS.PASSWORD && (
                        <form onSubmit={handlePasswordSubmit} className="space-y-6">
                            <p className="text-[#9ca3af] text-sm mb-6">
                                OTP verified successfully! Please enter your new password.
                            </p>

                            <div>
                                <label htmlFor="new-password" className="text-sm font-medium text-[#9ca3af]">
                                    New Password
                                </label>
                                <div className="mt-2 relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                        <LockIcon />
                                    </span>
                                    <input
                                        id="new-password"
                                        type="password"
                                        required
                                        placeholder="Enter new password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="block w-full rounded-md border-0 py-2.5 pl-10 bg-[#374151] text-[#f9fafb] placeholder:text-[#9ca3af] 
                             focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#1e40af] sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="confirm-password" className="text-sm font-medium text-[#9ca3af]">
                                    Confirm Password
                                </label>
                                <div className="mt-2 relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                        <LockIcon />
                                    </span>
                                    <input
                                        id="confirm-password"
                                        type="password"
                                        required
                                        placeholder="Confirm new password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="block w-full rounded-md border-0 py-2.5 pl-10 bg-[#374151] text-[#f9fafb] placeholder:text-[#9ca3af] 
                             focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#1e40af] sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div className="flex space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setCurrentStep(STEPS.OTP)}
                                    className="flex-1 justify-center rounded-md bg-[#374151] px-3 py-2.5 text-sm font-semibold text-[#f9fafb] 
                           shadow-sm hover:bg-[#4b5563]"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 justify-center rounded-md bg-[#1e40af] px-3 py-2.5 text-sm font-semibold text-white 
                           shadow-sm hover:bg-[#1b3a9a] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Setting...' : 'Set Password'}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Step 4: Success */}
                    {currentStep === STEPS.SUCCESS && (
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <p className="text-[#f9fafb] mb-2 font-semibold">Password Reset Complete!</p>
                            <p className="text-[#9ca3af] text-sm mb-6">
                                Your password has been successfully updated. You can now log in with your new password.
                            </p>
                            <button
                                onClick={handleClose}
                                className="w-full justify-center rounded-md bg-[#1e40af] px-3 py-2.5 text-sm font-semibold text-white 
                         shadow-sm hover:bg-[#1b3a9a]"
                            >
                                Close
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ForgotPasswordModal;