import { findProductionCompanyById } from '../services/productioncompanys.service.js';

export const showProductionCompanyPage = async (req, res) => {
  try {
    const { id } = req.params;

    const productionCompany = await findProductionCompanyById(id);

    if (!productionCompany) {
      return res.status(404).render('pages/error', { message: 'Produtora não encontrado' });
    }

    res.render('pages/productioncompany-details', {
      produtora: productionCompany,
    });

  } catch (error) {
    console.error(error);
    res.status(500).render('pages/error', { message: 'Erro no servidor' });
  }
};



