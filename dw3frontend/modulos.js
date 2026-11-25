module.exports = [
  {
    slug: 'pastos', titulo: 'Pastos', singular: 'Pasto', id: 'pastoid',
    campos: [
      { nome: 'descricao', rotulo: 'Descrição', tipo: 'text' },
      { nome: 'areatotal', rotulo: 'Área total do pasto (alqueires)', tipo: 'number', step: 'any', min: 0 },
    ],
  },
  {
    slug: 'piquetes', titulo: 'Piquetes', singular: 'Piquete', id: 'piqueteid',
    campos: [
      { nome: 'descricao', rotulo: 'Descrição', tipo: 'text' },
      { nome: 'latitude', rotulo: 'Latitude', tipo: 'number', step: 'any' },
      { nome: 'longitude', rotulo: 'Longitude', tipo: 'number', step: 'any' },
      { nome: 'pastoidfk', rotulo: 'Pasto', tipo: 'select' },
      { nome: 'areausada', rotulo: 'Área que o piquete usa do pasto (alqueires)', tipo: 'number', step: 'any', min: 0 },
    ],
  },
  {
    slug: 'animais', titulo: 'Animais', singular: 'Animal', id: 'animalid',
    campos: [
      { nome: 'nome', rotulo: 'Nome', tipo: 'text' },
      { nome: 'datanasc', rotulo: 'Data de nascimento', tipo: 'date' },
    ],
  },
  {
    slug: 'alocados', titulo: 'Alocações', singular: 'Alocação', id: 'alocadoid',
    campos: [
      { nome: 'animalidifk', rotulo: 'Animal', tipo: 'select' },
      { nome: 'piqueteidfk', rotulo: 'Piquete', tipo: 'select' },
      { nome: 'datainicio', rotulo: 'Data de início', tipo: 'date' },
      { nome: 'datafinal', rotulo: 'Data final', tipo: 'date' },
    ],
  },
];
