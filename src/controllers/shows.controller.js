import { findShowById, findActorsByShowId } from '../services/media.service.js'

export const showShowPage = async (req, res) => {
  try {
    const { id } = req.params;
    const [show, actors] = await Promise.all([findShowById(id), findActorsByShowId(id)]);

    if (!show) {
      return res.status(404).render('pages/error', {
        statusCode: 404,
        message: 'Série não encontrada',
        description: 'A série que você está procurando não existe.'
      });
    }

    res.render('pages/show-details', {
      serie: show,
      atores: actors,
      temporadas: show.numero_de_temporadas,
      pageTitle: show.nome,
    });

  } catch (error) {
    res.status(500).render('pages/error', {
      statusCode: 500,
      message: 'Erro no servidor'
    });
  }
};

