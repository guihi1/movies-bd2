import { findAllProductionCompaniesGrouped } from '../services/productioncompanies.service.js';

export const showAllProductionCompaniesPage = async (req, res) => {
  try {
    const [productionCompanies] = await Promise.all([findAllProductionCompaniesGrouped()]);

    if (!productionCompanies) {
      return res.status(404).render('pages/error', {
        statusCode: 404,
        message: 'Produtoras não foram encontradas',
        description: 'Algo deu errado na procura das produtoras.'
      });
    }

    res.render('pages/productioncompanies', {
      pageTitle: 'RMGe: Produtoras',
      produtoras: productionCompanies,
    });

  } catch (error) {
    console.error('Erro ao carregar dados da página inicial:', error.stack);
    res.status(500).render('pages/error', {
      pageTitle: 'Erro',
      message: 'Não foi possível carregar os dados completos da página de produtoras.',
      description: 'Tente novamente mais tarde. Se o problema persistir, contacte o suporte.'
    });
  }
};