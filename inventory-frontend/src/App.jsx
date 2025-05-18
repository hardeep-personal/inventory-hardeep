

import { useEffect, useState } from 'react';
import { syncWithServer } from './sync';
import toast from 'react-hot-toast';
import Router from './routes/Router';

function App() {
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const handleOnline = async () => {
      toast.loading('You are back online. Syncing...');
      await syncWithServer(setSyncing);
      toast.dismiss();
      toast.success('Offline data synced successfully');
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, []);


  


console.log("syncing",syncing)

  return (
    <div>
      {syncing && (
        <div className="fixed top-0 left-0 w-full bg-blue-600 text-white text-sm text-center py-2 z-50 shadow">
          Syncing offline data with server...
          <div className="h-1 bg-white animate-pulse w-full mt-1"></div>
        </div>
      )}

      <Router />
    </div>
  )
}

export default App
