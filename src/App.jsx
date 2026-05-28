import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import {
  Activity,
  AlertTriangle,
  BadgeInfo,
  Crosshair,
  Gauge,
  Globe2,
  Orbit,
  Radar,
  RadioTower,
  Rocket,
  Satellite,
  ShieldAlert,
  Signal,
  Sparkles,
  TimerReset,
  Zap,
} from 'lucide-react'
import './App.css'

const BASE_PLANETS = [
  {
    id: 'earth',
    name: 'Земля',
    codename: 'TERRA-01',
    className: 'обитаемая океаническая планета',
    mission: 'Horizon Relay',
    accent: '#62ddff',
    secondary: '#7affbf',
    atmosphere: '#7ce8ff',
    texture: 'earth',
    radius: 1.78,
    rotation: 0.0021,
    seed: 11,
    bio:
      'Домашний мир человечества и эталон для всех биосканов. Стабильная магнитосфера, жидкая вода и плотная атмосфера делают Землю главным узлом для дальних миссий.',
    stats: [
      ['Диаметр', '12 742 км'],
      ['Гравитация', '1.00 g'],
      ['Сутки', '23ч 56м'],
      ['Год', '365.25 дней'],
      ['Атмосфера', 'N2 / O2'],
      ['Средняя t°', '+15°C'],
    ],
    telemetry: {
      uplink: 98,
      radiation: 12,
      stability: 96,
      thermal: 61,
      crew: 94,
    },
    alerts: ['Солнечный ветер в норме', 'Окно запуска открыто 11 минут', 'Лунный ретранслятор активен'],
  },
  {
    id: 'mars',
    name: 'Марс',
    codename: 'ARES-04',
    className: 'пустынная планета с ледяными резервами',
    mission: 'Red Dust Survey',
    accent: '#ff8b4a',
    secondary: '#ffd166',
    atmosphere: '#ffb06b',
    texture: 'mars',
    radius: 1.42,
    rotation: 0.0025,
    seed: 23,
    bio:
      'Холодный мир с гигантскими вулканами, каньонами и следами древней воды. Идеальная цель для роверов, подповерхностных радаров и первых автономных баз.',
    stats: [
      ['Диаметр', '6 779 км'],
      ['Гравитация', '0.38 g'],
      ['Сутки', '24ч 37м'],
      ['Год', '687 дней'],
      ['Атмосфера', 'CO2'],
      ['Средняя t°', '-63°C'],
    ],
    telemetry: {
      uplink: 84,
      radiation: 46,
      stability: 79,
      thermal: 38,
      crew: 72,
    },
    alerts: ['Пыльный фронт в секторе Valles', 'Ровер ECHO-7 просит маршрут', 'Запас энергии базы 81%'],
  },
  {
    id: 'venus',
    name: 'Венера',
    codename: 'APHRODITE-02',
    className: 'раскаленная планета с плотной атмосферой',
    mission: 'Cloud Forge',
    accent: '#ffd36b',
    secondary: '#ff6d8a',
    atmosphere: '#ffe49a',
    texture: 'venus',
    radius: 1.73,
    rotation: -0.0014,
    seed: 37,
    bio:
      'Почти земной размер, но совершенно другой характер: густые облака серной кислоты, экстремальное давление и температура, способная плавить электронику.',
    stats: [
      ['Диаметр', '12 104 км'],
      ['Гравитация', '0.90 g'],
      ['Сутки', '243 дня'],
      ['Год', '225 дней'],
      ['Атмосфера', 'CO2 / N2'],
      ['Средняя t°', '+464°C'],
    ],
    telemetry: {
      uplink: 67,
      radiation: 31,
      stability: 58,
      thermal: 97,
      crew: 42,
    },
    alerts: ['Тепловая защита на пределе', 'Облачный аэростат держит высоту', 'Окно связи нестабильно'],
  },
  {
    id: 'jupiter',
    name: 'Юпитер',
    codename: 'JOVE-05',
    className: 'газовый гигант и штормовой массив',
    mission: 'Storm Eye Array',
    accent: '#ffbf72',
    secondary: '#88f0ff',
    atmosphere: '#ffd6a3',
    texture: 'jupiter',
    radius: 2.05,
    rotation: 0.0032,
    seed: 53,
    bio:
      'Самая массивная планета системы. Ее облачные пояса, радиационные зоны и Большое красное пятно превращают каждую миссию в точную инженерную операцию.',
    stats: [
      ['Диаметр', '139 820 км'],
      ['Гравитация', '2.53 g'],
      ['Сутки', '9ч 56м'],
      ['Год', '11.86 лет'],
      ['Атмосфера', 'H2 / He'],
      ['Спутники', '95+'],
    ],
    telemetry: {
      uplink: 75,
      radiation: 91,
      stability: 66,
      thermal: 70,
      crew: 39,
    },
    alerts: ['Радиационный пояс растет', 'Ио закрывает линию связи', 'Штормовой фронт ускоряется'],
  },
  {
    id: 'saturn',
    name: 'Сатурн',
    codename: 'KRONOS-06',
    className: 'газовый гигант с кольцевой системой',
    mission: 'Ring Shepherd',
    accent: '#f7d78a',
    secondary: '#b8fff2',
    atmosphere: '#ffe8ad',
    texture: 'saturn',
    radius: 1.92,
    rotation: 0.0028,
    seed: 71,
    rings: true,
    bio:
      'Планета с самой узнаваемой кольцевой системой. Ледяная пыль, микроспутники и гравитационные резонансы дают идеальную лабораторию для орбитальной навигации.',
    stats: [
      ['Диаметр', '116 460 км'],
      ['Гравитация', '1.07 g'],
      ['Сутки', '10ч 42м'],
      ['Год', '29.45 лет'],
      ['Атмосфера', 'H2 / He'],
      ['Спутники', '146+'],
    ],
    telemetry: {
      uplink: 72,
      radiation: 54,
      stability: 83,
      thermal: 52,
      crew: 64,
    },
    alerts: ['Кольцо B пересекает траекторию', 'Титан передал спектр метана', 'Навигация держит 0.03°'],
  },
  {
    id: 'neptune',
    name: 'Нептун',
    codename: 'POSEIDON-08',
    className: 'ледяной гигант с сверхзвуковыми ветрами',
    mission: 'Blue Silence',
    accent: '#4f8cff',
    secondary: '#5fffd6',
    atmosphere: '#70a7ff',
    texture: 'neptune',
    radius: 1.64,
    rotation: 0.0023,
    seed: 89,
    bio:
      'Дальний холодный гигант с темными штормами и ветрами быстрее скорости звука. Сигналы сюда идут долго, поэтому ИИ-командование принимает решения заранее.',
    stats: [
      ['Диаметр', '49 244 км'],
      ['Гравитация', '1.14 g'],
      ['Сутки', '16ч 6м'],
      ['Год', '164.8 лет'],
      ['Атмосфера', 'H2 / He / CH4'],
      ['Средняя t°', '-214°C'],
    ],
    telemetry: {
      uplink: 49,
      radiation: 39,
      stability: 69,
      thermal: 24,
      crew: 51,
    },
    alerts: ['Задержка сигнала 4ч 6м', 'Темный вихрь смещается', 'Зонд NEREID вышел из тени'],
  },
]

