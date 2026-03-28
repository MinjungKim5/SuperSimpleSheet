import { sql } from '@vercel/postgres';

export type Sheet = {
  id: string;
  tableName: string;
  data: string; // JSON string
  updatedAt: string;
}

export const db = {
  getSheets: async () => {
    const { rows } = await sql`SELECT id, table_name as "tableName", updated_at as "updatedAt" FROM sheets ORDER BY updated_at DESC`;
    return rows as Partial<Sheet>[];
  },

  getSheet: async (tableName: string) => {
    const { rows } = await sql`SELECT id, table_name as "tableName", data, updated_at as "updatedAt" FROM sheets WHERE table_name = ${tableName}`;
    return rows.length > 0 ? (rows[0] as Sheet) : null;
  },

  createSheet: async (sheet: Sheet) => {
    try {
      await sql`
        INSERT INTO sheets (id, table_name, data, updated_at)
        VALUES (${sheet.id}, ${sheet.tableName}, ${sheet.data}, ${sheet.updatedAt})
      `;
    } catch (error: any) {
      if (error.code === '23505') throw new Error('EXISTS'); // Unique violation
      throw error;
    }
  },

  updateSheet: async (oldName: string, newName: string, data: string) => {
    try {
      const updatedAt = new Date().toISOString();
      const result = await sql`
        UPDATE sheets 
        SET table_name = ${newName}, data = ${data}, updated_at = ${updatedAt}
        WHERE table_name = ${oldName}
      `;
      if (result.rowCount === 0) throw new Error('NOT_FOUND');
    } catch (error: any) {
      if (error.code === '23505') throw new Error('EXISTS');
      throw error;
    }
  },

  deleteSheet: async (tableName: string) => {
    const result = await sql`DELETE FROM sheets WHERE table_name = ${tableName}`;
    if (result.rowCount === 0) throw new Error('NOT_FOUND');
  }
};
