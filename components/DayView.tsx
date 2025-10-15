'use client';

import { useMemo } from 'react';
import type { Appointment, Doctor, TimeSlot, PopulatedAppointment } from '@/types';
import { appointmentService } from '@/services/appointmentService';
import { format, addMinutes, isBefore, isAfter, isEqual } from 'date-fns';

interface DayViewProps {
  appointments: Appointment[];
  doctor: Doctor | undefined;
  date: Date;
}

// Appointment type color mapping
const APPOINTMENT_TYPE_COLOR: Record<string, string> = {
  checkup: '#3b82f6',       // Blue
  consultation: '#10b981',  // Green
  followup: '#f59e0b',      // Orange
  procedure: '#8b5cf6',     // Purple
};

export function DayView({ appointments, doctor, date }: DayViewProps) {
  // Generate 30-min time slots from 8 AM to 6 PM
  const timeSlots: TimeSlot[] = useMemo(() => {
    const slots: TimeSlot[] = [];
    const startHour = 8;
    const endHour = 18;

    for (let hour = startHour; hour < endHour; hour++) {
      for (let min of [0, 30]) {
        const start = new Date(date);
        start.setHours(hour, min, 0, 0);
        const end = addMinutes(start, 30);
        slots.push({ start, end, label: format(start, 'h:mm a') });
      }
    }
    return slots;
  }, [date]);

  // Get appointments for a given slot
  function getAppointmentsForSlot(slot: TimeSlot): PopulatedAppointment[] {
    return appointments
      .map((apt) => appointmentService.getPopulatedAppointment(apt))
      .filter(
        (apt): apt is PopulatedAppointment =>
          !!apt &&
          ((isAfter(new Date(apt.startTime), slot.start) && isBefore(new Date(apt.startTime), slot.end)) ||
            (isBefore(new Date(apt.startTime), slot.start) && isAfter(new Date(apt.endTime), slot.start)) ||
            isEqual(new Date(apt.startTime), slot.start))
      );
  }

  return (
    <div className="day-view">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{format(date, 'EEEE, MMMM do, yyyy')}</h3>
        {doctor && (
          <p className="text-sm text-gray-600">
            Dr. {doctor.name} - {doctor.specialty}
          </p>
        )}
      </div>

      {/* Timeline */}
      <div className="border border-gray-200 rounded-lg divide-y divide-gray-100">
        {timeSlots.map((slot, idx) => (
          <div key={idx} className="flex min-h-[50px] relative">
            {/* Time label */}
            <div className="w-24 p-2 text-sm text-gray-600">{slot.label}</div>

            {/* Appointments in this slot */}
            <div className="flex-1 relative p-2">
              {getAppointmentsForSlot(slot).map((apt) => {
                const durationMinutes =
                  (new Date(apt.endTime).getTime() - new Date(apt.startTime).getTime()) / (1000 * 60);
                const topOffset = 0; // can calculate offset for overlapping
                const height = (durationMinutes / 30) * 50; // each slot 50px height

                return (
                  <div
                    key={apt.id}
                    className="absolute left-0 right-0 px-2 py-1 text-white text-xs rounded"
                    style={{
                      top: topOffset,
                      height,
                      backgroundColor: APPOINTMENT_TYPE_COLOR[apt.type.toLowerCase()] || '#6b7280',
                    }}
                  >
                    <p className="font-medium">{apt.patient.name}</p>
                    <p className="text-[10px]">{apt.type}</p>
                    <p className="text-[10px]">{durationMinutes} min</p>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {appointments.length === 0 && (
        <div className="mt-4 text-center text-gray-500 text-sm">No appointments scheduled for this day</div>
      )}
    </div>
  );
}
