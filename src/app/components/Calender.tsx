import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const AdminCalendar: React.FC = () => {
  const [date, setDate] = useState<Date | [Date, Date]>(new Date());
  
  const handleDateChange = (newDate: Date | [Date, Date], event: React.MouseEvent<HTMLButtonElement>) => {
    setDate(newDate);
  };

  return (
    <div className="calendar-container">
      <h2 className="text-xl font-semibold">Admin Dashboard Calendar</h2>
      <Calendar
        onChange={(value, event) => handleDateChange(value as Date | [Date, Date], event)}
        value={date}
        className="my-4"
      />
    </div>
  );
};

export default AdminCalendar;
