import { findPersonById } from '../services/person.service.js';
import { findActingsByPersonId, findActingAwardsByPersonId } from '../services/actors.service.js';
import { findDirectionByPersonId, findDirectionAwardsByPersonId } from '../services/directors.service.js';
import { findPlaysByPersonId, findPlayAwardsByPersonId } from '../services/writers.service.js';
import { findProductionsByPersonId } from '../services/producers.service.js';

export const showPersonPage = async (req, res) => {
    const pessoaId = req.params.id; 

    try {
        const [
            pessoa,
            atuacoes,
            direcoes,
            roteiros,
            producoes,
            premiosAtuacao,
            premiosDirecao,
            premiosRoteiro,
        ] = await Promise.all([
            findPersonById(pessoaId),
            findActingsByPersonId(pessoaId),
            findDirectionByPersonId(pessoaId),
            findPlaysByPersonId(pessoaId),
            findProductionsByPersonId(pessoaId),
            
            findActingAwardsByPersonId(pessoaId),
            findDirectionAwardsByPersonId(pessoaId),
            findPlayAwardsByPersonId(pessoaId),
        ]);

        if (!pessoa) {
            return res.status(404).render('pages/error', {
                pageTitle: 'Pessoa Não Encontrada',
                message: 'A pessoa solicitada não foi encontrada.',
                description: `ID: ${pessoaId}`
            });
        }
        
        const premiacoes = [
            ...premiosAtuacao,
            ...premiosDirecao,
            ...premiosRoteiro,
        ].sort((a, b) => b.ano - a.ano);

        res.render('pages/person-details', {
            pageTitle: pessoa.nome,
            pessoa: pessoa,
            atuacoes: atuacoes,
            direcoes: direcoes,
            roteiros: roteiros,
            producoes: producoes,
            premiacoes: premiacoes
        });

    } catch (error) {
        console.error(`Erro ao carregar detalhes da pessoa (${pessoaId}):`, error.stack);
        res.status(500).render('pages/error', {
            pageTitle: 'Erro',
            message: 'Não foi possível carregar os detalhes da pessoa.',
            description: 'Verifique a conexão com o banco de dados e as queries SQL.'
        });
    }
};