const EXTRA_PLANETS = [
  {
    id: 'mercury',
    name: 'Меркурий',
    codename: 'HERMES-00',
    className: 'каменная планета у солнечного фронта',
    mission: 'Solar Knife',
    accent: '#d7c7a0',
    secondary: '#ff9f55',
    atmosphere: '#f8dfb6',
    texture: 'mercury',
    radius: 1.14,
    rotation: 0.0018,
    seed: 5,
    bio:
      'Самая близкая к Солнцу планета: почти без атмосферы, с резкими перепадами температуры и поверхностью, избитой древними ударами. Отличная цель для проверки тепловой защиты и солнечной навигации.',
    stats: [
      ['Диаметр', '4 879 км'],
      ['Гравитация', '0.38 g'],
      ['Сутки', '58.6 дней'],
      ['Год', '88 дней'],
      ['Атмосфера', 'экзосфера'],
      ['Средняя t°', '+167°C'],
    ],
    telemetry: {
      uplink: 76,
      radiation: 88,
      stability: 73,
      thermal: 93,
      crew: 34,
    },
    alerts: ['Солнечная засветка датчиков', 'Теневая сторона готова для пролета', 'Тепловой щит держит 91%'],
  },
  {
    id: 'uranus',
    name: 'Уран',
    codename: 'CAELUS-07',
    className: 'ледяной гигант с наклоненной осью',
    mission: 'Tilted Crown',
    accent: '#8ff7f2',
    secondary: '#7aa5ff',
    atmosphere: '#a6fff7',
    texture: 'uranus',
    radius: 1.58,
    rotation: -0.002,
    seed: 79,
    rings: 'thin',
    bio:
      'Холодный ледяной гигант, который вращается почти на боку. Его спокойный голубой диск, тонкие кольца и сложная система спутников делают миссию похожей на навигацию внутри наклоненного механизма.',
    stats: [
      ['Диаметр', '50 724 км'],
      ['Гравитация', '0.89 g'],
      ['Сутки', '17ч 14м'],
      ['Год', '84 года'],
      ['Атмосфера', 'H2 / He / CH4'],
      ['Средняя t°', '-224°C'],
    ],
    telemetry: {
      uplink: 58,
      radiation: 35,
      stability: 74,
      thermal: 21,
      crew: 56,
    },
    alerts: ['Кольца видны под острым углом', 'Ось вращения требует ручной поправки', 'Миранда дала сильное эхо'],
  },
]

