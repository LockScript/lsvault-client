import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

interface DecodedToken {
    _id: string;
    email: string;
}

export const getDecodedToken = (): DecodedToken | null => {
  const token = Cookies.get('token');

  if (!token) {
    return null;
  }

  const decodedToken = jwtDecode<DecodedToken>(token);

  return decodedToken;
};

export const getEmailFromToken = (): string | null => {
  const decodedToken = getDecodedToken();

  return decodedToken ? decodedToken.email : null;
};

export const getIdFromToken = (): string | null => {
  const decodedToken = getDecodedToken();

  return decodedToken ? decodedToken._id : null;
};

export const isTokenExpired = (): boolean => {
  const token = Cookies.get('token');

  if (!token) {
    return true;
  }

  const decodedToken = jwtDecode<{ exp: number }>(token);

  const currentTime = Date.now().valueOf() / 1000;

  return decodedToken.exp < currentTime;
};