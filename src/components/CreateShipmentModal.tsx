import React, { useState } from 'react';
import { Customer } from '../types';
import { mockCustomers } from '../data/mockData';

interface CreateShipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBook: (customerId: string) => void;
  onQuote: (customerId: string) => void;
}

const CreateShipmentModal: React.FC<CreateShipmentModalProps> = ({
  isOpen,
  onClose,
  onBook,
  onQuote
}) => {
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');

  const handleBook = () => {
    if (selectedCustomer) {
      onBook(selectedCustomer);
      onClose();
    }
  };

  const handleQuote = () => {
    if (selectedCustomer) {
      onQuote(selectedCustomer);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Create New Shipment</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Customer
          </label>
          <select
            value={selectedCustomer}
            onChange={(e) => setSelectedCustomer(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="">Choose a customer...</option>
            {mockCustomers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name} ({customer.code})
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleQuote}
            disabled={!selectedCustomer}
            className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 border border-blue-300 rounded-md hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Quote
          </button>
          <button
            onClick={handleBook}
            disabled={!selectedCustomer}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Book
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateShipmentModal; 