const PLANET_MOONS = {
  mercury: [],
  venus: [],
  earth: [
    {
      id: 'moon',
      name: 'Луна',
      type: 'каменный спутник',
      diameter: '3 474 км',
      orbit: '384 400 км',
      signal: '99%',
      color: '#dbe7ee',
      bio:
        'Главный естественный спутник Земли. Идеален для ретрансляторов, тестовых посадок и демонстрации орбитального маневра почти без задержки сигнала.',
    },
  ],
  mars: [
    {
      id: 'phobos',
      name: 'Фобос',
      type: 'неровный малый спутник',
      diameter: '22.5 км',
      orbit: '9 376 км',
      signal: '91%',
      color: '#b49a82',
      bio:
        'Быстрый спутник Марса с очень низкой орбитой. Хорош для скрытого ретранслятора и наблюдения за пылевыми бурями почти в реальном времени.',
    },
    {
      id: 'deimos',
      name: 'Деймос',
      type: 'дальний малый спутник',
      diameter: '12.4 км',
      orbit: '23 463 км',
      signal: '86%',
      color: '#c4ad91',
      bio:
        'Меньше и дальше Фобоса. Стабильная точка для навигационного маяка, когда низкая орбита Марса забита роверами и грузовыми окнами.',
    },
  ],
  jupiter: [
    {
      id: 'io',
      name: 'Ио',
      type: 'вулканический мир',
      diameter: '3 643 км',
      orbit: '421 700 км',
      signal: '73%',
      color: '#ffd05d',
      bio:
        'Самое вулканически активное тело системы. Миссии к Ио требуют жесткой радиационной защиты и дают эффектные тепловые карты.',
    },
    {
      id: 'europa',
      name: 'Европа',
      type: 'ледяной океанический спутник',
      diameter: '3 122 км',
      orbit: '671 100 км',
      signal: '78%',
      color: '#d9f7ff',
      bio:
        'Гладкая ледяная поверхность скрывает океан. Лучший кандидат для подледного радара и поиска химических следов жизни.',
    },
    {
      id: 'ganymede',
      name: 'Ганимед',
      type: 'крупнейший спутник',
      diameter: '5 268 км',
      orbit: '1 070 400 км',
      signal: '81%',
      color: '#b8a68e',
      bio:
        'Больше Меркурия и имеет собственное магнитное поле. Идеальная орбитальная станция для всей системы Юпитера.',
    },
    {
      id: 'callisto',
      name: 'Каллисто',
      type: 'древний кратерный спутник',
      diameter: '4 821 км',
      orbit: '1 882 700 км',
      signal: '84%',
      color: '#82766d',
      bio:
        'Дальний и относительно спокойный спутник. Хорошая точка для безопасной базы вне самых жестких радиационных зон.',
    },
  ],
  saturn: [
    {
      id: 'titan',
      name: 'Титан',
      type: 'атмосферный спутник',
      diameter: '5 150 км',
      orbit: '1 221 870 км',
      signal: '76%',
      color: '#e7a84f',
      bio:
        'Плотная атмосфера и метановые моря делают Титан почти отдельной планетой. Отличная цель для дронов и посадочных капсул.',
    },
    {
      id: 'enceladus',
      name: 'Энцелад',
      type: 'ледяной спутник с гейзерами',
      diameter: '504 км',
      orbit: '238 020 км',
      signal: '82%',
      color: '#eaffff',
      bio:
        'Выбрасывает водяные шлейфы из подповерхностного океана. Сканер может брать материал прямо из космоса без посадки.',
    },
    {
      id: 'rhea',
      name: 'Рея',
      type: 'ледяной кратерный спутник',
      diameter: '1 527 км',
      orbit: '527 040 км',
      signal: '79%',
      color: '#d8d0be',
      bio:
        'Спокойная ледяная цель для ретрансляции и калибровки траекторий вокруг колец Сатурна.',
    },
  ],
  uranus: [
    {
      id: 'miranda',
      name: 'Миранда',
      type: 'разломанный ледяной спутник',
      diameter: '472 км',
      orbit: '129 900 км',
      signal: '68%',
      color: '#c9edf0',
      bio:
        'Поверхность выглядит как собранная из разных геологических миров. Идеальная цель для визуального сканера рельефа.',
    },
    {
      id: 'ariel',
      name: 'Ариэль',
      type: 'ледяной спутник с каньонами',
      diameter: '1 158 км',
      orbit: '191 000 км',
      signal: '72%',
      color: '#d8f8ff',
      bio:
        'Яркий спутник с каньонами и следами обновления поверхности. Хорош для миссий геологического профилирования.',
    },
    {
      id: 'titania',
      name: 'Титания',
      type: 'крупнейший спутник Урана',
      diameter: '1 578 км',
      orbit: '436 300 км',
      signal: '74%',
      color: '#b9d8db',
      bio:
        'Крупнейший спутник системы Урана. Удобная дальняя точка для связи и гравитационных маневров.',
    },
    {
      id: 'oberon',
      name: 'Оберон',
      type: 'дальний темный спутник',
      diameter: '1 523 км',
      orbit: '583 500 км',
      signal: '70%',
      color: '#a9adaf',
      bio:
        'Внешний спутник с темными отложениями. Полезен как тихая точка наблюдения за всей наклоненной системой.',
    },
  ],
  neptune: [
    {
      id: 'triton',
      name: 'Тритон',
      type: 'ретроградный ледяной спутник',
      diameter: '2 707 км',
      orbit: '354 800 км',
      signal: '62%',
      color: '#d6f3ff',
      bio:
        'Крупный спутник с обратным движением и азотными гейзерами. Очень эффектная цель для дальнего крио-сканирования.',
    },
    {
      id: 'nereid',
      name: 'Нереида',
      type: 'эксцентричный спутник',
      diameter: '340 км',
      orbit: '5 513 400 км',
      signal: '48%',
      color: '#a6b4ca',
      bio:
        'Дальний спутник с вытянутой орбитой. Его удобно использовать для демонстрации задержек сигнала и автономного ИИ-планирования.',
    },
    {
      id: 'proteus',
      name: 'Протей',
      type: 'темный неправильный спутник',
      diameter: '420 км',
      orbit: '117 600 км',
      signal: '59%',
      color: '#8b93a0',
      bio:
        'Крупный темный спутник рядом с Нептуном. Хорош для теста слабого освещения и навигации у ледяного гиганта.',
    },
  ],
}

const PLANET_ORDER = ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune']

const PLANETS = PLANET_ORDER.map((id) =>
  [...BASE_PLANETS, ...EXTRA_PLANETS].find((planet) => planet.id === id),
).map((planet) => ({
  ...planet,
  moons: PLANET_MOONS[planet.id] ?? [],
}))

const MISSION_MODES = [
  {
    id: 'survey',
    label: 'Скан',
    title: 'Orbital Survey',
    icon: Radar,
    readiness: 3,
    log: 'режим орбитального сканирования',
  },
  {
    id: 'relay',
    label: 'Связь',
    title: 'Deep Relay',
    icon: RadioTower,
    readiness: 6,
    log: 'режим усиления дальней связи',
  },
  {
    id: 'probe',
    label: 'Зонд',
    title: 'Probe Drop',
    icon: Rocket,
    readiness: -4,
    log: 'режим спуска автоматического зонда',
  },
]

const STATUS_CARDS = [
  ['ИИ-директор', 'ATHENA ONLINE', Sparkles],
  ['Глубокая связь', '12.8 Тбит/с', RadioTower],
  ['Спутники', '47 активны', Satellite],
  ['Угрозы', '3 события', ShieldAlert],
]

const formatClock = () =>
  new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(new Date())

const addLog = (setLogs, message, tone = 'info') => {
  setLogs((current) =>
    [
      {
        time: formatClock(),
        message,
        tone,
      },
      ...current,
    ].slice(0, 12),
  )
}

const hexToRgb = (hex) => {
  const value = hex.replace('#', '')
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  }
}

const mixRgb = (a, b, amount) => ({
  r: Math.round(a.r + (b.r - a.r) * amount),
  g: Math.round(a.g + (b.g - a.g) * amount),
  b: Math.round(a.b + (b.b - a.b) * amount),
})

const writePixel = (data, index, color, alpha = 255) => {
  data[index] = color.r
  data[index + 1] = color.g
  data[index + 2] = color.b
  data[index + 3] = alpha
}

const waveNoise = (x, y, seed) => {
  const a = Math.sin((x * 7.1 + seed) * Math.PI * 2)
  const b = Math.sin((y * 9.7 + seed * 0.13) * Math.PI * 2)
  const c = Math.sin(((x + y) * 12.3 + seed * 0.21) * Math.PI)
  const d = Math.sin((x * 21.9 - y * 13.4 + seed * 0.07) * Math.PI)
  return (a + b + c + d) / 4
}

const seeded = (seed) => {
  let value = seed * 16807
  return () => {
    value = (value * 48271) % 2147483647
    return value / 2147483647
  }
}

