import { findMovies } from '../services/media.service.js';

export const showHomePage = async (req, res) => {
  try {
    const movies = await findMovies();

    res.render('pages/index', {
      pageTitle: 'Bem-vindo!',
      movies: movies,
    });

  } catch (error) {
    res.status(500).render('pages/error', {
      pageTitle: 'Erro',
      message: 'Não foi possível carregar os dados da página inicial.'
    });
  }
};
