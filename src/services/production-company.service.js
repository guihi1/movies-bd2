import pool from '../config/db.js';

export const findProductionCompanyById = async (id) => {
  try {
    const query = `
      SELECT 
      FROM 
      JOIN 
      ORDER 
    `;
    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    console.error('Erro ao buscar produtora:', error.stack);
    throw error;
  }
};

export const findMediaByProductionCompanyId = async (id) => {
  try {
    const query = `
      SELECT 
      FROM 
      JOIN 
      ORDER 
    `;
    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    console.error('Erro ao buscar mídia por id da produtora:', error.stack);
    throw error;
  }
};