function createPlanetTexture(planet) {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 512
  const ctx = canvas.getContext('2d')
  const image = ctx.createImageData(canvas.width, canvas.height)
  const colors = {
    deepOcean: hexToRgb('#062a55'),
    ocean: hexToRgb('#1176a8'),
    land: hexToRgb('#358957'),
    dryLand: hexToRgb('#b89c5d'),
    ice: hexToRgb('#e9fbff'),
    marsA: hexToRgb('#8f351e'),
    marsB: hexToRgb('#e46f39'),
    marsC: hexToRgb('#f0b06c'),
    venusA: hexToRgb('#a85f22'),
    venusB: hexToRgb('#f7cf78'),
    venusC: hexToRgb('#fff0ab'),
    jupiterA: hexToRgb('#6c3f26'),
    jupiterB: hexToRgb('#f4c08b'),
    jupiterC: hexToRgb('#fff2ca'),
    jupiterD: hexToRgb('#b66f43'),
    saturnA: hexToRgb('#b58a4c'),
    saturnB: hexToRgb('#f7dfaa'),
    saturnC: hexToRgb('#fff4d1'),
    mercuryA: hexToRgb('#4c4741'),
    mercuryB: hexToRgb('#9c907d'),
    mercuryC: hexToRgb('#d7c7a0'),
    neptuneA: hexToRgb('#163f9f'),
    neptuneB: hexToRgb('#326cff'),
    neptuneC: hexToRgb('#86e8ff'),
    uranusA: hexToRgb('#3e9db1'),
    uranusB: hexToRgb('#92fff4'),
    uranusC: hexToRgb('#d5fffb'),
  }

  for (let y = 0; y < canvas.height; y += 1) {
    const v = y / canvas.height
    const latitude = Math.abs(v - 0.5) * 2

    for (let x = 0; x < canvas.width; x += 1) {
      const u = x / canvas.width
      const noise = waveNoise(u, v, planet.seed)
      let color

      if (planet.texture === 'earth') {
        const continental =
          Math.sin((u * 8.4 + noise * 0.8 + planet.seed * 0.05) * Math.PI) +
          Math.sin((v * 11.6 - planet.seed * 0.03) * Math.PI) +
          Math.sin(((u - v) * 6.5 + planet.seed * 0.1) * Math.PI)
        const land = continental > 0.35
        color = land
          ? mixRgb(colors.land, colors.dryLand, Math.max(0, noise) * 0.62)
          : mixRgb(colors.deepOcean, colors.ocean, 0.35 + Math.max(0, noise) * 0.45)
        if (latitude > 0.78) {
          color = mixRgb(color, colors.ice, Math.min(1, (latitude - 0.78) * 4.6))
        }
      }

      if (planet.texture === 'mars') {
        const dune = Math.sin((u * 24 + noise * 2.5) * Math.PI) * 0.18
        color = mixRgb(colors.marsA, colors.marsB, 0.48 + noise * 0.28 + dune)
        if (latitude > 0.82) color = mixRgb(color, colors.marsC, 0.48)
      }

      if (planet.texture === 'mercury') {
        const scar = Math.sin((u * 38 + v * 11 + noise * 2.5) * Math.PI) * 0.12
        color = mixRgb(colors.mercuryA, colors.mercuryB, 0.52 + noise * 0.3 + scar)
        color = mixRgb(color, colors.mercuryC, Math.max(0, waveNoise(u * 2, v * 2, planet.seed + 3)) * 0.2)
      }

      if (planet.texture === 'venus') {
        const swirl = Math.sin((u * 17 + v * 7 + noise * 3) * Math.PI) * 0.22
        color = mixRgb(colors.venusA, colors.venusB, 0.62 + swirl)
        color = mixRgb(color, colors.venusC, Math.max(0, noise) * 0.25)
      }

      if (planet.texture === 'jupiter') {
        const band = Math.sin((v * 21 + noise * 0.9) * Math.PI)
        const base = band > 0.34 ? colors.jupiterC : band < -0.45 ? colors.jupiterA : colors.jupiterB
        color = mixRgb(base, colors.jupiterD, Math.max(0, noise) * 0.3)
      }

      if (planet.texture === 'saturn') {
        const band = Math.sin((v * 18 + noise * 0.55) * Math.PI)
        const base = band > 0.25 ? colors.saturnC : band < -0.35 ? colors.saturnA : colors.saturnB
        color = mixRgb(base, colors.saturnA, Math.max(0, noise) * 0.18)
      }

      if (planet.texture === 'neptune') {
        const storm = Math.sin((u * 12 - v * 9 + noise * 2.4) * Math.PI)
        color = mixRgb(colors.neptuneA, colors.neptuneB, 0.55 + noise * 0.2)
        color = mixRgb(color, colors.neptuneC, Math.max(0, storm) * 0.24)
      }

      if (planet.texture === 'uranus') {
        const calmBand = Math.sin((v * 9 + noise * 0.42) * Math.PI) * 0.08
        color = mixRgb(colors.uranusA, colors.uranusB, 0.64 + calmBand)
        color = mixRgb(color, colors.uranusC, Math.max(0, noise) * 0.14)
      }

      writePixel(image.data, (y * canvas.width + x) * 4, color)
    }
  }

  ctx.putImageData(image, 0, 0)

  if (planet.texture === 'jupiter') {
    ctx.save()
    ctx.globalAlpha = 0.88
    ctx.fillStyle = '#c75337'
    ctx.beginPath()
    ctx.ellipse(680, 305, 96, 34, -0.08, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalAlpha = 0.35
    ctx.fillStyle = '#ffe6bd'
    ctx.beginPath()
    ctx.ellipse(650, 296, 46, 12, -0.1, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }

  if (planet.texture === 'mars' || planet.texture === 'mercury') {
    const random = seeded(planet.seed)
    ctx.save()
    for (let i = 0; i < (planet.texture === 'mercury' ? 118 : 56); i += 1) {
      const x = random() * canvas.width
      const y = random() * canvas.height
      const size = 2 + random() * (planet.texture === 'mercury' ? 24 : 18)
      ctx.globalAlpha = 0.07 + random() * 0.13
      ctx.strokeStyle = planet.texture === 'mercury' ? '#181512' : '#32150e'
      ctx.lineWidth = planet.texture === 'mercury' ? 1 : 1.5
      ctx.beginPath()
      ctx.arc(x, y, size, 0, Math.PI * 2)
      ctx.stroke()
    }
    ctx.restore()
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.ClampToEdgeWrapping
  return texture
}

function createBumpTexture(planet) {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 256
  const ctx = canvas.getContext('2d')
  const image = ctx.createImageData(canvas.width, canvas.height)

  for (let y = 0; y < canvas.height; y += 1) {
    const v = y / canvas.height

    for (let x = 0; x < canvas.width; x += 1) {
      const u = x / canvas.width
      const noise = waveNoise(u, v, planet.seed + 7)
      const value = Math.round(115 + noise * 82)
      const index = (y * canvas.width + x) * 4
      image.data[index] = value
      image.data[index + 1] = value
      image.data[index + 2] = value
      image.data[index + 3] = 255
    }
  }

  ctx.putImageData(image, 0, 0)
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.ClampToEdgeWrapping
  return texture
}

function createCloudTexture(planet) {
  if (!['earth', 'venus', 'neptune', 'uranus'].includes(planet.texture)) return null

  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 512
  const ctx = canvas.getContext('2d')
  const image = ctx.createImageData(canvas.width, canvas.height)

  for (let y = 0; y < canvas.height; y += 1) {
    const v = y / canvas.height

    for (let x = 0; x < canvas.width; x += 1) {
      const u = x / canvas.width
      const noise = waveNoise(u * 1.2, v * 1.05, planet.seed + 19)
      const streak = Math.sin((u * 25 + v * 5 + noise * 2.8) * Math.PI)
      const alphaBase = planet.texture === 'venus' ? 132 : planet.texture === 'neptune' ? 48 : planet.texture === 'uranus' ? 38 : 74
      const alpha = Math.max(0, Math.round((noise + streak * 0.45 - 0.18) * alphaBase))
      const index = (y * canvas.width + x) * 4
      image.data[index] = 255
      image.data[index + 1] = 255
      image.data[index + 2] = planet.texture === 'venus' ? 210 : 255
      image.data[index + 3] = Math.min(172, alpha)
    }
  }

  ctx.putImageData(image, 0, 0)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.ClampToEdgeWrapping
  return texture
}

function createRingTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 128
  const ctx = canvas.getContext('2d')
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
  gradient.addColorStop(0, 'rgba(255,255,255,0)')
  gradient.addColorStop(0.08, 'rgba(255,238,189,0.20)')
  gradient.addColorStop(0.18, 'rgba(255,228,160,0.82)')
  gradient.addColorStop(0.29, 'rgba(126,103,78,0.18)')
  gradient.addColorStop(0.39, 'rgba(255,242,205,0.74)')
  gradient.addColorStop(0.56, 'rgba(201,169,111,0.46)')
  gradient.addColorStop(0.74, 'rgba(255,250,222,0.66)')
  gradient.addColorStop(0.92, 'rgba(255,236,183,0.14)')
  gradient.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.wrapS = THREE.ClampToEdgeWrapping
  texture.wrapT = THREE.ClampToEdgeWrapping
  return texture
}

function createOrbitLine(radius, color, opacity, tilt = 0) {
  const points = []
  for (let i = 0; i < 160; i += 1) {
    const angle = (i / 160) * Math.PI * 2
    points.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius))
  }
  const geometry = new THREE.BufferGeometry().setFromPoints(points)
  const material = new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity,
  })
  const line = new THREE.LineLoop(geometry, material)
  line.rotation.x = tilt
  return line
}

