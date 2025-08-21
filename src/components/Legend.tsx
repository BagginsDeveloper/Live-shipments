import React from 'react';
import { ShipmentStatus, AppointmentStatus, Priority } from '../types';
import { statusColors, appointmentStatusColors, priorityColors } from '../data/mockData';

interface LegendProps {
  onStatusFilter?: (status: ShipmentStatus) => void;
  onAppointmentStatusFilter?: (status: AppointmentStatus) => void;
  onPriorityFilter?: (priority: Priority) => void;
}

const Legend: React.FC<LegendProps> = ({ onStatusFilter, onAppointmentStatusFilter, onPriorityFilter }) => {
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
    <div className="space-y-2">
      {/* Shipment Status Legend */}
      <div className="flex items-center gap-4">
        <span className="text-xs font-medium text-slate-700">Shipment Status:</span>
        <div className="flex flex-wrap gap-3">
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => onStatusFilter?.(status)}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <div className={`w-4 h-4 rounded-full ${getBackgroundColor(status)} border border-slate-300 shadow-sm`}></div>
              <span className="text-xs font-medium text-slate-800">{status}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Appointment Status Legend */}
      <div className="flex items-center gap-4">
        <span className="text-xs font-medium text-slate-700">Appointment Status:</span>
        <div className="flex flex-wrap gap-3">
          {appointmentStatuses.map((status) => (
            <button
              key={status}
              onClick={() => onAppointmentStatusFilter?.(status)}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <div className={`w-4 h-4 rounded-full ${getAppointmentBackgroundColor(status)} border border-slate-300 shadow-sm`}></div>
              <span className="text-xs font-medium text-slate-800">{status}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Priority Legend */}
      <div className="flex items-center gap-4">
        <span className="text-xs font-medium text-slate-700">Priority:</span>
        <div className="flex flex-wrap gap-3">
          {priorities.map((priority) => (
            <button
              key={priority}
              onClick={() => onPriorityFilter?.(priority)}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <div className={`w-4 h-4 rounded-full ${priorityColors[priority].replace('text-white', '')} border border-slate-300 shadow-sm`}></div>
              <span className="text-xs font-medium text-slate-800">{priority}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Legend; 