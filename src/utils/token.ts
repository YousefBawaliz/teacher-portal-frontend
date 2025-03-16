interface DecodedToken {
  exp: number;
  sub: string;
  role: string;
}

export class TokenUtil {
  static decodeToken(token: string): DecodedToken | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      return null;
    }
  }

  static isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded) return true;
    
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  }

  static getTokenExpirationTime(token: string): number | null {
    const decoded = this.decodeToken(token);
    return decoded ? decoded.exp : null;
  }

  static getUserIdFromToken(token: string): string | null {
    const decoded = this.decodeToken(token);
    return decoded ? decoded.sub : null;
  }

  static getRoleFromToken(token: string): string | null {
    const decoded = this.decodeToken(token);
    return decoded ? decoded.role : null;
  }
}