function disposeObject(object) {
  object.traverse((child) => {
    if (child.geometry) child.geometry.dispose()
    if (child.material) {
      const materials = Array.isArray(child.material) ? child.material : [child.material]
      materials.forEach((material) => {
        Object.keys(material).forEach((key) => {
          const value = material[key]
          if (value && typeof value.dispose === 'function') value.dispose()
        })
        material.dispose()
      })
    }
  })
}

function PlanetScene({ planet, launching, selectedMoon }) {
  const mountRef = useRef(null)
  const refs = useRef({
    launching: false,
    orbiters: [],
    scanRings: [],
    launchBeam: null,
    moonPivot: null,
  })

  useEffect(() => {
    const mount = mountRef.current
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 120)
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })
    const group = new THREE.Group()
    const orbitShell = new THREE.Group()
    const clock = new THREE.Clock()

    camera.position.set(0, 0.35, 7.1)
    renderer.setClearColor(0x000000, 0)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.12
    mount.appendChild(renderer.domElement)

    scene.add(new THREE.AmbientLight(0x9ab1b8, 0.56))

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.2)
    keyLight.position.set(-4.2, 3.4, 5.2)
    scene.add(keyLight)

    const rimLight = new THREE.PointLight(0x73f8ff, 16, 18)
    rimLight.position.set(4.3, -2.2, 3.4)
    scene.add(rimLight)

    const starGeometry = new THREE.BufferGeometry()
    const starCount = 1400
    const positions = new Float32Array(starCount * 3)
    const random = seeded(301)
    for (let i = 0; i < starCount; i += 1) {
      const radius = 18 + random() * 38
      const theta = random() * Math.PI * 2
      const phi = Math.acos(2 * random() - 1)
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = radius * Math.cos(phi)
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const stars = new THREE.Points(
      starGeometry,
      new THREE.PointsMaterial({
        color: 0xd8fbff,
        size: 0.032,
        transparent: true,
        opacity: 0.78,
        depthWrite: false,
      }),
    )
    scene.add(stars)

    orbitShell.add(createOrbitLine(2.65, 0x57e8ff, 0.23, 0.3))
    orbitShell.add(createOrbitLine(3.25, 0xffc35f, 0.17, -0.18))
    orbitShell.add(createOrbitLine(3.85, 0x8affcb, 0.13, 0.52))
    orbitShell.rotation.z = 0.22
    scene.add(orbitShell)
    scene.add(group)

    refs.current.scene = scene
    refs.current.camera = camera
    refs.current.renderer = renderer
    refs.current.group = group
    refs.current.stars = stars
    refs.current.orbitShell = orbitShell

    const resize = () => {
      const { width, height } = mount.getBoundingClientRect()
      renderer.setSize(width, height, false)
      camera.aspect = width / Math.max(1, height)
      camera.position.z = camera.aspect < 0.78 ? 9.3 : camera.aspect < 1.05 ? 8.1 : 7.1
      camera.updateProjectionMatrix()
    }

    const observer = new ResizeObserver(resize)
    observer.observe(mount)
    resize()

    let raf = 0
    const render = () => {
      const elapsed = clock.getElapsedTime()
      const current = refs.current
      const activeGroup = current.group

      stars.rotation.y = elapsed * 0.012
      stars.rotation.x = Math.sin(elapsed * 0.12) * 0.03
      orbitShell.rotation.y = elapsed * 0.05

      if (activeGroup) {
        activeGroup.rotation.y += current.planetRotation || 0.002
        activeGroup.rotation.x = Math.sin(elapsed * 0.34) * 0.055

        const spawnAge = Math.min(1, (performance.now() - (activeGroup.userData.spawnTime || 0)) / 850)
        const ease = 1 - (1 - spawnAge) ** 3
        const pulse = current.launching ? Math.sin(elapsed * 9) * 0.026 : 0
        activeGroup.scale.setScalar(0.28 + ease * 0.72 + pulse)
      }

      current.orbiters.forEach((orbiter, index) => {
        orbiter.rotation.y = elapsed * (0.42 + index * 0.16)
        orbiter.rotation.z = Math.sin(elapsed * 0.32 + index) * 0.2
      })

      if (current.moonPivot) {
        current.moonPivot.rotation.y = elapsed * 0.72
        current.moonPivot.rotation.x = Math.sin(elapsed * 0.25) * 0.18
      }

      current.scanRings.forEach((ring, index) => {
        ring.rotation.z = elapsed * (0.32 + index * 0.08)
        ring.material.opacity = current.launching ? 0.26 + Math.sin(elapsed * 7 + index) * 0.16 : 0.13
      })

      if (current.cloudLayer) {
        current.cloudLayer.rotation.y += 0.0008
      }

      if (current.launchBeam) {
        current.launchBeam.material.opacity = current.launching
          ? 0.18 + Math.max(0, Math.sin(elapsed * 10)) * 0.18
          : 0
      }

      renderer.render(scene, camera)
      raf = requestAnimationFrame(render)
    }
    render()

    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
      disposeObject(group)
      disposeObject(orbitShell)
      starGeometry.dispose()
      stars.material.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  useEffect(() => {
    const current = refs.current
    const group = current.group
    if (!group) return

    disposeObject(group)
    group.clear()
    current.orbiters = []
    current.scanRings = []
    current.cloudLayer = null
    current.launchBeam = null
    current.moonPivot = null
    current.planetRotation = planet.rotation

    const surface = createPlanetTexture(planet)
    const bump = createBumpTexture(planet)
    const cloud = createCloudTexture(planet)
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(planet.radius, 128, 96),
      new THREE.MeshStandardMaterial({
        map: surface,
        bumpMap: bump,
        bumpScale: planet.texture === 'jupiter' || planet.texture === 'saturn' ? 0.018 : 0.055,
        roughness: 0.74,
        metalness: 0.02,
      }),
    )
    sphere.rotation.z = planet.texture === 'earth' ? -0.18 : planet.texture === 'uranus' ? 1.12 : -0.05
    group.add(sphere)

    if (cloud) {
      const cloudLayer = new THREE.Mesh(
        new THREE.SphereGeometry(planet.radius * 1.016, 96, 64),
        new THREE.MeshStandardMaterial({
          map: cloud,
          transparent: true,
          opacity: planet.texture === 'venus' ? 0.74 : 0.42,
          depthWrite: false,
          roughness: 1,
        }),
      )
      group.add(cloudLayer)
      current.cloudLayer = cloudLayer
    }

    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(planet.radius * 1.075, 96, 64),
      new THREE.ShaderMaterial({
        uniforms: {
          glowColor: { value: new THREE.Color(planet.atmosphere) },
        },
        vertexShader: `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 glowColor;
          varying vec3 vNormal;
          void main() {
            float intensity = pow(0.62 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.2);
            gl_FragColor = vec4(glowColor, intensity * 0.78);
          }
        `,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
      }),
    )
    group.add(atmosphere)

    if (planet.rings) {
      const rings = new THREE.Mesh(
        new THREE.RingGeometry(
          planet.radius * (planet.rings === 'thin' ? 1.42 : 1.34),
          planet.radius * (planet.rings === 'thin' ? 1.76 : 2.18),
          192,
        ),
        new THREE.MeshBasicMaterial({
          map: createRingTexture(),
          transparent: true,
          side: THREE.DoubleSide,
          opacity: planet.rings === 'thin' ? 0.44 : 0.92,
          depthWrite: false,
        }),
      )
      rings.rotation.x = planet.rings === 'thin' ? Math.PI * 0.88 : Math.PI * 0.57
      rings.rotation.y = planet.rings === 'thin' ? 0.86 : 0.14
      group.add(rings)
    }

    const beam = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.48, planet.radius * 4.4, 64, 1, true),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(planet.accent),
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    )
    beam.rotation.z = Math.PI * 0.5
    beam.position.x = -planet.radius * 1.35
    group.add(beam)
    current.launchBeam = beam

    const ringOne = new THREE.Mesh(
      new THREE.TorusGeometry(planet.radius * 1.18, 0.006, 8, 160),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(planet.accent),
        transparent: true,
        opacity: 0.14,
        depthWrite: false,
      }),
    )
    ringOne.rotation.x = Math.PI * 0.5
    group.add(ringOne)
    current.scanRings.push(ringOne)

    const ringTwo = ringOne.clone()
    ringTwo.geometry = new THREE.TorusGeometry(planet.radius * 1.34, 0.005, 8, 160)
    ringTwo.rotation.x = Math.PI * 0.5
    ringTwo.rotation.y = 0.7
    group.add(ringTwo)
    current.scanRings.push(ringTwo)

    for (let index = 0; index < 3; index += 1) {
      const pivot = new THREE.Group()
      pivot.rotation.x = 0.34 + index * 0.42
      pivot.rotation.z = index * 1.2
      const satelliteBody = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 0.07, 0.12),
        new THREE.MeshStandardMaterial({
          color: index === 1 ? 0xffcf77 : 0xcff7ff,
          metalness: 0.65,
          roughness: 0.3,
        }),
      )
      satelliteBody.position.x = planet.radius * (1.55 + index * 0.21)

      const panelMaterial = new THREE.MeshBasicMaterial({
        color: 0x5cf7ff,
        transparent: true,
        opacity: 0.72,
        side: THREE.DoubleSide,
      })
      const panelLeft = new THREE.Mesh(new THREE.PlaneGeometry(0.18, 0.05), panelMaterial)
      const panelRight = panelLeft.clone()
      panelLeft.position.set(satelliteBody.position.x - 0.15, 0, 0)
      panelRight.position.set(satelliteBody.position.x + 0.15, 0, 0)
      pivot.add(satelliteBody, panelLeft, panelRight)
      group.add(pivot)
      current.orbiters.push(pivot)
    }

    group.userData.spawnTime = performance.now()
  }, [planet])

  useEffect(() => {
    const current = refs.current
    const group = current.group
    if (!group) return

    if (current.moonPivot) {
      group.remove(current.moonPivot)
      disposeObject(current.moonPivot)
      current.moonPivot = null
    }

    if (!selectedMoon) return

    const orbitRadius = planet.radius * 1.74
    const moonPivot = new THREE.Group()
    moonPivot.rotation.z = 0.38
    const orbit = createOrbitLine(orbitRadius, new THREE.Color(selectedMoon.color), 0.32, 0.22)
    const moon = new THREE.Mesh(
      new THREE.SphereGeometry(Math.max(0.055, planet.radius * 0.055), 36, 24),
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(selectedMoon.color),
        roughness: 0.72,
        metalness: 0.04,
        emissive: new THREE.Color(selectedMoon.color),
        emissiveIntensity: 0.06,
      }),
    )
    moon.position.x = orbitRadius

    const beacon = new THREE.Mesh(
      new THREE.SphereGeometry(Math.max(0.09, planet.radius * 0.085), 32, 18),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(selectedMoon.color),
        transparent: true,
        opacity: 0.22,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    )
    beacon.position.copy(moon.position)
    moonPivot.add(orbit, moon, beacon)
    group.add(moonPivot)
    current.moonPivot = moonPivot
  }, [planet.radius, selectedMoon])

  useEffect(() => {
    refs.current.launching = launching
  }, [launching])

  return <div ref={mountRef} className="planet-canvas" aria-label={`3D модель: ${planet.name}`} />
}

