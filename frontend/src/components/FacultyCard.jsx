const FacultyCard = ({ faculty }) => (
  <div className="bg-white rounded-xl shadow p-5 border border-gray-100">
    <div className="flex items-center gap-4">
      <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-xl font-bold">
        {faculty?.user?.name?.[0] ?? 'F'}
      </div>
      <div>
        <h3 className="font-semibold text-gray-800">{faculty?.user?.name}</h3>
        <p className="text-sm text-gray-500">{faculty?.employeeId} · {faculty?.department}</p>
        <p className="text-sm text-gray-500">{faculty?.designation}</p>
      </div>
    </div>
  </div>
);

export default FacultyCard;
