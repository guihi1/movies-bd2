import { MongoClient, ObjectId } from 'mongodb';
import 'dotenv/config';

// Configuração da conexão
const client = new MongoClient(process.env.MONGODB_URL);

async function seedDatabase() {
  try {
    await client.connect();
    const db = client.db();
    
    console.log("Limpando banco de dados...");
    await db.dropDatabase();

    console.log("Gerando IDs para manter as referências...");
    
    // ========================================================================
    // 1. MAPEAMENTO DE IDS
    // ========================================================================
    
    // Pessoas
    const p = {
      tomHanks: new ObjectId(),      
      leoDiCaprio: new ObjectId(),   
      morganFreeman: new ObjectId(), 
      scarlett: new ObjectId(),      
      rdj: new ObjectId(),           
      bryanCranston: new ObjectId(), 
      nolan: new ObjectId(),         
      spielberg: new ObjectId(),     
      tarantino: new ObjectId(),     
      cameron: new ObjectId(),       
      peterJackson: new ObjectId(),  
      vinceGilligan: new ObjectId(), 
      aaronSorkin: new ObjectId(),   
      gretaGerwig: new ObjectId(),   
      kevinFeige: new ObjectId(),    
      jjAbrams: new ObjectId(),      
      kathleenKennedy: new ObjectId(), 
      keanuReeves: new ObjectId(),   
      lanaWachowski: new ObjectId(), 
      lillyWachowski: new ObjectId(),
      mcconaughey: new ObjectId(),   
      anneHathaway: new ObjectId(),  
      cillianMurphy: new ObjectId(), 
      umaThurman: new ObjectId(),    
      bobOdenkirk: new ObjectId(),   
      jennaOrtega: new ObjectId(),   
      timBurton: new ObjectId(),     
      timothee: new ObjectId(),      
      denisVilleneuve: new ObjectId()
    };

    // Produtoras
    const prod = {
      warner: new ObjectId(),    
      paramount: new ObjectId(), 
      universal: new ObjectId(), 
      columbia: new ObjectId(),  
      disney: new ObjectId(),    
      fox: new ObjectId(),       
      a24: new ObjectId(),       
      legendary: new ObjectId(), 
      hbo: new ObjectId(),       
      amc: new ObjectId(),       
      netflix: new ObjectId(),   
      miramax: new ObjectId()    
    };

    // Séries
    const series = {
      breakingBad: new ObjectId(),      
      got: new ObjectId(),              
      theOffice: new ObjectId(),        
      friends: new ObjectId(),          
      strangerThings: new ObjectId(),   
      betterCallSaul: new ObjectId(),   
      wednesday: new ObjectId()         
    };

    // Usuarios
    const users = [new ObjectId(), new ObjectId(), new ObjectId(), new ObjectId(), new ObjectId(), new ObjectId(), new ObjectId(), new ObjectId()];

    // ========================================================================
    // 2. INSERÇÃO DE USUARIOS
    // ========================================================================
    console.log("Inserindo Usuários...");
    await db.collection('usuarios').insertMany([
      { _id: users[0], nome_usuario: 'cinéfilo_alpha', email: 'alpha@email.com', senha: 'senha123' },
      { _id: users[1], nome_usuario: 'seriemaníaca', email: 'series@email.com', senha: 'senha123' },
      { _id: users[2], nome_usuario: 'movie_lover', email: 'movies@email.com', senha: 'senha123' },
    ]);

    // ========================================================================
    // 3. INSERÇÃO DE PRODUTORAS
    // ========================================================================
    console.log("Inserindo Produtoras...");
    await db.collection('produtoras').insertMany([
      { _id: prod.warner, nome: 'Warner Bros. Pictures', cnpj: '11.222.333/0001-44', data_de_fundacao: new Date('1923-04-04'), sede: 'Burbank, CA, USA' },
      { _id: prod.paramount, nome: 'Paramount Pictures', cnpj: '22.333.444/0001-55', data_de_fundacao: new Date('1912-05-08'), sede: 'Hollywood, CA, USA' },
      { _id: prod.universal, nome: 'Universal Pictures', cnpj: '33.444.555/0001-66', data_de_fundacao: new Date('1912-04-30'), sede: 'Universal City, CA, USA' },
      { _id: prod.columbia, nome: 'Columbia Pictures', cnpj: '44.555.666/0001-77', data_de_fundacao: new Date('1918-01-10'), sede: 'Culver City, CA, USA' },
      { _id: prod.disney, nome: 'Walt Disney Pictures', cnpj: '55.666.777/0001-88', data_de_fundacao: new Date('1923-10-16'), sede: 'Burbank, CA, USA' },
      { _id: prod.fox, nome: '20th Century Studios', cnpj: '66.777.888/0001-99', data_de_fundacao: new Date('1935-05-31'), sede: 'Century City, CA, USA' },
      { _id: prod.a24, nome: 'A24', cnpj: '77.888.999/0001-00', data_de_fundacao: new Date('2012-08-20'), sede: 'New York, NY, USA' },
      { _id: prod.legendary, nome: 'Legendary Entertainment', cnpj: '88.999.000/0001-11', data_de_fundacao: new Date('2000-01-01'), sede: 'Burbank, CA, USA' },
      { _id: prod.hbo, nome: 'HBO', cnpj: '99.000.111/0001-22', data_de_fundacao: new Date('1972-11-08'), sede: 'New York, NY, USA' },
      { _id: prod.amc, nome: 'AMC Studios', cnpj: '10.111.222/0001-33', data_de_fundacao: new Date('2010-01-01'), sede: 'Santa Monica, CA, USA' },
      { _id: prod.netflix, nome: 'Netflix', cnpj: '22.222.222/0001-22', data_de_fundacao: new Date('1997-08-29'), sede: 'Los Gatos, CA' },
      { _id: prod.miramax, nome: 'Miramax', cnpj: '44.444.444/0001-44', data_de_fundacao: new Date('1979-10-01'), sede: 'Los Angeles, CA' }
    ]);

    // ========================================================================
    // 4. INSERÇÃO DE PESSOAS
    // ========================================================================
    console.log("Inserindo Pessoas...");
    await db.collection('pessoas').insertMany([
      { 
        _id: p.tomHanks, nome: 'Tom Hanks', data_de_nascimento: new Date('1956-07-09'), sites: ['http://tomhanks.com'], funcoes: ['Ator', 'Produtor'],
        local_de_nascimento: 'Concord, California, USA', altura: 1.83 
      },
      { 
        _id: p.leoDiCaprio, nome: 'Leonardo DiCaprio', data_de_nascimento: new Date('1974-11-11'), sites: ['http://leodicaprio.com'], funcoes: ['Ator'],
        local_de_nascimento: 'Los Angeles, California, USA', altura: 1.83
      },
      { 
        _id: p.morganFreeman, nome: 'Morgan Freeman', data_de_nascimento: new Date('1937-06-01'),
        local_de_nascimento: 'Memphis, Tennessee, USA', altura: 1.88
      },
      { 
        _id: p.bryanCranston, nome: 'Bryan Cranston', data_de_nascimento: new Date('1956-03-07'),
        local_de_nascimento: 'Hollywood, California, USA', altura: 1.79
      },
      { 
        _id: p.nolan, nome: 'Christopher Nolan', data_de_nascimento: new Date('1970-07-30'), funcoes: ['Diretor'],
        local_de_nascimento: 'London, England, UK', altura: 1.81
      },
      { 
        _id: p.spielberg, nome: 'Steven Spielberg', data_de_nascimento: new Date('1946-12-18'), sites: ['http://spielberg.com'],
        local_de_nascimento: 'Cincinnati, Ohio, USA', altura: 1.72
      },
      { 
        _id: p.tarantino, nome: 'Quentin Tarantino', data_de_nascimento: new Date('1963-03-27'), sites: ['http://tarantino.info'],
        local_de_nascimento: 'Knoxville, Tennessee, USA', altura: 1.85
      },
      { 
        _id: p.cameron, nome: 'James Cameron', data_de_nascimento: new Date('1954-08-16'), sites: ['http://jamescameron.com'],
        local_de_nascimento: 'Kapuskasing, Ontario, Canada', altura: 1.88
      },
      { 
        _id: p.peterJackson, nome: 'Peter Jackson', data_de_nascimento: new Date('1961-10-31'),
        local_de_nascimento: 'Wellington, New Zealand', altura: 1.69
      },
      { 
        _id: p.vinceGilligan, nome: 'Vince Gilligan', data_de_nascimento: new Date('1967-02-10'),
        local_de_nascimento: 'Richmond, Virginia, USA', altura: 1.83
      },
      { 
        _id: p.gretaGerwig, nome: 'Greta Gerwig', data_de_nascimento: new Date('1983-08-04'), funcoes: ['Atriz', 'Diretora', 'Roteirista'],
        local_de_nascimento: 'Sacramento, California, USA', altura: 1.75
      },
      { 
        _id: p.keanuReeves, nome: 'Keanu Reeves', data_de_nascimento: new Date('1964-09-02'),
        local_de_nascimento: 'Beirut, Lebanon', altura: 1.86
      },
      { 
        _id: p.lanaWachowski, nome: 'Lana Wachowski', data_de_nascimento: new Date('1965-06-21'),
        local_de_nascimento: 'Chicago, Illinois, USA', altura: 1.79
      },
      { 
        _id: p.lillyWachowski, nome: 'Lilly Wachowski', data_de_nascimento: new Date('1967-12-29'),
        local_de_nascimento: 'Chicago, Illinois, USA', altura: 1.79
      },
      { 
        _id: p.mcconaughey, nome: 'Matthew McConaughey', data_de_nascimento: new Date('1969-11-04'),
        local_de_nascimento: 'Uvalde, Texas, USA', altura: 1.82
      },
      { 
        _id: p.anneHathaway, nome: 'Anne Hathaway', data_de_nascimento: new Date('1982-11-12'),
        local_de_nascimento: 'New York City, USA', altura: 1.73
      },
      { 
        _id: p.cillianMurphy, nome: 'Cillian Murphy', data_de_nascimento: new Date('1976-05-25'),
        local_de_nascimento: 'Douglas, Cork, Ireland', altura: 1.75
      },
      { 
        _id: p.umaThurman, nome: 'Uma Thurman', data_de_nascimento: new Date('1970-04-29'),
        local_de_nascimento: 'Boston, Massachusetts, USA', altura: 1.80
      },
      { 
        _id: p.bobOdenkirk, nome: 'Bob Odenkirk', data_de_nascimento: new Date('1962-10-22'),
        local_de_nascimento: 'Berwyn, Illinois, USA', altura: 1.75
      },
      { 
        _id: p.jennaOrtega, nome: 'Jenna Ortega', data_de_nascimento: new Date('2002-09-27'),
        local_de_nascimento: 'Coachella Valley, California, USA', altura: 1.55
      },
      { 
        _id: p.timBurton, nome: 'Tim Burton', data_de_nascimento: new Date('1958-08-25'),
        local_de_nascimento: 'Burbank, California, USA', altura: 1.82
      },
      { 
        _id: p.timothee, nome: 'Timothée Chalamet', data_de_nascimento: new Date('1995-12-27'),
        local_de_nascimento: 'New York City, USA', altura: 1.78
      },
      { 
        _id: p.denisVilleneuve, nome: 'Denis Villeneuve', data_de_nascimento: new Date('1967-10-03'),
        local_de_nascimento: 'Trois-Rivières, Quebec, Canada', altura: 1.82
      },
      { 
        _id: p.rdj, nome: 'Robert Downey Jr.', data_de_nascimento: new Date('1965-04-04'),
        local_de_nascimento: 'New York City, USA', altura: 1.74
      }
    ]);

    // ========================================================================
    // 5. INSERÇÃO DE SÉRIES (RESTAURADO: temporadas como Array de Objetos)
    // ========================================================================
    console.log("Inserindo Séries...");
    await db.collection('series').insertMany([
      { 
        _id: series.breakingBad, nome: 'Breaking Bad', nota: 9.5, ano_de_inicio: 2008, ano_de_fim: 2013,
        generos: ['Crime', 'Drama'], faturamento: 500000000, 
        sinopse: 'Um professor de química com câncer se alia a um ex-aluno para fabricar metanfetamina e garantir o futuro de sua família.',
        temporadas: [{ numero: 1, ano: 2013, episodios: 16 }] // Formato antigo restaurado
      },
      { 
        _id: series.got, nome: 'Game of Thrones', nota: 8.9, ano_de_inicio: 2011, ano_de_fim: 2019,
        generos: ['Ação', 'Aventura', 'Drama'], faturamento: 2200000000,
        sinopse: 'Nove famílias nobres lutam pelo controle das terras míticas de Westeros, enquanto um antigo inimigo retorna após estar adormecido por milhares de anos.',
        temporadas: [{ numero: 1, ano: 2011, episodios: 10 }]
      },
      { 
        _id: series.theOffice, nome: 'The Office (US)', nota: 9.0, ano_de_inicio: 2005, ano_de_fim: 2013,
        generos: ['Comédia'], faturamento: 1500000000,
        sinopse: 'Um documentário fictício que acompanha o dia a dia dos funcionários de um escritório de papel na Pensilvânia.',
        temporadas: [{ numero: 1, ano: 2005, episodios: 6 }]
      },
      { 
        _id: series.friends, nome: 'Friends', nota: 8.9, ano_de_inicio: 1994, ano_de_fim: 2004,
        generos: ['Comédia', 'Romance'], faturamento: 4000000000,
        sinopse: 'Acompanha a vida pessoal e profissional de seis amigos de vinte e poucos anos vivendo em Manhattan.',
        temporadas: [{ numero: 1, ano: 1994, episodios: 24 }]
      },
      { 
        _id: series.strangerThings, nome: 'Stranger Things', nota: 8.7, ano_de_inicio: 2016,
        generos: ['Drama', 'Fantasia', 'Terror'], faturamento: 1000000000,
        sinopse: 'Quando um garoto desaparece, sua mãe, um chefe de polícia e seus amigos devem enfrentar forças aterrorizantes para trazê-lo de volta.',
        temporadas: [{ numero: 1, ano: 2016, episodios: 8 }]
      },
      {
        _id: series.betterCallSaul, nome: 'Better Call Saul', nota: 9.5, ano_de_inicio: 2015, ano_de_fim: 2022,
        generos: ['Crime', 'Drama'], faturamento: 300000000,
        sinopse: 'As provações e tribulações do advogado criminal Jimmy McGill antes de se tornar Saul Goodman.',
        temporadas: [{ numero: 1, ano: 2015, episodios: 10 }]
      },
      {
        _id: series.wednesday, nome: 'Wednesday', nota: 8.1, ano_de_inicio: 2022,
        generos: ['Comédia', 'Fantasia'], faturamento: 400000000,
        sinopse: 'Wednesday Addams tenta dominar suas habilidades psíquicas emergentes e resolver um mistério sobrenatural que envolve seus pais.',
        temporadas: [{ numero: 1, ano: 2022, episodios: 8 }]
      }
    ]);

    // ========================================================================
    // 6. INSERÇÃO DE MÍDIAS
    // ========================================================================
    console.log("Inserindo Mídias (Filmes e Episódios)...");
    
    const midiasDocs = [
      // FILMES
      {
        titulo: 'Forrest Gump', tipo: 'filme', data_de_publicacao: new Date('1994-07-06'), 
        generos: ['Drama', 'Romance'], faturamento: 678200000,
        pais_de_origem: 'USA', tempo_de_duracao: 142, faixa_etaria_indicada: 12,
        enredo: 'As presidências de Kennedy e Johnson, a guerra do Vietnã e outros eventos históricos se desenrolam através da perspectiva de um homem do Alabama com baixo QI.',
        produtoras_distribuicao: [{ produtora_id: prod.paramount, nome: 'Paramount' }],
        elenco: [{ pessoa_id: p.tomHanks, nome: 'Tom Hanks', personagem: 'Forrest Gump' }]
      },
      {
        titulo: 'O Resgate do Soldado Ryan', tipo: 'filme', data_de_publicacao: new Date('1998-07-24'),
        generos: ['Guerra'], faturamento: 482300000,
        pais_de_origem: 'USA', tempo_de_duracao: 169, faixa_etaria_indicada: 16,
        enredo: 'Durante a Segunda Guerra Mundial, um grupo de soldados americanos arrisca a vida para resgatar um paraquedista cujos irmãos morreram em combate.',
        produtoras_distribuicao: [{ produtora_id: prod.paramount, nome: 'Paramount' }],
        diretores: [{ pessoa_id: p.spielberg, nome: 'Steven Spielberg' }],
        elenco: [{ pessoa_id: p.tomHanks, nome: 'Tom Hanks', personagem: 'Captain John H. Miller' }]
      },
      {
        titulo: 'A Origem', tipo: 'filme', data_de_publicacao: new Date('2010-07-16'),
        generos: ['Ficção Científica'], faturamento: 836800000,
        pais_de_origem: 'USA', tempo_de_duracao: 148, faixa_etaria_indicada: 14,
        enredo: 'Um ladrão que rouba segredos corporativos através do uso de tecnologia de compartilhamento de sonhos recebe a tarefa inversa de plantar uma ideia na mente de um CEO.',
        produtoras_distribuicao: [{ produtora_id: prod.warner, nome: 'Warner Bros.' }],
        diretores: [{ pessoa_id: p.nolan, nome: 'Christopher Nolan' }],
        elenco: [{ pessoa_id: p.leoDiCaprio, nome: 'Leonardo DiCaprio', personagem: 'Cobb' }]
      },
      {
        titulo: 'Homem de Ferro', tipo: 'filme', data_de_publicacao: new Date('2008-05-02'),
        generos: ['Ação', 'Aventura', 'Ficção'], faturamento: 585800000,
        pais_de_origem: 'USA', tempo_de_duracao: 126, faixa_etaria_indicada: 12,
        enredo: 'Depois de ser mantido em cativeiro em uma caverna afegã, o engenheiro bilionário Tony Stark cria uma armadura única para combater o mal.',
        produtoras_distribuicao: [{ produtora_id: prod.paramount, nome: 'Paramount' }],
        produtores: [{ pessoa_id: p.kevinFeige, nome: 'Kevin Feige' }], 
        elenco: [{ pessoa_id: p.rdj, nome: 'Robert Downey Jr.', personagem: 'Tony Stark / Homem de Ferro' }]
      },
      {
        titulo: 'Avatar', tipo: 'filme', data_de_publicacao: new Date('2009-12-18'),
        generos: ['Aventura'], faturamento: 2923000000,
        pais_de_origem: 'USA', tempo_de_duracao: 162, faixa_etaria_indicada: 12,
        enredo: 'Um fuzileiro naval paraplégico despachado para a lua Pandora em uma missão única fica dividido entre seguir suas ordens e proteger o mundo que ele sente ser sua casa.',
        produtoras_distribuicao: [{ produtora_id: prod.fox, nome: '20th Century' }],
        diretores: [{ pessoa_id: p.cameron, nome: 'James Cameron' }],
        roteiristas: [{ pessoa_id: p.cameron, nome: 'James Cameron' }]
      },
      {
        titulo: 'Barbie', tipo: 'filme', data_de_publicacao: new Date('2023-07-21'),
        generos: ['Comédia'], faturamento: 1446000000,
        pais_de_origem: 'USA', tempo_de_duracao: 114, faixa_etaria_indicada: 12,
        enredo: 'Barbie sofre uma crise que a leva a questionar seu mundo e sua existência.',
        produtoras_distribuicao: [{ produtora_id: prod.warner, nome: 'Warner Bros.' }],
        diretores: [{ pessoa_id: p.gretaGerwig, nome: 'Greta Gerwig' }],
        roteiristas: [{ pessoa_id: p.gretaGerwig, nome: 'Greta Gerwig' }],
        elenco: [{ pessoa_id: p.gretaGerwig, nome: 'Greta Gerwig', personagem: 'Barbie' }]
      },
      {
        titulo: 'Pulp Fiction: Tempo de Violência', tipo: 'filme', data_de_publicacao: new Date('1994-10-14'),
        generos: ['Crime'], faturamento: 213900000,
        pais_de_origem: 'USA', tempo_de_duracao: 154, faixa_etaria_indicada: 18,
        enredo: 'As vidas de dois assassinos da máfia, um boxeador, a esposa de um gângster e dois bandidos se entrelaçam em quatro histórias de violência e redenção.',
        produtoras_distribuicao: [{ produtora_id: prod.a24, nome: 'A24' }], 
        diretores: [{ pessoa_id: p.tarantino, nome: 'Quentin Tarantino' }],
        roteiristas: [{ pessoa_id: p.tarantino, nome: 'Quentin Tarantino' }]
      },
      {
        titulo: 'The Matrix', tipo: 'filme', data_de_publicacao: new Date('1999-03-31'),
        generos: ['Ficção Científica', 'Ação'], faturamento: 463500000,
        pais_de_origem: 'USA', tempo_de_duracao: 136, faixa_etaria_indicada: 14,
        enredo: 'Um hacker aprende com rebeldes misteriosos sobre a verdadeira natureza de sua realidade e seu papel na guerra contra seus controladores.',
        produtoras_distribuicao: [{ produtora_id: prod.warner, nome: 'Warner Bros.' }],
        diretores: [{ pessoa_id: p.lanaWachowski, nome: 'Lana' }, { pessoa_id: p.lillyWachowski, nome: 'Lilly' }],
        roteiristas: [{ pessoa_id: p.lanaWachowski, nome: 'Lana' }, { pessoa_id: p.lillyWachowski, nome: 'Lilly' }],
        elenco: [{ pessoa_id: p.keanuReeves, nome: 'Keanu Reeves', personagem: 'Neo' }]
      },
      {
        titulo: 'Interestelar', tipo: 'filme', data_de_publicacao: new Date('2014-11-07'),
        generos: ['Ficção Científica', 'Drama'], faturamento: 677500000,
        pais_de_origem: 'USA', tempo_de_duracao: 169, faixa_etaria_indicada: 10,
        enredo: 'Uma equipe de exploradores viaja através de um buraco de minhoca no espaço na tentativa de garantir a sobrevivência da humanidade.',
        produtoras_distribuicao: [{ produtora_id: prod.paramount, nome: 'Paramount' }],
        diretores: [{ pessoa_id: p.nolan, nome: 'Christopher Nolan' }],
        roteiristas: [{ pessoa_id: p.nolan, nome: 'Christopher Nolan' }],
        elenco: [
          { pessoa_id: p.mcconaughey, nome: 'Matthew McConaughey', personagem: 'Cooper' },
          { pessoa_id: p.anneHathaway, nome: 'Anne Hathaway', personagem: 'Brand' }
        ]
      },
      {
        titulo: 'Oppenheimer', tipo: 'filme', data_de_publicacao: new Date('2023-07-21'),
        generos: ['Drama', 'Biografia'], faturamento: 952000000,
        pais_de_origem: 'USA', tempo_de_duracao: 180, faixa_etaria_indicada: 16,
        enredo: 'A história do físico americano J. Robert Oppenheimer e seu papel no desenvolvimento da bomba atômica.',
        produtoras_distribuicao: [{ produtora_id: prod.universal, nome: 'Universal' }],
        diretores: [{ pessoa_id: p.nolan, nome: 'Christopher Nolan' }],
        roteiristas: [{ pessoa_id: p.nolan, nome: 'Christopher Nolan' }],
        elenco: [{ pessoa_id: p.cillianMurphy, nome: 'Cillian Murphy', personagem: 'J. Robert Oppenheimer' }]
      },
      {
        titulo: 'Kill Bill: Vol. 1', tipo: 'filme', data_de_publicacao: new Date('2003-10-10'),
        generos: ['Ação', 'Crime'], faturamento: 180900000,
        pais_de_origem: 'USA', tempo_de_duracao: 111, faixa_etaria_indicada: 18,
        enredo: 'Após despertar de um coma de quatro anos, uma ex-assassina se vinga da equipe de assassinos que a traiu.',
        produtoras_distribuicao: [{ produtora_id: prod.miramax, nome: 'Miramax' }],
        diretores: [{ pessoa_id: p.tarantino, nome: 'Quentin Tarantino' }],
        roteiristas: [{ pessoa_id: p.tarantino, nome: 'Quentin Tarantino' }],
        elenco: [{ pessoa_id: p.umaThurman, nome: 'Uma Thurman', personagem: 'A Noiva' }]
      },
      {
        titulo: 'Duna: Parte Um', tipo: 'filme', data_de_publicacao: new Date('2021-09-15'),
        generos: ['Ficção Científica', 'Aventura'], faturamento: 402000000,
        pais_de_origem: 'USA', tempo_de_duracao: 155, faixa_etaria_indicada: 12,
        enredo: 'Paul Atreides chega a Arrakis, o planeta mais perigoso do universo, para garantir o futuro de sua família e seu povo.',
        produtoras_distribuicao: [{ produtora_id: prod.warner, nome: 'Warner Bros.' }],
        diretores: [{ pessoa_id: p.denisVilleneuve, nome: 'Denis Villeneuve' }],
        roteiristas: [{ pessoa_id: p.denisVilleneuve, nome: 'Denis Villeneuve' }],
        elenco: [{ pessoa_id: p.timothee, nome: 'Timothée Chalamet', personagem: 'Paul Atreides' }]
      },

      // EPISÓDIOS
      {
        titulo: 'Breaking Bad: Ozymandias', tipo: 'episodio', data_de_publicacao: new Date('2013-09-15'),
        generos: ['Crime'],
        pais_de_origem: 'USA', tempo_de_duracao: 47, faixa_etaria_indicada: 16,
        enredo: 'Walter White foge com o dinheiro, mas seus planos desmoronam quando Hank é executado e sua família descobre a verdade.',
        info_serie: { serie_id: series.breakingBad, temporada: 1 }, 
        roteiristas: [{ pessoa_id: p.vinceGilligan, nome: 'Vince Gilligan' }],
        elenco: [{ pessoa_id: p.bryanCranston, nome: 'Bryan Cranston', personagem: 'Walter White' }]
      },
      {
        titulo: 'Game of Thrones: Winter Is Coming', tipo: 'episodio', data_de_publicacao: new Date('2011-04-17'),
        generos: ['Fantasia'],
        pais_de_origem: 'USA', tempo_de_duracao: 62, faixa_etaria_indicada: 18,
        enredo: 'Eddard Stark é dilacerado entre sua família e um velho amigo quando é convidado a servir como Mão do Rei.',
        info_serie: { serie_id: series.got, temporada: 1 },
        produtoras_distribuicao: [{ produtora_id: prod.hbo, nome: 'HBO' }]
      },
      {
        titulo: 'Better Call Saul: Uno', tipo: 'episodio', data_de_publicacao: new Date('2015-02-08'),
        generos: ['Drama', 'Crime'],
        pais_de_origem: 'USA', tempo_de_duracao: 53, faixa_etaria_indicada: 14,
        enredo: 'Jimmy McGill tenta sair da sombra de seu irmão, Chuck, mas se envolve em um esquema perigoso.',
        info_serie: { serie_id: series.betterCallSaul, temporada: 1 },
        produtoras_distribuicao: [{ produtora_id: prod.amc, nome: 'AMC' }],
        elenco: [{ pessoa_id: p.bobOdenkirk, nome: 'Bob Odenkirk', personagem: 'Jimmy McGill' }]
      },
      {
        titulo: 'Wednesday: Wednesday\'s Child Is Full of Woe', tipo: 'episodio', data_de_publicacao: new Date('2022-11-16'),
        generos: ['Comédia', 'Fantasia'],
        pais_de_origem: 'USA', tempo_de_duracao: 45, faixa_etaria_indicada: 14,
        enredo: 'Wednesday é expulsa da escola e enviada para a Academia Nevermore, onde tenta dominar seus poderes.',
        info_serie: { serie_id: series.wednesday, temporada: 1 },
        produtoras_distribuicao: [{ produtora_id: prod.netflix, nome: 'Netflix' }],
        diretores: [{ pessoa_id: p.timBurton, nome: 'Tim Burton' }],
        roteiristas: [{ pessoa_id: p.timBurton, nome: 'Tim Burton' }],
        elenco: [{ pessoa_id: p.jennaOrtega, nome: 'Jenna Ortega', personagem: 'Wednesday Addams' }]
      },
      {
        titulo: 'Box Cutter', tipo: 'episodio', data_de_publicacao: new Date('2011-07-17'),
        generos: ['Drama'],
        pais_de_origem: 'USA', tempo_de_duracao: 48, faixa_etaria_indicada: 16,
        enredo: 'Walt e Jesse enfrentam as consequências mortais de suas ações contra Gale enquanto esperam a reação de Gus.',
        info_serie: { serie_id: series.breakingBad, temporada: 1 },
        roteiristas: [{ pessoa_id: p.vinceGilligan, nome: 'Vince Gilligan' }],
        elenco: [{ pessoa_id: p.bryanCranston, nome: 'Bryan Cranston', personagem: 'Walter White' }]
      }
    ];

    await db.collection('midias').insertMany(midiasDocs);
    
    // Pegando ID de uma midia inserida para usar na avaliação
    const mediaForrest = await db.collection('midias').findOne({ titulo: 'Forrest Gump' });

    // ========================================================================
    // 7. INSERÇÃO DE AVALIAÇÕES
    // ========================================================================
    console.log("Inserindo Avaliações...");
    await db.collection('avaliacoes').insertMany([
      { user_id: users[0], midia_id: mediaForrest._id, nota: 9.8, comentario: 'Obra-prima!', data: new Date() },
      { user_id: users[2], midia_id: mediaForrest._id, nota: 9.5, comentario: 'Incrível', data: new Date() }
    ]);

    // ========================================================================
    // 8. INSERÇÃO DE PREMIAÇÕES
    // ========================================================================
    console.log("Inserindo Premiações...");
    
    // Buscando IDs reais de mídia para linkar
    const mInception = await db.collection('midias').findOne({ titulo: 'A Origem' });
    const mForrest = await db.collection('midias').findOne({ titulo: 'Forrest Gump' });

    await db.collection('premiacoes').insertMany([
      {
        nome: 'Oscar', ano: 2011, categoria: 'Melhor Diretor', organizacao: 'Academia',
        indicados: [
          { midia_id: mInception._id, nome_indicado: 'Christopher Nolan', vencedor: false }
        ]
      },
      {
        nome: 'Oscar', ano: 1995, categoria: 'Melhor Ator', organizacao: 'Academia',
        indicados: [
          { midia_id: mForrest._id, nome_indicado: 'Tom Hanks', vencedor: true }
        ]
      }
    ]);

    console.log("Migração concluída com sucesso!");

  } catch (err) {
    console.error("Erro na migração:", err);
  } finally {
    await client.close();
  }
}

seedDatabase();