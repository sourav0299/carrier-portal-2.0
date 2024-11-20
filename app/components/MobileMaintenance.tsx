import React from 'react';

const MobileMaintenance: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Mobile View Under Maintenance</h1>
        <p className="mb-4">Please open this site on a PC or laptop for the best experience.</p>
      </div>
    </div>
  );
};

export default MobileMaintenance;