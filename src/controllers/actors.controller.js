import { findAllActorsGrouped } from '../services/actors.service.js';

export const showAllActorsPage = async (req, res) => {
  try {
    const [actors] = await Promise.all([findAllActorsGrouped()]);

    if (!actors) {
      return res.status(404).render('pages/error', {
        statusCode: 404,
        message: 'Atores não foram encontrados',
        description: 'Algo deu errado na procura dos atores.'
      });
    }

    
    res.render('pages/actors', {
      pageTitle: 'RMGe: Atores',
      atores: actors,
    });

  } catch (error) {
    console.error('Erro ao carregar dados da página inicial:', error.stack);
    res.status(500).render('pages/error', {
      pageTitle: 'Erro',
      message: 'Não foi possível carregar os dados completos da página de atores.',
      description: 'Tente novamente mais tarde. Se o problema persistir, contacte o suporte.'
    });
  }
};