function TelemetryChart({ planet }) {
  const values = useMemo(() => {
    const base = planet.telemetry.uplink
    return Array.from({ length: 24 }, (_, index) => {
      const wave =
        Math.sin(index * 0.72 + planet.seed) * 7 +
        Math.sin(index * 0.25 + planet.seed * 0.3) * 5
      return Math.max(18, Math.min(100, Math.round(base + wave)))
    })
  }, [planet])

  const points = values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * 320
      const y = 112 - (value / 100) * 94
      return `${x},${y}`
    })
    .join(' ')

  const fillPoints = `0,120 ${points} 320,120`

  return (
    <svg className="telemetry-chart" viewBox="0 0 320 120" role="img" aria-label="График сигнала">
      <defs>
        <linearGradient id="signalFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={planet.accent} stopOpacity="0.42" />
          <stop offset="100%" stopColor={planet.accent} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`M ${fillPoints}`} fill="url(#signalFill)" />
      <polyline points={points} fill="none" stroke={planet.accent} strokeWidth="4" strokeLinecap="round" />
      <line x1="0" y1="82" x2="320" y2="82" />
      <line x1="0" y1="44" x2="320" y2="44" />
    </svg>
  )
}

function PlanetSelector({ selectedId, onSelect }) {
  return (
    <div className="planet-list">
      {PLANETS.map((planet) => (
        <button
          className={`planet-option ${selectedId === planet.id ? 'is-active' : ''}`}
          key={planet.id}
          onClick={() => onSelect(planet.id)}
          style={{ '--planet-color': planet.accent }}
          type="button"
        >
          <span className="planet-swatch" />
          <span>
            <strong>{planet.name}</strong>
            <small>{planet.codename}</small>
          </span>
          <Orbit size={16} aria-hidden="true" />
        </button>
      ))}
    </div>
  )
}

