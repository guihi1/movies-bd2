import { findAllShowsGrouped } from '../services/media.service.js';

export const showAllShowsPage = async (req, res) => {
  try {
    const [shows] = await Promise.all([findAllShowsGrouped()]);

    if (!shows) {
      return res.status(404).render('pages/error', {
        statusCode: 404,
        message: 'Séries não foram encontrados',
        description: 'Algo deu errado na procura dos séries.'
      });
    }

    
    res.render('pages/shows', {
      pageTitle: 'RMGe: Séries',
      series: shows,
    });

  } catch (error) {
    console.error('Erro ao carregar dados da página inicial:', error.stack);
    res.status(500).render('pages/error', {
      pageTitle: 'Erro',
      message: 'Não foi possível carregar os dados completos da página de séries.',
      description: 'Tente novamente mais tarde. Se o problema persistir, contacte o suporte.'
    });
  }
};