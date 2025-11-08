import { findPersonByWriterId, findMediaByWriterId, findAwardsByWriterId } from '../services/writers.service.js';

export const showWriterPage = async (req, res) => {
  try {
    const { id } = req.params;

    const [person, media, premiacoes] = await Promise.all([
      findPersonByWriterId(id),
      findMediaByWriterId(id),
      findAwardsByWriterId(id)
    ]);

    if (!person) {
      return res.status(404).render('pages/error', { message: 'Roteirista não encontrado' });
    }

    res.render('pages/writer-details', {
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



