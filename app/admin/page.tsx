import AdminPanel from '../components/AdminPannel';
import { Toaster } from 'react-hot-toast';

const AdminPage = () => {
  return (
      <div>
        <Toaster />
        <AdminPanel />
    </div>
  );
};

export default AdminPage;