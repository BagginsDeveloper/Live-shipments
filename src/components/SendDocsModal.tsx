import React, { useState } from 'react';
import { Shipment } from '../types';

interface SendDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
  shipment: Shipment | null;
}

const SendDocsModal: React.FC<SendDocsModalProps> = ({
  isOpen,
  onClose,
  shipment
}) => {
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState('');

  if (!isOpen || !shipment) return null;

  const documents = shipment.documents || {};
  const availableDocs = Object.values(documents).filter(doc => doc !== undefined);

  const handleSend = async () => {
    if (!email.trim()) {
      alert('Please enter a valid email address');
      return;
    }

    setIsSending(true);
    
    // Simulate sending documents
    setTimeout(() => {
      setIsSending(false);
      setMessage('Documents sent successfully!');
      
      // Reset form after 2 seconds
      setTimeout(() => {
        setMessage('');
        setEmail('');
        onClose();
      }, 2000);
    }, 1500);
  };

  const handleClose = () => {
    if (!isSending) {
      setEmail('');
      setMessage('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-96 max-h-96 flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Send Documents - Load #{shipment.loadNumber}
          </h3>
          <button
            onClick={handleClose}
            disabled={isSending}
            className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex-1 overflow-auto p-4">
          <div className="space-y-4">
            {/* Available Documents Summary */}
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-sm font-medium text-gray-900 mb-2">Available Documents:</div>
              <div className="space-y-1">
                {availableDocs.length > 0 ? (
                  availableDocs.map((doc, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {doc}
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-500 italic">No documents available for this load</div>
                )}
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Recipient Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isSending}
              />
            </div>

            {/* Message Display */}
            {message && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-sm text-green-800">{message}</div>
              </div>
            )}

            {/* Placeholder Text */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="text-sm text-blue-700">
                <p className="mb-1">
                  <strong>Note:</strong> This is placeholder functionality for sending documents.
                </p>
                <p>
                  In the production version, this will integrate with your email system to send 
                  actual document links or attachments to the specified recipient.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t p-4">
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              disabled={isSending}
              className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={isSending || !email.trim() || availableDocs.length === 0}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSending ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </div>
              ) : (
                'Send Documents'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendDocsModal;
