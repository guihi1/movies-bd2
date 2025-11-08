import { findAllDirectorsGrouped } from '../services/directors.service.js';

export const showAllDirectorsPage = async (req, res) => {
  try {
    const [directors] = await Promise.all([findAllDirectorsGrouped()]);

    if (!directors) {
      return res.status(404).render('pages/error', {
        statusCode: 404,
        message: 'Diretores não foram encontrados',
        description: 'Algo deu errado na procura dos diretores.'
      });
    }

    
    res.render('pages/directors', {
      pageTitle: 'RMGe: Diretores',
      diretores: directors,
    });

  } catch (error) {
    console.error('Erro ao carregar dados da página inicial:', error.stack);
    res.status(500).render('pages/error', {
      pageTitle: 'Erro',
      message: 'Não foi possível carregar os dados completos da página de diretores.',
      description: 'Tente novamente mais tarde. Se o problema persistir, contacte o suporte.'
    });
  }
};