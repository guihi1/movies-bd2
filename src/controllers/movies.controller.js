import { findAllMoviesGrouped } from '../services/media.service.js';

export const showAllMoviesPage = async (req, res) => {
  try {
    const [movies] = await Promise.all([findAllMoviesGrouped()]);

    if (!movies) {
      return res.status(404).render('pages/error', {
        statusCode: 404,
        message: 'Filmes não foram encontrados',
        description: 'Algo deu errado na procura dos filmes.'
      });
    }

    
    res.render('pages/movies', {
      pageTitle: 'RMGe: Filmes',
      filmes: movies,
    });

  } catch (error) {
    console.error('Erro ao carregar dados da página inicial:', error.stack);
    res.status(500).render('pages/error', {
      pageTitle: 'Erro',
      message: 'Não foi possível carregar os dados completos da página de filmes.',
      description: 'Tente novamente mais tarde. Se o problema persistir, contacte o suporte.'
    });
  }
};