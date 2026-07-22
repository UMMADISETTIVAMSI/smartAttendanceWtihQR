import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import AttendanceTable from '../components/AttendanceTable';
import Loading from '../components/Loading';
import { getAttendanceHistoryApi } from '../services/studentService';

const AttendancePage = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAttendanceHistoryApi()
      .then((r) => setRecords(r.data))
      .catch(() => toast.error('Failed to load attendance'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800">Attendance History</h2>
      <AttendanceTable records={records} />
    </div>
  );
};

export default AttendancePage;
