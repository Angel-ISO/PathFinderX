export class UserContextService {
  constructor() {}

  getUserId(req) {
    return req.user?.userId;
  }

  getUsername(req) {
    return req.user?.username || req.user?.sub;
  }

  getRole(req) {
    return req.user?.role || req.user?.authorities;
  }

  getIsVerified(req) {
    return req.user?.isVerified || false;
  }

  getUserContext(req) {
    return {
      userId: this.getUserId(req),
      username: this.getUsername(req),
      role: this.getRole(req),
      isVerified: this.getIsVerified(req)
    };
  }
}

export const userContextService = new UserContextService();