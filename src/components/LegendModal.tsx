import React from 'react';
import { ShipmentStatus, AppointmentStatus, Priority } from '../types';
import { priorityColors } from '../data/mockData';

interface LegendModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStatusFilter?: (status: ShipmentStatus) => void;
  onAppointmentStatusFilter?: (status: AppointmentStatus) => void;
  onPriorityFilter?: (priority: Priority) => void;
}

const LegendModal: React.FC<LegendModalProps> = ({ 
  isOpen, 
  onClose, 
  onStatusFilter, 
  onAppointmentStatusFilter, 
  onPriorityFilter 
}) => {
  if (!isOpen) return null;

  const statuses: ShipmentStatus[] = [
    'Not Specified',
    'Quoted',
    'Tendered',
    'Booked',
    'Dispatched',
    'Loading',
    'In Transit',
    'Out For Delivery',
    'Refused Delivery',
    'In Disposition',
    'Dispositioned',
    'Missed Delivery',
    'Loading/Unloading',
    'Unloading',
    'Delivered',
    'Delivered OS&D',
    'Completed',
    'Hold',
    'Transferred',
    'Cancelled With Charges',
    'Canceled'
  ];

  const appointmentStatuses: AppointmentStatus[] = [
    'Not Required',
    'Requested',
    'Confirmed',
    'Pending'
  ];

  const priorities: Priority[] = [
    'HOT',
    'Standard',
    'Trace'
  ];

  // Convert text colors to background colors with better contrast
  const getBackgroundColor = (status: ShipmentStatus): string => {
    switch (status) {
      case 'Not Specified':
        return 'bg-gray-400';
      case 'Quoted':
        return 'bg-yellow-400';
      case 'Tendered':
        return 'bg-yellow-500';
      case 'Booked':
        return 'bg-blue-500';
      case 'Dispatched':
        return 'bg-purple-500';
      case 'Loading':
        return 'bg-orange-500';
      case 'In Transit':
        return 'bg-green-500';
      case 'Out For Delivery':
        return 'bg-green-600';
      case 'Refused Delivery':
        return 'bg-red-500';
      case 'In Disposition':
        return 'bg-amber-500';
      case 'Dispositioned':
        return 'bg-amber-600';
      case 'Missed Delivery':
        return 'bg-red-600';
      case 'Loading/Unloading':
        return 'bg-indigo-500';
      case 'Unloading':
        return 'bg-amber-500';
      case 'Delivered':
        return 'bg-emerald-600';
      case 'Delivered OS&D':
        return 'bg-red-700';
      case 'Completed':
        return 'bg-emerald-700';
      case 'Hold':
        return 'bg-yellow-600';
      case 'Transferred':
        return 'bg-blue-600';
      case 'Cancelled With Charges':
        return 'bg-red-800';
      case 'Canceled':
        return 'bg-gray-600';
      default:
        return 'bg-gray-400';
    }
  };

  const getAppointmentBackgroundColor = (status: AppointmentStatus): string => {
    switch (status) {
      case 'Not Required':
        return 'bg-red-500';
      case 'Requested':
        return 'bg-yellow-400';
      case 'Confirmed':
        return 'bg-green-500';
      case 'Pending':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Status Legend</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Shipment Status Legend */}
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Shipment Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {statuses.map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    onStatusFilter?.(status);
                    onClose();
                  }}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-slate-50 transition-colors cursor-pointer text-left"
                >
                  <div className={`w-5 h-5 rounded-full ${getBackgroundColor(status)} border border-slate-300 shadow-sm flex-shrink-0`}></div>
                  <span className="text-sm font-medium text-slate-800">{status}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Appointment Status Legend */}
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Appointment Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {appointmentStatuses.map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    onAppointmentStatusFilter?.(status);
                    onClose();
                  }}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-slate-50 transition-colors cursor-pointer text-left"
                >
                  <div className={`w-5 h-5 rounded-full ${getAppointmentBackgroundColor(status)} border border-slate-300 shadow-sm flex-shrink-0`}></div>
                  <span className="text-sm font-medium text-slate-800">{status}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Priority Legend */}
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Priority</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {priorities.map((priority) => (
                <button
                  key={priority}
                  onClick={() => {
                    onPriorityFilter?.(priority);
                    onClose();
                  }}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-slate-50 transition-colors cursor-pointer text-left"
                >
                  <div className={`w-5 h-5 rounded-full ${priorityColors[priority].replace('text-white', '')} border border-slate-300 shadow-sm flex-shrink-0`}></div>
                  <span className="text-sm font-medium text-slate-800">{priority}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700 transition-colors text-sm font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default LegendModal;
