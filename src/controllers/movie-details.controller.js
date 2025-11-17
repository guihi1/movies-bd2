import { findMovieById, findActorsByMediaId, findDirectorsByMediaId, findWritersByMediaId, findProducersByMediaId, findReviewsByMediaId, findGenreByMediaId } from '../services/media.service.js'

export const showMoviePage = async (req, res) => {
  try {
    const { id } = req.params;
    const [movie, actors, directors, wirters, producers, reviews, genre] = await Promise.all([
      findMovieById(id),
      findActorsByMediaId(id),
      findDirectorsByMediaId(id),
      findWritersByMediaId(id),
      findProducersByMediaId(id),
      findReviewsByMediaId(id),
      findGenreByMediaId(id)
    ]);

    if (!movie) {
      return res.status(404).render('pages/error', {
        statusCode: 404,
        message: 'Série não encontrada',
        description: 'O filme que você está procurando não existe.'
      });
    }

    res.render('pages/movie-details', {
      filme: movie,
      genero: genre,
      atores: actors,
      diretores: directors,
      roteiristas: wirters,
      produtores: producers,
      pageTitle: movie.nome,
      avaliacoes: reviews
    });

  } catch (error) {
    res.status(500).render('pages/error', {
      statusCode: 500,
      message: 'Erro no servidor\n(' + error + ')'
    });
  }
};

