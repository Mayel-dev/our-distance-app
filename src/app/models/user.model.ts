export interface User {
  id: string;
  username: string;
  email: string;
  pairingCode: string;
  createdAt: string;
  partner?: User;
}
