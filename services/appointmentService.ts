// /**
//  * Appointment Service
//  *
//  * This service provides an abstraction layer for accessing appointment data.
//  * It's your data access layer - implement the methods to fetch and filter appointments.
//  *
//  * TODO for candidates:
//  * 1. Implement getAppointmentsByDoctor
//  * 2. Implement getAppointmentsByDoctorAndDate
//  * 3. Implement getAppointmentsByDoctorAndDateRange (for week view)
//  * 4. Consider adding helper methods for filtering, sorting, etc.
//  * 5. Think about how to structure this for testability
//  */

// import type { Appointment, Doctor, Patient, PopulatedAppointment } from '@/types';
// import {
//   MOCK_APPOINTMENTS,
//   MOCK_DOCTORS,
//   MOCK_PATIENTS,
//   getDoctorById,
//   getPatientById,
// } from '@/data/mockData';

// /**
//  * AppointmentService class
//  *
//  * Provides methods to access and manipulate appointment data.
//  * This is where you abstract data access from your components.
//  */
// export class AppointmentService {
//   /**
//    * Get all appointments for a specific doctor
//    *
//    * TODO: Implement this method
//    */
//   getAppointmentsByDoctor(doctorId: string): Appointment[] {
//     // TODO: Implement - filter MOCK_APPOINTMENTS by doctorId
//     throw new Error('Not implemented - getAppointmentsByDoctor');
//   }

//   /**
//    * Get appointments for a specific doctor on a specific date
//    *
//    * TODO: Implement this method
//    * @param doctorId - The doctor's ID
//    * @param date - The date to filter by
//    * @returns Array of appointments for that doctor on that date
//    */
//   getAppointmentsByDoctorAndDate(doctorId: string, date: Date): Appointment[] {
//     // TODO: Implement - filter by doctor AND date
//     // Hint: You'll need to compare dates properly (same day, ignoring time)
//     throw new Error('Not implemented - getAppointmentsByDoctorAndDate');
//   }

//   /**
//    * Get appointments for a specific doctor within a date range (for week view)
//    *
//    * TODO: Implement this method
//    * @param doctorId - The doctor's ID
//    * @param startDate - Start of the date range
//    * @param endDate - End of the date range
//    * @returns Array of appointments within the date range
//    */
//   getAppointmentsByDoctorAndDateRange(
//     doctorId: string,
//     startDate: Date,
//     endDate: Date
//   ): Appointment[] {
//     // TODO: Implement - filter by doctor AND date range
//     throw new Error('Not implemented - getAppointmentsByDoctorAndDateRange');
//   }

//   /**
//    * Get a populated appointment (with patient and doctor objects)
//    *
//    * This is useful for display purposes where you need patient/doctor details
//    *
//    * TODO: Implement this helper method
//    */
//   getPopulatedAppointment(appointment: Appointment): PopulatedAppointment | null {
//     // TODO: Implement - merge appointment with patient and doctor data
//     // Hint: Use getDoctorById and getPatientById from mockData
//     throw new Error('Not implemented - getPopulatedAppointment');
//   }

//   /**
//    * Get all doctors
//    *
//    * TODO: Implement this method
//    */
//   getAllDoctors(): Doctor[] {
//     // TODO: Implement - return all doctors
//     throw new Error('Not implemented - getAllDoctors');
//   }

//   /**
//    * Get doctor by ID
//    *
//    * TODO: Implement this method
//    */
//   getDoctorById(id: string): Doctor | undefined {
//     // TODO: Implement - find doctor by ID
//     throw new Error('Not implemented - getDoctorById');
//   }

//   /**
//    * BONUS: Add any other helper methods you think would be useful
//    * Examples:
//    * - Sort appointments by time
//    * - Check for overlapping appointments
//    * - Get appointments by type
//    * - etc.
//    */
// }

// /**
//  * Singleton instance (optional pattern)
//  *
//  * You can either:
//  * 1. Export a singleton instance: export const appointmentService = new AppointmentService();
//  * 2. Or let consumers create their own instances: new AppointmentService()
//  *
//  * Consider which is better for your architecture and testing needs.
//  */
// export const appointmentService = new AppointmentService();





// services/appointmentService.ts
import type { Appointment, Doctor, Patient, PopulatedAppointment } from '@/types';
import {
  MOCK_APPOINTMENTS,
  MOCK_DOCTORS,
  MOCK_PATIENTS,
  getDoctorById,
  getPatientById,
} from '@/data/mockData';
import { isSameDay, isWithinInterval } from 'date-fns';

export class AppointmentService {
  // Get all appointments for a specific doctor
  getAppointmentsByDoctor(doctorId: string): Appointment[] {
    return MOCK_APPOINTMENTS.filter(a => a.doctorId === doctorId);
  }

  // Get appointments for a specific doctor on a specific date
  getAppointmentsByDoctorAndDate(doctorId: string, date: Date): Appointment[] {
    return MOCK_APPOINTMENTS.filter(a => {
      return (
        a.doctorId === doctorId &&
        isSameDay(new Date(a.startTime), date)
      );
    });
  }

  // Get appointments for a specific doctor within a date range (week view)
  getAppointmentsByDoctorAndDateRange(
    doctorId: string,
    startDate: Date,
    endDate: Date
  ): Appointment[] {
    return MOCK_APPOINTMENTS.filter(a => {
      const aptDate = new Date(a.startTime);
      return (
        a.doctorId === doctorId &&
        isWithinInterval(aptDate, { start: startDate, end: endDate })
      );
    });
  }

  // Get a populated appointment (merge with doctor and patient data)
  getPopulatedAppointment(appointment: Appointment): PopulatedAppointment | null {
    const doctor = getDoctorById(appointment.doctorId);
    const patient = getPatientById(appointment.patientId);
    if (!doctor || !patient) return null;
    return { ...appointment, doctor, patient };
  }

  // Get all doctors
  getAllDoctors(): Doctor[] {
    return MOCK_DOCTORS;
  }

  // Get a doctor by ID
  getDoctorById(id: string): Doctor | undefined {
    return MOCK_DOCTORS.find(d => d.id === id);
  }

  // BONUS: Sort appointments by start time
  sortAppointmentsByTime(appointments: Appointment[]): Appointment[] {
    return [...appointments].sort(
      (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );
  }

  // BONUS: Check if an appointment overlaps with others
  hasOverlappingAppointments(appointment: Appointment, appointments: Appointment[]): boolean {
    const startA = new Date(appointment.startTime).getTime();
    const endA = new Date(appointment.endTime).getTime();
    return appointments.some(a => {
      const startB = new Date(a.startTime).getTime();
      const endB = new Date(a.endTime).getTime();
      return startA < endB && endA > startB;
    });
  }
}

// Singleton instance
export const appointmentService = new AppointmentService();
