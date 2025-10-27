import { findMovieById, findActorsByMediaId, findReviewsByMediaId } from '../services/media.service.js'

export const showMoviePage = async (req, res) => {
  try {
    const { id } = req.params;
    const [movie, actors, reviews] = await Promise.all([findMovieById(id), findActorsByMediaId(id), findReviewsByMediaId(id)]);

    if (!movie) {
      return res.status(404).render('pages/error', {
        statusCode: 404,
        message: 'Filme não encontrado',
        description: 'O filme que você está procurando não existe.'
      });
    }

    res.render('pages/movie-details', {
      filme: movie,
      atores: actors,
      avaliacoes: reviews,
      pageTitle: movie.titulo,
    });

  } catch (error) {
    res.status(500).render('pages/error', {
      statusCode: 500,
      message: 'Erro no servidor'
    });
  }
};

