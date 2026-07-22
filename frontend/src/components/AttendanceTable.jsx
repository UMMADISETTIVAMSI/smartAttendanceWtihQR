import { formatDate, formatTime, getAttendanceColor } from '../utils/helpers';

const AttendanceTable = ({ records }) => {
  if (!records?.length) return <p className="text-gray-500 text-sm">No attendance records found.</p>;

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
          <tr>
            {['Date', 'Subject', 'Faculty', 'Period', 'Section', 'Time', 'Status'].map((h) => (
              <th key={h} className="px-4 py-3 text-left">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {records.map((r) => (
            <tr key={r.id} className="hover:bg-gray-50">
              <td className="px-4 py-2">{formatDate(r.date)}</td>
              <td className="px-4 py-2">{r.subjectName} <span className="text-gray-400">({r.subjectCode})</span></td>
              <td className="px-4 py-2">{r.facultyName}</td>
              <td className="px-4 py-2">{r.period}</td>
              <td className="px-4 py-2">{r.section}</td>
              <td className="px-4 py-2">{formatTime(r.time)}</td>
              <td className="px-4 py-2">
                <span className={`font-semibold ${r.status === 'PRESENT' ? 'text-green-600' : 'text-red-500'}`}>
                  {r.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTable;
