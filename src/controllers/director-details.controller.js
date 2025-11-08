import { findPersonByDirectorId, findMediaByDirectorId, findAwardsByDirectorId } from '../services/directors.service.js';

export const showDirectorPage = async (req, res) => {
  try {
    const { id } = req.params;

    const [person, media, premiacoes] = await Promise.all([
      findPersonByDirectorId(id),
      findMediaByDirectorId(id),
      findAwardsByDirectorId(id)
    ]);

    if (!person) {
      return res.status(404).render('pages/error', { message: 'Diretor não encontrado' });
    }

    res.render('pages/director-details', {
      pessoa: person,
      filmografia: media,
      premiacoes,
      pageTitle: person.nome
    });

  } catch (error) {
    console.error(error);
    res.status(500).render('pages/error', { message: 'Erro no servidor' });
  }
};



