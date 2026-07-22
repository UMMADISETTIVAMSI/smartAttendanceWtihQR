import useAuth from '../hooks/useAuth';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-md space-y-4">
      <h2 className="text-xl font-bold text-gray-800">My Profile</h2>
      <div className="bg-white rounded-xl shadow p-6 space-y-3">
        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-2xl font-bold">
          {user?.name?.[0]}
        </div>
        {[['Name', user?.name], ['Email', user?.email], ['Role', user?.role]].map(([label, value]) => (
          <div key={label}>
            <p className="text-xs text-gray-500 uppercase">{label}</p>
            <p className="font-medium text-gray-800">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
