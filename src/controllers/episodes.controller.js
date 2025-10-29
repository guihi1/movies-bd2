import { findEpisodeById, findActorsByMediaId, findReviewsByMediaId } from '../services/media.service.js';

export const showEpisodePage = async (req, res) => {
  try {
    const { showId, episodeId } = req.params;
    const [episode, actors, reviews] = await Promise.all([findEpisodeById(episodeId), findActorsByMediaId(episodeId), findReviewsByMediaId(episodeId)]);

    if (!episode) {
      return res.status(404).render('pages/error', {
        statusCode: 404,
        message: 'Episódio não encontrado',
        description: 'O episódio que você está procurando não existe.'
      });
    }

    res.render('pages/episode-details', {
      episodio: episode,
      atores: actors,
      avaliacoes: reviews,
      pageTitle: episode.titulo,
    });
  } catch (error) {
    console.error(`Erro ao carregar episódio ${req.params.episodeId}:`, error.stack);
    res.status(500).render('pages/error', {
      pageTitle: 'Erro',
      message: 'Não foi possível carregar os dados do episódio.(' + error + ')',
    });
  }
};