function MissionModeSwitch({ selectedMode, onChange }) {
  return (
    <div className="mode-switch" role="group" aria-label="Режим миссии">
      {MISSION_MODES.map((mode) => {
        const Icon = mode.icon
        return (
          <button
            className={selectedMode === mode.id ? 'is-active' : ''}
            key={mode.id}
            onClick={() => onChange(mode.id)}
            type="button"
          >
            <Icon size={15} aria-hidden="true" />
            <span>{mode.label}</span>
          </button>
        )
      })}
    </div>
  )
}

function MoonSelector({ planet, selectedMoonId, onSelect }) {
  if (!planet.moons.length) {
    return (
      <div className="moon-empty">
        <Satellite size={20} aria-hidden="true" />
        <p>У этой планеты нет естественных спутников. Командный центр переключается на искусственные маяки и солнечные ретрансляторы.</p>
      </div>
    )
  }

  return (
    <div className="moon-list">
      {planet.moons.map((moon) => (
        <button
          className={`moon-option ${selectedMoonId === moon.id ? 'is-active' : ''}`}
          key={moon.id}
          onClick={() => onSelect(moon.id)}
          style={{ '--moon-color': moon.color }}
          type="button"
        >
          <span className="moon-dot" />
          <span>
            <strong>{moon.name}</strong>
            <small>{moon.type}</small>
          </span>
          <strong>{moon.signal}</strong>
        </button>
      ))}
    </div>
  )
}

function MissionMap({ planet }) {
  return (
    <div className="mission-map" style={{ '--planet-color': planet.accent }}>
      <div className="map-grid" />
      <span className="map-node node-a" />
      <span className="map-node node-b" />
      <span className="map-node node-c" />
      <span className="map-node node-d" />
      <div className="map-core">
        <Radar size={28} aria-hidden="true" />
      </div>
    </div>
  )
}

