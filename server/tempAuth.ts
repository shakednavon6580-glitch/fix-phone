/**
 * TEMPORARY LOCAL AUTHENTICATION SYSTEM
 * 
 * This is a temporary authentication system for testing purposes.
 * Replace with n8n webhook integration once it's properly configured.
 * 
 * Test Users:
 * - Admin: username="admin", password="admin123"
 * - User: username="user", password="user123"
 */

interface TestUser {
  userId: string;
  username: string;
  password: string;
  role: 'admin' | 'user';
}

const TEST_USERS: TestUser[] = [
  {
    userId: '1',
    username: 'admin',
    password: 'admin123',
    role: 'admin'
  },
  {
    userId: '2',
    username: 'user',
    password: 'user123',
    role: 'user'
  }
];

export function authenticateUser(username: string, password: string): { success: boolean; userId?: string; username?: string; role?: string; message?: string } {
  const user = TEST_USERS.find(u => u.username === username && u.password === password);
  
  if (user) {
    return {
      success: true,
      userId: user.userId,
      username: user.username,
      role: user.role
    };
  }
  
  return {
    success: false,
    message: 'שם משתמש או סיסמה שגויים'
  };
}
