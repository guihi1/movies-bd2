import { findAllProducersGrouped } from '../services/producers.service.js';

export const showAllProducersPage = async (req, res) => {
  try {
    const [producers] = await Promise.all([findAllProducersGrouped()]);

    console.log(producers);

    if (!producers) {
      return res.status(404).render('pages/error', {
        statusCode: 404,
        message: 'Pessoas produtoras não foram encontrados',
        description: 'Algo deu errado na procura das pessoas produtoras.'
      });
    }

    
    res.render('pages/producers', {
      pageTitle: 'RMGe: Pessoas produtoras',
      pessoasProdutoras: producers,
    });

  } catch (error) {
    console.error('Erro ao carregar dados da página inicial:', error.stack);
    res.status(500).render('pages/error', {
      pageTitle: 'Erro',
      message: 'Não foi possível carregar os dados completos da página de pessoas produtoras.',
      description: 'Tente novamente mais tarde. Se o problema persistir, contacte o suporte.'
    });
  }
};