import { findMovies, findShows } from '../services/media.service.js';

export const showHomePage = async (req, res) => {
  try {
    const [movies, shows] = await Promise.all([
      findMovies(),
      findShows()
    ]);
    
    res.render('pages/index', {
      pageTitle: 'Bem-vindo!',
      movies: movies,
      shows: shows
    });

  } catch (error) {
    console.error('Erro ao carregar dados da página inicial:', error.stack);
    res.status(500).render('pages/error', {
      pageTitle: 'Erro',
      message: 'Não foi possível carregar os dados completos da página inicial.',
      description: 'Tente novamente mais tarde. Se o problema persistir, contacte o suporte.'
    });
  }
};