function StatTile({ label, value }) {
  return (
    <div className="stat-tile">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function App() {
  const [selectedId, setSelectedId] = useState('earth')
  const [selectedMoonId, setSelectedMoonId] = useState('moon')
  const [missionMode, setMissionMode] = useState('survey')
  const [scanReport, setScanReport] = useState(null)
  const [clock, setClock] = useState(formatClock)
  const [launching, setLaunching] = useState(false)
  const [progress, setProgress] = useState(0)
  const [logs, setLogs] = useState([
    { time: formatClock(), message: 'ATHENA подключила контур прогнозирования миссий.', tone: 'success' },
    { time: formatClock(), message: 'Сканирование планетарных каналов завершено.', tone: 'info' },
    { time: formatClock(), message: 'Ожидание выбора цели и подтверждения запуска.', tone: 'warn' },
  ])

  const selectedPlanet = useMemo(
    () => PLANETS.find((planet) => planet.id === selectedId) ?? PLANETS[0],
    [selectedId],
  )

  const currentMode = useMemo(
    () => MISSION_MODES.find((mode) => mode.id === missionMode) ?? MISSION_MODES[0],
    [missionMode],
  )

  const selectedMoon = useMemo(
    () => selectedPlanet.moons.find((moon) => moon.id === selectedMoonId) ?? selectedPlanet.moons[0] ?? null,
    [selectedMoonId, selectedPlanet],
  )

  useEffect(() => {
    const timer = setInterval(() => setClock(formatClock()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    addLog(setLogs, `Загружен биоскан: ${selectedPlanet.name}. Миссия ${selectedPlanet.mission} готова.`, 'info')
  }, [selectedPlanet])

  useEffect(() => {
    if (!launching) return undefined

    const timer = setInterval(() => {
      setProgress((current) => {
        const next = Math.min(100, current + 6 + Math.round(Math.random() * 9))
        if (next >= 100) {
          clearInterval(timer)
          window.setTimeout(() => {
            setLaunching(false)
            addLog(setLogs, `Запуск ${selectedPlanet.mission} подтвержден. Автопилот вышел на расчетную траекторию.`, 'success')
          }, 380)
        }
        return next
      })
    }, 420)

    return () => clearInterval(timer)
  }, [launching, selectedPlanet.mission])

  const handleSelectPlanet = (planetId) => {
    setSelectedId(planetId)
    setProgress(0)
  }

  const handleLaunch = () => {
    if (launching) return
    setProgress(8)
    setLaunching(true)
    addLog(setLogs, `Стартовая последовательность активирована: ${selectedPlanet.mission}.`, 'warn')
  }

  const missionReadiness = Math.round(
    (selectedPlanet.telemetry.uplink +
      selectedPlanet.telemetry.stability +
      selectedPlanet.telemetry.crew +
      (100 - selectedPlanet.telemetry.radiation)) /
      4,
  )

  return (
    <main className="mission-shell" style={{ '--planet-glow': selectedPlanet.accent }}>
      <div className="space-backdrop" aria-hidden="true" />

      <header className="topbar">
        <div className="brand-lockup">
          <div className="mission-mark">
            <Rocket size={28} aria-hidden="true" />
          </div>
          <div>
            <p>AI MISSION CONTROL</p>
            <h1>Orbital Command Center</h1>
          </div>
        </div>

        <div className="status-strip">
          {STATUS_CARDS.map(([label, value, Icon]) => (
            <div className="status-chip" key={label}>
              <Icon size={16} aria-hidden="true" />
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
          <div className="status-chip clock-chip">
            <TimerReset size={16} aria-hidden="true" />
            <span>UTC LINK</span>
            <strong>{clock}</strong>
          </div>
        </div>
      </header>

      <section className="mission-grid">
        <aside className="control-panel">
          <div className="panel-heading">
            <Globe2 size={18} aria-hidden="true" />
            <span>Выбор цели</span>
          </div>
          <PlanetSelector selectedId={selectedId} onSelect={handleSelectPlanet} />

          <div className="panel-heading compact">
            <Crosshair size={18} aria-hidden="true" />
            <span>Секторная карта</span>
          </div>
          <MissionMap planet={selectedPlanet} />

          <div className="readiness-block">
            <div>
              <span>Готовность миссии</span>
              <strong>{missionReadiness}%</strong>
            </div>
            <div className="readiness-bar">
              <span style={{ width: `${missionReadiness}%` }} />
            </div>
          </div>
        </aside>

        <section className="planet-stage">
          <PlanetScene planet={selectedPlanet} launching={launching} />
          <div className="stage-vignette" aria-hidden="true" />
          <div className="stage-hud">
            <div className="target-lock">
              <span>ACTIVE TARGET</span>
              <strong>{selectedPlanet.codename}</strong>
            </div>
            <div className="signal-lock">
              <Signal size={18} aria-hidden="true" />
              <span>{selectedPlanet.telemetry.uplink}% uplink</span>
            </div>
          </div>
          <div className="planet-caption">
            <p>{selectedPlanet.className}</p>
            <h2>{selectedPlanet.name}</h2>
          </div>
        </section>

        <aside className="bio-panel">
          <div className="panel-heading">
            <BadgeInfo size={18} aria-hidden="true" />
            <span>Био планеты</span>
          </div>
          <p className="bio-copy">{selectedPlanet.bio}</p>

          <div className="stats-grid">
            {selectedPlanet.stats.map(([label, value]) => (
              <StatTile key={label} label={label} value={value} />
            ))}
          </div>

          <div className="launch-module">
            <div>
              <span>Активная миссия</span>
              <strong>{selectedPlanet.mission}</strong>
            </div>
            <button className="launch-button" onClick={handleLaunch} type="button" disabled={launching}>
              <Rocket size={19} aria-hidden="true" />
              {launching ? 'Запуск идет' : 'Запустить миссию'}
            </button>
            <div className="launch-progress" aria-label="Прогресс запуска">
              <span style={{ width: `${progress}%` }} />
            </div>
          </div>
        </aside>
      </section>

      <section className="lower-grid">
        <section className="terminal-panel">
          <div className="panel-heading">
            <Activity size={18} aria-hidden="true" />
            <span>Терминал миссии</span>
          </div>
          <div className="terminal-feed">
            {logs.map((log, index) => (
              <div className={`terminal-line ${log.tone}`} key={`${log.time}-${log.message}-${index}`}>
                <span>{log.time}</span>
                <p>{log.message}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="telemetry-panel">
          <div className="panel-heading">
            <Gauge size={18} aria-hidden="true" />
            <span>Телеметрия</span>
          </div>
          <TelemetryChart planet={selectedPlanet} />
          <div className="metric-row">
            <div>
              <span>Стабильность</span>
              <strong>{selectedPlanet.telemetry.stability}%</strong>
            </div>
            <div>
              <span>Радиация</span>
              <strong>{selectedPlanet.telemetry.radiation}%</strong>
            </div>
            <div>
              <span>Термоконтур</span>
              <strong>{selectedPlanet.telemetry.thermal}%</strong>
            </div>
            <div>
              <span>Экипаж</span>
              <strong>{selectedPlanet.telemetry.crew}%</strong>
            </div>
          </div>
        </section>

        <section className="alert-panel">
          <div className="panel-heading">
            <AlertTriangle size={18} aria-hidden="true" />
            <span>Тревоги и сигналы</span>
          </div>
          <div className="alert-list">
            {selectedPlanet.alerts.map((alert, index) => (
              <div className="alert-item" key={alert}>
                {index === 0 ? <Zap size={16} aria-hidden="true" /> : <ShieldAlert size={16} aria-hidden="true" />}
                <span>{alert}</span>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  )
}

export default App
