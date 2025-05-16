import db from './db';
import axios from 'axios';

export const syncWithServer = async (setSyncing) => {
    const queue = await db.queue.toArray();
    if (queue.length === 0) return;

    setSyncing(true); // Show loader

    for (const entry of queue) {
        try {
            if (entry.action === 'add') {
                await axios.post('/api/products', entry.data);
            } else if (entry.action === 'update') {
                await axios.put(`/api/products/${entry.data.id}`, entry.data);
            } else if (entry.action === 'delete') {
                await axios.delete(`/api/products/${entry.data.id}`);
            }
            await db.queue.delete(entry.id);
        } catch (err) {
            console.error('Sync failed:', err);
        }
    }

    setSyncing(false); // Hide loader
};

