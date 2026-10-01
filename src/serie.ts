export interface Serie {
  id: number;
  titulo: string;
  plataforma: string;
  temporadas: number;
  nota: number | null; // 1 a 5, ou null quando sem nota
  concluida: number; // 0 ou 1 — SQLite não tem booleano
  createdAt: string; // ISO 8601
}

export type CreateSerieInput = Omit<Serie, 'id' | 'createdAt' | 'concluida'>;

export type UpdateSerieInput = Omit<Serie, 'id' | 'createdAt'>;

export type SerieFilter = 'todas' | 'assistindo' | 'concluidas';
