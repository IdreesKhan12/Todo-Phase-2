/**
 * Better Auth integration for the Todo application.
 * This is a stub implementation that will be completed when the frontend is developed.
 */

// Placeholder for Better Auth integration
// This will be implemented when the frontend is built with Better Auth

const auth = {
  signIn: async (credentials) => {
    // This will integrate with Better Auth to sign in
    // For now, return a mock response
    console.log('Sign in with credentials:', credentials);
    return { success: true, token: 'mock_jwt_token' };
  },

  signOut: async () => {
    // This will integrate with Better Auth to sign out
    localStorage.removeItem('jwt_token');
    return { success: true };
  },

  getCurrentUser: async () => {
    // This will return the current authenticated user
    // Will be implemented with Better Auth user context
    const token = localStorage.getItem('jwt_token');
    if (!token) {
      return null;
    }
    // In real implementation, decode the token or call API to get user
    return { id: 'mock_user_id', email: 'user@example.com' };
  },

  isAuthenticated: () => {
    // Check if the user is authenticated
    const token = localStorage.getItem('jwt_token');
    return !!token;
  }
};

export default auth;