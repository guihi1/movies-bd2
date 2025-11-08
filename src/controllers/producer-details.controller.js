import { findPersonByProducerId, findMediaByProducerId, findAwardsByProducerId } from '../services/producers.service.js';

export const showProducerPage = async (req, res) => {
  try {
    const { id } = req.params;

    const [person, media, premiacoes] = await Promise.all([
      findPersonByProducerId(id),
      findMediaByProducerId(id),
      findAwardsByProducerId(id)
    ]);

    if (!person) {
      return res.status(404).render('pages/error', { message: 'Pessoas produtoras não encontrado' });
    }

    res.render('pages/producer-details', {
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



