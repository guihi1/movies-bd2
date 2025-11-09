import { findAllWritersGrouped } from '../services/writers.service.js';

export const showAllWritersPage = async (req, res) => {
  try {
    const [writers] = await Promise.all([findAllWritersGrouped()]);

    if (!writers) {
      return res.status(404).render('pages/error', {
        statusCode: 404,
        message: 'Roteiristas não foram encontrados',
        description: 'Algo deu errado na procura dos roteiristas.'
      });
    }

    
    res.render('pages/writers', {
      pageTitle: 'RMGe: Roteiristas',
      roteiristas: writers,
    });

  } catch (error) {
    console.error('Erro ao carregar dados da página inicial:', error.stack);
    res.status(500).render('pages/error', {
      pageTitle: 'Erro',
      message: 'Não foi possível carregar os dados completos da página de roteiristas.',
      description: 'Tente novamente mais tarde. Se o problema persistir, contacte o suporte.'
    });
  }
};