import { createUserAndReview } from '../services/review.service.js';

export const handleReview = async (req, res) => {

  const { nome_usuario, comentario, nota, id } = req.body;

  try {
    let result = await createUserAndReview(
      nome_usuario,
      comentario,
      parseFloat(nota),
      id
    );

    res.redirect(`/movie-details/${id}`);

  } catch (error) {
    console.error(error);
    res.status(500).render('pages/error', {
      message: 'Não foi possível registrar sua avaliação.',
      description: error.message
    });
  }
};
