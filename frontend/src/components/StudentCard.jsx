import { getAttendanceColor } from '../utils/helpers';

const StudentCard = ({ student, percentage }) => (
  <div className="bg-white rounded-xl shadow p-5 border border-gray-100">
    <div className="flex items-center gap-4">
      <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xl font-bold">
        {student?.user?.name?.[0] ?? 'S'}
      </div>
      <div>
        <h3 className="font-semibold text-gray-800">{student?.user?.name}</h3>
        <p className="text-sm text-gray-500">{student?.rollNumber} · {student?.department}</p>
        <p className="text-sm text-gray-500">Sem {student?.semester} · Section {student?.section}</p>
      </div>
    </div>
    {percentage !== undefined && (
      <div className={`mt-3 text-sm font-semibold ${getAttendanceColor(percentage)}`}>
        Overall Attendance: {percentage}%
      </div>
    )}
  </div>
);

export default StudentCard;
