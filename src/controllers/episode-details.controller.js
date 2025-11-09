import { findMovieById, findActorsByMediaId, findDirectorsByMediaId, findWritersByMediaId, findProducersByMediaId, findReviewsByMediaId } from '../services/media.service.js'
export const showEpisodePage = async (req, res) => {
  try {
      const { episodeId } = req.params;
      const [movie, actors, directors, wirters, producers, reviews] = await Promise.all([
        findMovieById(episodeId),
        findActorsByMediaId(episodeId),
        findDirectorsByMediaId(episodeId),
        findWritersByMediaId(episodeId),
        findProducersByMediaId(episodeId),
        findReviewsByMediaId(episodeId)
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
  