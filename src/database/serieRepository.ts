import { getDatabase } from "./database";
import { Serie, CreateSerieInput, UpdateSerieInput, SerieFilter } from "../types/serie";

export async function getSeries(filtro: SerieFilter): Promise<Serie[]> {
  const db = await getDatabase();
  return db.getAllAsync<Serie>(
    `SELECT * FROM serie
     WHERE CASE ?
       WHEN 'todas'      THEN 1
       WHEN 'assistindo' THEN concluida = 0
       WHEN 'concluidas' THEN concluida = 1
       ELSE 0
     END
     ORDER BY createdAt DESC, id DESC`,
    filtro
  );
}

export async function getSerieById(id: number): Promise<Serie | null> {
  const db = await getDatabase();
  return db.getFirstAsync<Serie>('SELECT * FROM serie WHERE id = ?', id);
}

export async function createSerie(input: CreateSerieInput): Promise<Serie> {
  const db = await getDatabase();
  const createdAt = new Date().toISOString();
  const result = await db.runAsync(
    `INSERT INTO serie (titulo, plataforma, temporadas, nota, concluida, createdAt)
     VALUES (?, ?, ?, ?, 0, ?)`,
    input.titulo,
    input.plataforma,
    input.temporadas,
    input.nota,
    createdAt
  );
  return {
    id: result.lastInsertRowId,
    ...input,
    concluida: 0,
    createdAt,
  };
}

export async function updateSerie(id: number, input: UpdateSerieInput): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `UPDATE serie
     SET titulo = ?, plataforma = ?, temporadas = ?, nota = ?, concluida = ?
     WHERE id = ?`,
    input.titulo,
    input.plataforma,
    input.temporadas,
    input.nota,
    input.concluida,
    id
  );
}

export async function toggleSerieConcluida(id: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('UPDATE serie SET concluida = 1 - concluida WHERE id = ?', id);
}

export async function deleteSerie(id: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM serie WHERE id = ?', id);
}