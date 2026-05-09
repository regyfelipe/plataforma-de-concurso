export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'ALUNO' | 'PROFESSOR' | 'ADMIN';
}
