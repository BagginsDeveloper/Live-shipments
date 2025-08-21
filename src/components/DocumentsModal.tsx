import React from 'react';
import { Shipment } from '../types';

interface DocumentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  shipment: Shipment | null;
}

const DocumentsModal: React.FC<DocumentsModalProps> = ({
  isOpen,
  onClose,
  shipment
}) => {
  if (!isOpen || !shipment) return null;

  const documents = shipment.documents || {};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-96 max-h-96 flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Documents - Load #{shipment.loadNumber}
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex-1 overflow-auto p-4">
          <div className="space-y-4">
            {/* BOL Document */}
            <div className="border border-gray-200 rounded-lg p-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Bill of Lading (BOL)</div>
                  <div className="text-sm text-gray-600">
                    {documents.bol ? documents.bol : 'No BOL available'}
                  </div>
                </div>
                {documents.bol && (
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View
                  </button>
                )}
              </div>
            </div>

            {/* POD Document */}
            <div className="border border-gray-200 rounded-lg p-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Proof of Delivery (POD)</div>
                  <div className="text-sm text-gray-600">
                    {documents.pod ? documents.pod : 'No POD available'}
                  </div>
                </div>
                {documents.pod && (
                  <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                    View
                  </button>
                )}
              </div>
            </div>

            {/* Invoice Document */}
            <div className="border border-gray-200 rounded-lg p-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Invoice</div>
                  <div className="text-sm text-gray-600">
                    {documents.invoice ? documents.invoice : 'No invoice available'}
                  </div>
                </div>
                {documents.invoice && (
                  <button className="text-purple-600 hover:text-purple-800 text-sm font-medium">
                    View
                  </button>
                )}
              </div>
            </div>

            {/* Placeholder Text */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">
                <p className="mb-2">
                  <strong>Note:</strong> This is placeholder text for the documents functionality.
                </p>
                <p>
                  In the production version, these documents will be hyperlinked to actual PDF files 
                  or document management system records associated with the load.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t p-4">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentsModal;
