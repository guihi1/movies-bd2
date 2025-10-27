import { findPersonByActorId, findMediaByActorId } from '../services/actors.service.js';

export const showActorPage = async (req, res) => {
  try {
    const { id } = req.params;

    const [person, media] = await Promise.all([
      findPersonByActorId(id),
      findMediaByActorId(id)
    ]);

    if (!person) {
      return res.status(404).render('pages/error', { message: 'Ator não encontrado' });
    }

    res.render('pages/actor-details', {
      pessoa: person,
      filmografia: media,
      pageTitle: person.nome
    });

  } catch (error) {
    console.error(error);
    res.status(500).render('pages/error', { message: 'Erro no servidor' });
  }
};
