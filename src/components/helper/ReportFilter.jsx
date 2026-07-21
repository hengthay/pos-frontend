import React, { useState } from "react";
import { CiCalendarDate } from "react-icons/ci";

const ReportFilter = ({ onFilter }) => {
  const [range, setRange] = useState("weekly");

  const getRangeDates = (value) => {
    const now = new Date();
    let startDate = new Date();
    let endDate = new Date();

    switch (value) {
      case "weekly":
        startDate.setDate(now.getDate() - 7);
        break;
      case "monthly":
        startDate.setMonth(now.getMonth() - 1);
        break;
      case "3months":
        startDate.setMonth(now.getMonth() - 3);
        break;
      case "6months":
        startDate.setMonth(now.getMonth() - 6);
        break;
      default:
        break;
    }

    return {
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
    };
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setRange(value);

    const dates = getRangeDates(value);
    onFilter({ start_date: dates.startDate, end_date: dates.endDate });
  };

  return (
    <div className="flex flex-row justify-center items-center gap-2 border border-gray-300 md:px-3 px-1.5 rounded-md">
      <label htmlFor="dates">
        <CiCalendarDate size={20} className="text-blue-500"/>
      </label>
      <select id="dates" value={range} onChange={handleChange} className="p-1 focus:shadow rounded-sm">
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
        <option value="3months">3 Months</option>
        <option value="6months">6 Months</option>
      </select>
    </div>
  );
};

export default ReportFilter;