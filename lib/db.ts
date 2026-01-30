
import alasql from 'alasql';
import { User, Transfer, UserRole, TransferStatus } from '../types';

// تهيئة قاعدة البيانات SQL
// ملاحظة: AlaSQL يحاكي محرك SQLite في المتصفح
alasql('CREATE TABLE IF NOT EXISTS users (id STRING, username STRING, password STRING, role STRING, fullName STRING)');
alasql('CREATE TABLE IF NOT EXISTS transfers (id STRING, customerName STRING, bankAccount STRING, amount NUMBER, createdAt STRING, createdBy STRING, creatorName STRING, status STRING, updatedAt STRING)');

// استرجاع البيانات المخزنة سابقاً من LocalStorage إذا وجدت
const savedUsers = localStorage.getItem('sql_users');
const savedTransfers = localStorage.getItem('sql_transfers');

if (savedUsers) {
  alasql('DELETE FROM users');
  alasql(`INSERT INTO users SELECT * FROM ?`, [JSON.parse(savedUsers)]);
}
if (savedTransfers) {
  alasql('DELETE FROM transfers');
  alasql(`INSERT INTO transfers SELECT * FROM ?`, [JSON.parse(savedTransfers)]);
}

// وظيفة لحفظ الحالة الحالية في LocalStorage (Persistence)
const persist = () => {
  const users = alasql('SELECT * FROM users');
  const transfers = alasql('SELECT * FROM transfers');
  localStorage.setItem('sql_users', JSON.stringify(users));
  localStorage.setItem('sql_transfers', JSON.stringify(transfers));
};

export const DB = {
  // إدارة المستخدمين باستخدام SQL
  getUsers: (): User[] => {
    return alasql('SELECT * FROM users') as User[];
  },

  saveUser: (user: User) => {
    alasql('INSERT INTO users VALUES (?,?,?,?,?)', [
      user.id, 
      user.username, 
      user.password, 
      user.role, 
      user.fullName
    ]);
    persist();
  },

  findUser: (username: string): User | undefined => {
    const results = alasql('SELECT * FROM users WHERE username = ?', [username]) as User[];
    return results[0];
  },

  // إدارة الحوالات باستخدام SQL
  getTransfers: (): Transfer[] => {
    return alasql('SELECT * FROM transfers ORDER BY createdAt DESC') as Transfer[];
  },

  createTransfer: (transfer: Omit<Transfer, 'id' | 'createdAt' | 'status'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const createdAt = new Date().toISOString();
    const status = TransferStatus.NOT_REACHED;

    alasql('INSERT INTO transfers VALUES (?,?,?,?,?,?,?,?,?)', [
      id,
      transfer.customerName,
      transfer.bankAccount,
      transfer.amount,
      createdAt,
      transfer.createdBy,
      transfer.creatorName,
      status,
      null
    ]);
    persist();
    
    return { id, createdAt, status, ...transfer } as Transfer;
  },

  updateTransferStatus: (transferId: string, status: TransferStatus) => {
    const updatedAt = new Date().toISOString();
    alasql('UPDATE transfers SET status = ?, updatedAt = ? WHERE id = ?', [
      status, 
      updatedAt, 
      transferId
    ]);
    persist();
  },

  // إدارة الجلسة الحالية
  setCurrentUser: (user: User | null) => {
    if (user) {
      localStorage.setItem('mtms_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('mtms_current_user');
    }
  },

  getCurrentUser: (): User | null => {
    const data = localStorage.getItem('mtms_current_user');
    return data ? JSON.parse(data) : null;
  }
};
