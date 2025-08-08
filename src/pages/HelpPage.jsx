// src/pages/HelpPage.jsx
import React, { useState } from 'react';
import { toast } from 'react-toastify'; // For potential future toast messages

// Reusable FAQ Item Component
const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-1 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
      <button
        className="flex items-center justify-between w-full p-4 text-left font-semibold text-gray-50 hover:bg-gray-700 transition-colors duration-200 rounded-lg"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span>{question}</span>
        <svg
          className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="p-4 pt-0 text-gray-300 border-t border-gray-700">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

const HelpPage = () => {
  // Sample FAQ data
  const faqs = [
    {
      question: "How do I track a specific visitor?",
      answer: "To track a specific visitor, navigate to the 'Registered Arrivals' page from the left sidebar. Use the search bar or filters to find the visitor by name, passport number, or other criteria. Once found, click 'View Details' in the 'Actions' column to see their full profile and history."
    },
    {
      question: "How do I add a new user to the system?",
      answer: "To add a new user, navigate to the 'Users' page under 'ADMINISTRATION' from the left sidebar. Click the '+ Add User' button in the top-right corner. A modal will appear where you can fill in the user's details such as name, email, role, and organization. Once you save, an invitation might be sent to the user's email address."
    },
    {
      question: "What does 'Overstayed' status mean?",
      answer: "The 'Overstayed' status indicates that a foreign national's visa or authorized period of stay has expired, and they have not yet departed the country. These cases require immediate attention and investigation."
    },
    {
      question: "How can I export data for reporting?",
      answer: "Data export functionality is typically available to 'SuperAdmin' users. Navigate to the 'Users' or 'Analytics' section, and look for an 'Export CSV' or similar button. Clicking this will download a comprehensive report of records."
    },
    {
      question: "Where can I report a technical issue?",
      answer: "For technical issues, please contact your system administrator or the IT support team. You may find contact information in the 'Settings' or 'Help' sections, or via your organization's internal communication channels."
    }
  ];

  return (
    <div className="flex-1 p-6 bg-[#070b13] min-h-screen text-gray-100 font-sans">
      <div className="bg-[#141824] p-6 rounded-lg shadow-xl border border-gray-800">
        <h1 className="text-xl font-semibold text-gray-50 mb-6">Frequently Asked Questions</h1> {/* Title from image */}

        <div className="flex flex-col space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
