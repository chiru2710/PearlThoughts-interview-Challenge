'use client';

import { useState, useEffect } from 'react';
import type { Doctor, DayOfWeek, WorkingHours } from '@/types';
import { appointmentService } from '@/services/appointmentService';

interface DoctorSelectorProps {
  selectedDoctorId: string;
  onDoctorChange: (doctorId: string) => void;
}

export function DoctorSelector({
  selectedDoctorId,
  onDoctorChange,
}: DoctorSelectorProps) {
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    const allDoctors = appointmentService.getAllDoctors();
    setDoctors(allDoctors);
  }, []);

  const selectedDoctor = doctors.find((d) => d.id === selectedDoctorId);

  // Get today's working hours safely
  const todayIndex = new Date().getDay(); // 0 = Sunday
  const dayMap: DayOfWeek[] = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ];
  const todayKey = dayMap[todayIndex];
  const workingHours: WorkingHours | undefined = selectedDoctor?.workingHours?.[todayKey];

  return (
    <div className="doctor-selector w-full max-w-sm">
      <select
        value={selectedDoctorId}
        onChange={(e) => onDoctorChange(e.target.value)}
        className="block w-full px-4 py-2 pr-8 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select a doctor...</option>
        {doctors.map((doctor) => (
          <option key={doctor.id} value={doctor.id}>
            Dr. {doctor.name} - {doctor.specialty}
          </option>
        ))}
      </select>

      {workingHours && (
        <p className="mt-2 text-sm text-gray-600">
          Working hours: {workingHours.start} - {workingHours.end}
        </p>
      )}
    </div>
  );
}
