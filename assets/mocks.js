// Mock de dados para o aplicativo de transporte público

export const PROFILE_PLACEHOLDER = 'https://randomuser.me/api/portraits/men/1.jpg';

export const RECENT_LINES = [
  { 
    id: '39842409820',
    prefix: '608',
    lineName: 'Parque Residencial',
    company: 'Integração Transportes'
  },
  { 
    id: '39842409321',
    prefix: '302',
    lineName: 'Morada do Ouro',
    company: 'Integração Transportes'
  },
  { 
    id: '39887609820',
    prefix: '410',
    lineName: 'Grande Terceiro',
    company: 'Integração Transportes'
  }
];

// Notificações
export const NOTIFICATIONS = [
  {
    id: 'n1',
    type: 'alert',
    title: 'Desvio na Linha 302',
    message: 'Devido a obras na Av. Miguel Sutil, a linha está operando com desvio temporário.',
    time: '2h atrás',
    read: false
  },
  {
    id: 'n2',
    type: 'arrival',
    title: 'Ônibus se aproximando',
    message: 'Linha 450 chegará em sua parada em aproximadamente 3 minutos.',
    time: '14 Mai',
    read: true
  },
  {
    id: 'n3',
    type: 'recharge',
    title: 'Recarga confirmada',
    message: 'Seu cartão de transporte foi recarregado com R$ 50,00.',
    time: '14 Mai',
    read: true
  }
];

export const HORARIOS_LINE = [
  {
    nomeLinha: '302 - Parque Residencial',
    horariosIda: [
      { id: 1, hora: '06:00', status: 'onTime' },
      { id: 2, hora: '06:15', status: 'onTime' },
      { id: 3, hora: '06:30', status: 'onTime' },
      { id: 4, hora: '06:45', status: 'onTime' },
      { id: 5, hora: '07:00', status: 'onTime' },
      { id: 6, hora: '07:15', status: 'onTime' },
      { id: 7, hora: '07:30', status: 'onTime' },
      { id: 8, hora: '07:45', status: 'onTime' },
      { id: 9, hora: '08:00', status: 'onTime' }
    ],
    horariosVolta: [
      { id: 1, hora: '18:00', status: 'onTime' },
      { id: 2, hora: '18:15', status: 'onTime' },
      { id: 3, hora: '18:30', status: 'onTime' },
      { id: 4, hora: '18:45', status: 'onTime' },
      { id: 5, hora: '19:00', status: 'onTime' },
      { id: 6, hora: '19:15', status: 'onTime' },
      { id: 7, hora: '19:30', status: 'onTime' },
      { id: 8, hora: '19:45', status: 'onTime' },
      { id: 9, hora: '20:00', status: 'onTime' }
    ]
  },
  {
    nomeLinha: '450 - Centro',
    horariosIda: [
      { id: 1, hora: '06:00', status: 'onTime' },
      { id: 2, hora: '06:15', status: 'onTime' },
      { id: 3, hora: '06:30', status: 'onTime' },
      { id: 4, hora: '06:45', status: 'onTime' },
      { id: 5, hora: '07:00', status: 'onTime' },
      { id: 6, hora: '07:15', status: 'onTime' },
      { id: 7, hora: '07:30', status: 'onTime' },
      { id: 8, hora: '07:45', status: 'onTime' },
      { id: 9, hora: '08:00', status: 'onTime' }
    ],
    horariosVolta: [
      { id: 1, hora: '18:00', status: 'onTime' },
      { id: 2, hora: '18:15', status: 'onTime' },
      { id: 3, hora: '18:30', status: 'onTime' },
      { id: 4, hora: '18:45', status: 'onTime' },
      { id: 5, hora: '19:00', status: 'onTime' },
      { id: 6, hora: '19:15', status: 'onTime' },
      { id: 7, hora: '19:30', status: 'onTime' },
      { id: 8, hora:'19.45', status:'onTime'},
      { id :9, hora:'20.00', status:'onTime'}
    ]
  }
]