export const mockAuth = {
  login: (userData: any) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('devlynix_session', JSON.stringify(userData));
    }
  },
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('devlynix_session');
      localStorage.removeItem('devlynix_profile');
    }
  },
  getSession: () => {
    if (typeof window !== 'undefined') {
      const session = localStorage.getItem('devlynix_session');
      return session ? JSON.parse(session) : null;
    }
    return null;
  },
  saveProfile: (profileData: any) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('devlynix_profile', JSON.stringify(profileData));
    }
  },
  getProfile: () => {
    if (typeof window !== 'undefined') {
      const profile = localStorage.getItem('devlynix_profile');
      return profile ? JSON.parse(profile) : null;
    }
    return null;
  }
};
