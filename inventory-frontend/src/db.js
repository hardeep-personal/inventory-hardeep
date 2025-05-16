import Dexie from 'dexie';

const db = new Dexie('InventoryDB');
db.version(1).stores({
  queue: '++id, action, name, sku, quantity, price, expiryDate, supplier'
});

export default db;
    