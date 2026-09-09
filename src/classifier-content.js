export const classifierPairs = [
  { id: "person", classifier: "个", pinyin: "gè", noun: "pessoa", nounPinyin: "rén", phrase: "一个人", audioSrc: "./assets/audio/classifiers/phrase-person.mp3" },
  { id: "book", classifier: "本", pinyin: "běn", noun: "livro", nounPinyin: "shū", phrase: "一本书", audioSrc: "./assets/audio/classifiers/phrase-book.mp3" },
  { id: "ticket", classifier: "张", pinyin: "zhāng", noun: "ingresso", nounPinyin: "piào", phrase: "一张票", audioSrc: "./assets/audio/classifiers/phrase-ticket.mp3" },
  { id: "tea", classifier: "杯", pinyin: "bēi", noun: "chá", nounPinyin: "chá", phrase: "一杯茶", audioSrc: "./assets/audio/classifiers/phrase-tea.mp3" },
  { id: "cat", classifier: "只", pinyin: "zhī", noun: "gato", nounPinyin: "māo", phrase: "一只猫", audioSrc: "./assets/audio/classifiers/phrase-cat.mp3" },
  { id: "car", classifier: "辆", pinyin: "liàng", noun: "carro", nounPinyin: "chē", phrase: "一辆车", audioSrc: "./assets/audio/classifiers/phrase-car.mp3" },
  { id: "clothes", classifier: "件", pinyin: "jiàn", noun: "roupa", nounPinyin: "yīfu", phrase: "一件衣服", audioSrc: "./assets/audio/classifiers/phrase-clothes.mp3" },
  { id: "bottle", classifier: "瓶", pinyin: "píng", noun: "garrafa", nounPinyin: "shuǐ", phrase: "一瓶水", audioSrc: "./assets/audio/classifiers/phrase-bottle.mp3" },
  { id: "shoes", classifier: "双", pinyin: "shuāng", noun: "sapatos", nounPinyin: "xié", phrase: "一双鞋", audioSrc: "./assets/audio/classifiers/phrase-shoes.mp3" },
  { id: "fish", classifier: "条", pinyin: "tiáo", noun: "peixe", nounPinyin: "yú", phrase: "一条鱼", audioSrc: "./assets/audio/classifiers/phrase-fish.mp3" },
  { id: "teacher", classifier: "位", pinyin: "wèi", noun: "professor", nounPinyin: "lǎoshī", phrase: "一位老师", audioSrc: "./assets/audio/classifiers/phrase-teacher.mp3" },
  { id: "restaurant", classifier: "家", pinyin: "jiā", noun: "restaurante", nounPinyin: "cāntīng", phrase: "一家餐厅", audioSrc: "./assets/audio/classifiers/phrase-restaurant.mp3" },
  { id: "room", classifier: "间", pinyin: "jiān", noun: "quarto", nounPinyin: "fángjiān", phrase: "一间房间", audioSrc: "./assets/audio/classifiers/phrase-room.mp3" },
  { id: "computer", classifier: "台", pinyin: "tái", noun: "computador", nounPinyin: "diànnǎo", phrase: "一台电脑", audioSrc: "./assets/audio/classifiers/phrase-computer.mp3" },
  { id: "movie", classifier: "部", pinyin: "bù", noun: "filme", nounPinyin: "diànyǐng", phrase: "一部电影", audioSrc: "./assets/audio/classifiers/phrase-movie.mp3" },
  { id: "umbrella", classifier: "把", pinyin: "bǎ", noun: "guarda-chuva", nounPinyin: "yǔsǎn", phrase: "一把雨伞", audioSrc: "./assets/audio/classifiers/phrase-umbrella.mp3" },
  { id: "pen", classifier: "支", pinyin: "zhī", noun: "caneta", nounPinyin: "bǐ", phrase: "一支笔", audioSrc: "./assets/audio/classifiers/phrase-pen.mp3" },
  { id: "letter", classifier: "封", pinyin: "fēng", noun: "carta", nounPinyin: "xìn", phrase: "一封信", audioSrc: "./assets/audio/classifiers/phrase-letter.mp3" },
  { id: "menu", classifier: "份", pinyin: "fèn", noun: "cardápio", nounPinyin: "càidān", phrase: "一份菜单", audioSrc: "./assets/audio/classifiers/phrase-menu.mp3" },
  { id: "course", classifier: "门", pinyin: "mén", noun: "disciplina", nounPinyin: "kè", phrase: "一门课", audioSrc: "./assets/audio/classifiers/phrase-course.mp3" },
];

export const classifierLessons = [
  { classifier: "个", pinyin: "gè", category: "Pessoas e uso geral", title: "O classificador coringa", usage: "Use com pessoas e muitos objetos quando não houver um classificador mais específico.", audioSrc: "./assets/audio/classifiers/phrase-person.mp3", examples: [["一个人", "yí ge rén", "uma pessoa"], ["三个苹果", "sān ge píngguǒ", "três maçãs"]] },
  { classifier: "位", pinyin: "wèi", category: "Pessoas e uso geral", title: "Pessoas com respeito", usage: "Use para professores, clientes, convidados e outras pessoas em contextos formais ou educados.", audioSrc: "./assets/audio/classifiers/phrase-teacher.mp3", examples: [["一位老师", "yí wèi lǎoshī", "um professor"], ["两位客人", "liǎng wèi kèrén", "dois convidados"]] },
  { classifier: "本", pinyin: "běn", category: "Papel e objetos", title: "Livros e publicações", usage: "Use com livros, cadernos, dicionários e revistas encadernadas.", audioSrc: "./assets/audio/classifiers/phrase-book.mp3", examples: [["一本书", "yì běn shū", "um livro"], ["两本词典", "liǎng běn cídiǎn", "dois dicionários"]] },
  { classifier: "张", pinyin: "zhāng", category: "Papel e objetos", title: "Objetos planos", usage: "Use com papel, ingressos, fotografias, mapas e outros objetos de superfície plana.", audioSrc: "./assets/audio/classifiers/phrase-ticket.mp3", examples: [["一张票", "yì zhāng piào", "um ingresso"], ["三张照片", "sān zhāng zhàopiàn", "três fotografias"]] },
  { classifier: "封", pinyin: "fēng", category: "Papel e objetos", title: "Cartas e correspondência", usage: "Use para contar cartas, e-mails em linguagem formal e correspondências fechadas.", audioSrc: "./assets/audio/classifiers/phrase-letter.mp3", examples: [["一封信", "yì fēng xìn", "uma carta"], ["两封邮件", "liǎng fēng yóujiàn", "dois e-mails"]] },
  { classifier: "件", pinyin: "jiàn", category: "Roupas e formato", title: "Roupas e acontecimentos", usage: "Use com peças de roupa e também com assuntos, presentes e acontecimentos.", audioSrc: "./assets/audio/classifiers/phrase-clothes.mp3", examples: [["一件衣服", "yí jiàn yīfu", "uma peça de roupa"], ["两件事", "liǎng jiàn shì", "dois assuntos"]] },
  { classifier: "双", pinyin: "shuāng", category: "Roupas e formato", title: "Objetos em pares", usage: "Use quando duas peças formam um par, como sapatos, meias, luvas e olhos.", audioSrc: "./assets/audio/classifiers/phrase-shoes.mp3", examples: [["一双鞋", "yì shuāng xié", "um par de sapatos"], ["两双筷子", "liǎng shuāng kuàizi", "dois pares de hashis"]] },
  { classifier: "条", pinyin: "tiáo", category: "Roupas e formato", title: "Coisas longas e flexíveis", usage: "Use com peixes, rios, ruas, calças e outros elementos compridos ou sinuosos.", audioSrc: "./assets/audio/classifiers/phrase-fish.mp3", examples: [["一条鱼", "yì tiáo yú", "um peixe"], ["两条裤子", "liǎng tiáo kùzi", "duas calças"]] },
  { classifier: "把", pinyin: "bǎ", category: "Roupas e formato", title: "Objetos com cabo", usage: "Use com objetos que seguramos por uma alça ou cabo, como guarda-chuvas, facas e cadeiras.", audioSrc: "./assets/audio/classifiers/phrase-umbrella.mp3", examples: [["一把雨伞", "yì bǎ yǔsǎn", "um guarda-chuva"], ["两把椅子", "liǎng bǎ yǐzi", "duas cadeiras"]] },
  { classifier: "支", pinyin: "zhī", category: "Roupas e formato", title: "Objetos finos e rígidos", usage: "Use com canetas, lápis, velas e outros objetos compridos semelhantes a uma haste.", audioSrc: "./assets/audio/classifiers/phrase-pen.mp3", examples: [["一支笔", "yì zhī bǐ", "uma caneta"], ["三支铅笔", "sān zhī qiānbǐ", "três lápis"]] },
  { classifier: "只", pinyin: "zhī", category: "Animais e veículos", title: "Animais", usage: "Use com muitos animais e também com uma unidade de algo que normalmente forma um par.", audioSrc: "./assets/audio/classifiers/phrase-cat.mp3", examples: [["一只猫", "yì zhī māo", "um gato"], ["两只鸟", "liǎng zhī niǎo", "dois pássaros"]] },
  { classifier: "辆", pinyin: "liàng", category: "Animais e veículos", title: "Veículos com rodas", usage: "Use com carros, ônibus, bicicletas e outros veículos terrestres com rodas.", audioSrc: "./assets/audio/classifiers/phrase-car.mp3", examples: [["一辆车", "yí liàng chē", "um carro"], ["两辆自行车", "liǎng liàng zìxíngchē", "duas bicicletas"]] },
  { classifier: "杯", pinyin: "bēi", category: "Comida e recipientes", title: "Copos e xícaras", usage: "Use para a quantidade de bebida servida em um copo ou uma xícara.", audioSrc: "./assets/audio/classifiers/phrase-tea.mp3", examples: [["一杯茶", "yì bēi chá", "uma xícara de chá"], ["两杯咖啡", "liǎng bēi kāfēi", "duas xícaras de café"]] },
  { classifier: "瓶", pinyin: "píng", category: "Comida e recipientes", title: "Garrafas", usage: "Use para líquidos e produtos contidos em uma garrafa ou frasco.", audioSrc: "./assets/audio/classifiers/phrase-bottle.mp3", examples: [["一瓶水", "yì píng shuǐ", "uma garrafa de água"], ["三瓶牛奶", "sān píng niúnǎi", "três garrafas de leite"]] },
  { classifier: "份", pinyin: "fèn", category: "Comida e recipientes", title: "Porções e documentos", usage: "Use com porções de comida, cardápios, documentos, exemplares e empregos.", audioSrc: "./assets/audio/classifiers/phrase-menu.mp3", examples: [["一份菜单", "yí fèn càidān", "um cardápio"], ["两份工作", "liǎng fèn gōngzuò", "dois empregos"]] },
  { classifier: "家", pinyin: "jiā", category: "Lugares e máquinas", title: "Empresas e estabelecimentos", usage: "Use com restaurantes, lojas, empresas, hospitais e outros estabelecimentos.", audioSrc: "./assets/audio/classifiers/phrase-restaurant.mp3", examples: [["一家餐厅", "yì jiā cāntīng", "um restaurante"], ["两家公司", "liǎng jiā gōngsī", "duas empresas"]] },
  { classifier: "间", pinyin: "jiān", category: "Lugares e máquinas", title: "Cômodos", usage: "Use com quartos, salas, escritórios e outros espaços internos delimitados.", audioSrc: "./assets/audio/classifiers/phrase-room.mp3", examples: [["一间房间", "yì jiān fángjiān", "um quarto"], ["三间教室", "sān jiān jiàoshì", "três salas de aula"]] },
  { classifier: "台", pinyin: "tái", category: "Lugares e máquinas", title: "Máquinas e aparelhos", usage: "Use com computadores, televisores, máquinas e certos equipamentos eletrônicos.", audioSrc: "./assets/audio/classifiers/phrase-computer.mp3", examples: [["一台电脑", "yì tái diànnǎo", "um computador"], ["两台电视", "liǎng tái diànshì", "duas televisões"]] },
  { classifier: "部", pinyin: "bù", category: "Estudo e cultura", title: "Filmes e obras", usage: "Use com filmes, romances e algumas obras completas.", audioSrc: "./assets/audio/classifiers/phrase-movie.mp3", examples: [["一部电影", "yí bù diànyǐng", "um filme"], ["两部小说", "liǎng bù xiǎoshuō", "dois romances"]] },
  { classifier: "门", pinyin: "mén", category: "Estudo e cultura", title: "Disciplinas e cursos", usage: "Use para contar matérias escolares, disciplinas acadêmicas e cursos.", audioSrc: "./assets/audio/classifiers/phrase-course.mp3", examples: [["一门课", "yì mén kè", "uma disciplina"], ["三门外语", "sān mén wàiyǔ", "três línguas estrangeiras"]] },
];

export const fillGameQuestions = [
  { sentence: "我买了 ___ 书。", pinyin: "Wǒ mǎi le ___ shū.", answer: "本", options: ["本", "张", "份", "部"], translation: "Eu comprei um livro.", audioSrc: "./assets/audio/classifiers/sentence-buy-book.mp3" },
  { sentence: "请给我 ___ 茶。", pinyin: "Qǐng gěi wǒ ___ chá.", answer: "杯", options: ["只", "杯", "瓶", "份"], translation: "Por favor, me dê uma xícara de chá.", audioSrc: "./assets/audio/classifiers/sentence-give-tea.mp3" },
  { sentence: "我有 ___ 票。", pinyin: "Wǒ yǒu ___ piào.", answer: "张", options: ["个", "张", "本", "封"], translation: "Eu tenho um ingresso.", audioSrc: "./assets/audio/classifiers/sentence-have-ticket.mp3" },
  { sentence: "那是 ___ 猫。", pinyin: "Nà shì ___ māo.", answer: "只", options: ["辆", "只", "条", "位"], translation: "Aquele é um gato.", audioSrc: "./assets/audio/classifiers/sentence-that-cat.mp3" },
  { sentence: "我家有 ___ 车。", pinyin: "Wǒ jiā yǒu ___ chē.", answer: "辆", options: ["辆", "台", "张", "家"], translation: "Minha família tem um carro.", audioSrc: "./assets/audio/classifiers/sentence-family-car.mp3" },
  { sentence: "她穿了 ___ 衣服。", pinyin: "Tā chuān le ___ yīfu.", answer: "件", options: ["件", "条", "双", "份"], translation: "Ela vestiu uma peça de roupa.", audioSrc: "./assets/audio/classifiers/sentence-wear-clothes.mp3" },
  { sentence: "请给我 ___ 水。", pinyin: "Qǐng gěi wǒ ___ shuǐ.", answer: "瓶", options: ["本", "瓶", "杯", "只"], translation: "Por favor, me dê uma garrafa de água.", audioSrc: "./assets/audio/classifiers/sentence-give-water.mp3" },
  { sentence: "我买了 ___ 鞋。", pinyin: "Wǒ mǎi le ___ xié.", answer: "双", options: ["张", "双", "辆", "件"], translation: "Eu comprei um par de sapatos.", audioSrc: "./assets/audio/classifiers/sentence-buy-shoes.mp3" },
  { sentence: "河里有 ___ 鱼。", pinyin: "Hé lǐ yǒu ___ yú.", answer: "条", options: ["条", "杯", "个", "只"], translation: "Há um peixe no rio.", audioSrc: "./assets/audio/classifiers/sentence-river-fish.mp3" },
  { sentence: "王老师是 ___ 好老师。", pinyin: "Wáng lǎoshī shì ___ hǎo lǎoshī.", answer: "位", options: ["位", "家", "门", "台"], translation: "O professor Wang é um bom professor.", audioSrc: "./assets/audio/classifiers/sentence-teacher-wang.mp3" },
  { sentence: "学校旁边有 ___ 餐厅。", pinyin: "Xuéxiào pángbiān yǒu ___ cāntīng.", answer: "家", options: ["家", "间", "位", "份"], translation: "Há um restaurante ao lado da escola.", audioSrc: "./assets/audio/classifiers/sentence-school-restaurant.mp3" },
  { sentence: "酒店里有 ___ 安静的房间。", pinyin: "Jiǔdiàn lǐ yǒu ___ ānjìng de fángjiān.", answer: "间", options: ["间", "家", "门", "部"], translation: "Há um quarto tranquilo no hotel.", audioSrc: "./assets/audio/classifiers/sentence-hotel-room.mp3" },
  { sentence: "桌上有 ___ 电脑。", pinyin: "Zhuō shàng yǒu ___ diànnǎo.", answer: "台", options: ["台", "部", "张", "把"], translation: "Há um computador sobre a mesa.", audioSrc: "./assets/audio/classifiers/sentence-desk-computer.mp3" },
  { sentence: "我们看了 ___ 电影。", pinyin: "Wǒmen kàn le ___ diànyǐng.", answer: "部", options: ["部", "本", "门", "台"], translation: "Nós assistimos a um filme.", audioSrc: "./assets/audio/classifiers/sentence-watch-movie.mp3" },
  { sentence: "门口有 ___ 雨伞。", pinyin: "Ménkǒu yǒu ___ yǔsǎn.", answer: "把", options: ["把", "支", "件", "条"], translation: "Há um guarda-chuva perto da porta.", audioSrc: "./assets/audio/classifiers/sentence-door-umbrella.mp3" },
  { sentence: "请给我 ___ 笔。", pinyin: "Qǐng gěi wǒ ___ bǐ.", answer: "支", options: ["支", "把", "条", "封"], translation: "Por favor, me dê uma caneta.", audioSrc: "./assets/audio/classifiers/sentence-give-pen.mp3" },
  { sentence: "昨天我收到 ___ 信。", pinyin: "Zuótiān wǒ shōudào ___ xìn.", answer: "封", options: ["封", "份", "本", "张"], translation: "Ontem eu recebi uma carta.", audioSrc: "./assets/audio/classifiers/sentence-receive-letter.mp3" },
  { sentence: "请给我 ___ 菜单。", pinyin: "Qǐng gěi wǒ ___ càidān.", answer: "份", options: ["份", "封", "本", "杯"], translation: "Por favor, me dê um cardápio.", audioSrc: "./assets/audio/classifiers/sentence-give-menu.mp3" },
  { sentence: "今天我有 ___ 汉语课。", pinyin: "Jīntiān wǒ yǒu ___ Hànyǔ kè.", answer: "门", options: ["门", "间", "位", "家"], translation: "Hoje eu tenho uma disciplina de chinês.", audioSrc: "./assets/audio/classifiers/sentence-chinese-course.mp3" },
  { sentence: "桌上有两 ___ 报纸。", pinyin: "Zhuō shàng yǒu liǎng ___ bàozhǐ.", answer: "张", options: ["张", "本", "封", "份"], translation: "Há dois jornais sobre a mesa.", audioSrc: "./assets/audio/classifiers/sentence-two-newspapers.mp3" },
  { sentence: "他有三 ___ 中文书。", pinyin: "Tā yǒu sān ___ Zhōngwén shū.", answer: "本", options: ["本", "门", "份", "部"], translation: "Ele tem três livros em chinês.", audioSrc: "./assets/audio/classifiers/sentence-three-books.mp3" },
  { sentence: "她点了两 ___ 咖啡。", pinyin: "Tā diǎn le liǎng ___ kāfēi.", answer: "杯", options: ["杯", "瓶", "份", "双"], translation: "Ela pediu duas xícaras de café.", audioSrc: "./assets/audio/classifiers/sentence-two-coffees.mp3" },
  { sentence: "停车场有五 ___ 车。", pinyin: "Tíngchēchǎng yǒu wǔ ___ chē.", answer: "辆", options: ["辆", "台", "家", "间"], translation: "Há cinco carros no estacionamento.", audioSrc: "./assets/audio/classifiers/sentence-five-cars.mp3" },
  { sentence: "我找到了一 ___ 新工作。", pinyin: "Wǒ zhǎodào le yí ___ xīn gōngzuò.", answer: "份", options: ["份", "件", "门", "封"], translation: "Eu encontrei um novo emprego.", audioSrc: "./assets/audio/classifiers/sentence-new-job.mp3" },
];

export const quickGameQuestions = classifierPairs.map((pair, index) => {
  const distractors = classifierPairs
    .filter((candidate) => candidate.classifier !== pair.classifier)
    .slice((index * 3) % 16)
    .concat(classifierPairs)
    .filter((candidate, position, list) => list.findIndex((item) => item.classifier === candidate.classifier) === position)
    .slice(0, 3)
    .map((candidate) => candidate.classifier);
  const options = [pair.classifier, ...distractors].sort((a, b) => classifierPairs.findIndex((item) => item.classifier === a) - classifierPairs.findIndex((item) => item.classifier === b));
  const hanzi = pair.phrase.replace(/^一./, "");
  return { noun: pair.noun, hanzi, pinyin: pair.nounPinyin, answer: pair.classifier, options, audioSrc: pair.audioSrc };
});

export const orderGameQuestions = [
  { prompt: "Eu tenho um livro.", answer: "我有一本书。", tokens: ["我", "有", "一", "本", "书", "。"], audioSrc: "./assets/audio/classifiers/sentence-have-book.mp3" },
  { prompt: "Ela comprou uma garrafa de água.", answer: "她买了一瓶水。", tokens: ["她", "买了", "一", "瓶", "水", "。"], audioSrc: "./assets/audio/classifiers/sentence-she-bottle.mp3" },
  { prompt: "Aquele é um gato.", answer: "那是一只猫。", tokens: ["那", "是", "一", "只", "猫", "。"], audioSrc: "./assets/audio/classifiers/sentence-that-cat.mp3" },
  { prompt: "Eu quero uma xícara de chá.", answer: "我要一杯茶。", tokens: ["我", "要", "一", "杯", "茶", "。"], audioSrc: "./assets/audio/classifiers/sentence-want-tea.mp3" },
  { prompt: "Ela usa um par de sapatos.", answer: "她穿一双鞋。", tokens: ["她", "穿", "一", "双", "鞋", "。"], audioSrc: "./assets/audio/classifiers/sentence-wear-shoes.mp3" },
  { prompt: "Há um peixe no rio.", answer: "河里有一条鱼。", tokens: ["河里", "有", "一", "条", "鱼", "。"], audioSrc: "./assets/audio/classifiers/sentence-river-fish.mp3" },
  { prompt: "Aquele professor ensina chinês.", answer: "那位老师教汉语。", tokens: ["那", "位", "老师", "教", "汉语", "。"], audioSrc: "./assets/audio/classifiers/sentence-teacher-chinese.mp3" },
  { prompt: "Este restaurante é muito bom.", answer: "这家餐厅很好。", tokens: ["这", "家", "餐厅", "很", "好", "。"], audioSrc: "./assets/audio/classifiers/sentence-restaurant-good.mp3" },
  { prompt: "Há um computador no quarto.", answer: "房间里有一台电脑。", tokens: ["房间里", "有", "一", "台", "电脑", "。"], audioSrc: "./assets/audio/classifiers/sentence-room-computer.mp3" },
  { prompt: "Ontem eu assisti a um filme.", answer: "我昨天看了一部电影。", tokens: ["我", "昨天", "看了", "一", "部", "电影", "。"], audioSrc: "./assets/audio/classifiers/sentence-yesterday-movie.mp3" },
  { prompt: "Há um guarda-chuva perto da porta.", answer: "门口有一把雨伞。", tokens: ["门口", "有", "一", "把", "雨伞", "。"], audioSrc: "./assets/audio/classifiers/sentence-door-umbrella.mp3" },
  { prompt: "Há três canetas sobre a mesa.", answer: "桌上有三支笔。", tokens: ["桌上", "有", "三", "支", "笔", "。"], audioSrc: "./assets/audio/classifiers/sentence-three-pens.mp3" },
  { prompt: "Ela recebeu uma carta.", answer: "她收到了一封信。", tokens: ["她", "收到", "了", "一", "封", "信", "。"], audioSrc: "./assets/audio/classifiers/sentence-she-letter.mp3" },
  { prompt: "Por favor, me dê um cardápio.", answer: "请给我一份菜单。", tokens: ["请", "给", "我", "一", "份", "菜单", "。"], audioSrc: "./assets/audio/classifiers/sentence-give-menu.mp3" },
  { prompt: "Hoje eu tenho duas disciplinas.", answer: "我今天有两门课。", tokens: ["我", "今天", "有", "两", "门", "课", "。"], audioSrc: "./assets/audio/classifiers/sentence-two-courses.mp3" },
];

export const translateGameQuestions = [
  { prompt: "Eu comprei um livro.", answer: "我买了一本书。", options: ["我买了一本书。", "我买了一张票。", "我喝了一杯茶。", "我有一辆车。"], audioSrc: "./assets/audio/classifiers/sentence-buy-book.mp3" },
  { prompt: "Por favor, me dê uma xícara de chá.", answer: "请给我一杯茶。", options: ["请给我一瓶水。", "请给我一本书。", "请给我一杯茶。", "请给我一张票。"], audioSrc: "./assets/audio/classifiers/sentence-give-tea.mp3" },
  { prompt: "Minha família tem um carro.", answer: "我家有一辆车。", options: ["我家有一只猫。", "我家有一辆车。", "我家有一条鱼。", "我家有一台电脑。"], audioSrc: "./assets/audio/classifiers/sentence-family-car.mp3" },
  { prompt: "Ela vestiu uma peça de roupa.", answer: "她穿了一件衣服。", options: ["她穿了一件衣服。", "她买了一双鞋。", "她喝了一瓶水。", "她收到了一封信。"], audioSrc: "./assets/audio/classifiers/sentence-wear-clothes.mp3" },
  { prompt: "Eu tenho um ingresso.", answer: "我有一张票。", options: ["我有一张票。", "我有一本书。", "我有一个朋友。", "我有一门课。"], audioSrc: "./assets/audio/classifiers/sentence-have-ticket.mp3" },
  { prompt: "Há um peixe no rio.", answer: "河里有一条鱼。", options: ["河里有一条鱼。", "河里有一只猫。", "河里有一杯茶。", "河里有一瓶水。"], audioSrc: "./assets/audio/classifiers/sentence-river-fish.mp3" },
  { prompt: "Aquele professor ensina chinês.", answer: "那位老师教汉语。", options: ["那位老师教汉语。", "那家餐厅卖咖啡。", "那台电脑很新。", "那门课很难。"], audioSrc: "./assets/audio/classifiers/sentence-teacher-chinese.mp3" },
  { prompt: "Este restaurante é muito bom.", answer: "这家餐厅很好。", options: ["这家餐厅很好。", "这间房间很大。", "这部电影很好。", "这份菜单很好。"], audioSrc: "./assets/audio/classifiers/sentence-restaurant-good.mp3" },
  { prompt: "Há um computador no quarto.", answer: "房间里有一台电脑。", options: ["房间里有一台电脑。", "房间里有一部电影。", "房间里有一把雨伞。", "房间里有一辆车。"], audioSrc: "./assets/audio/classifiers/sentence-room-computer.mp3" },
  { prompt: "Ontem eu assisti a um filme.", answer: "我昨天看了一部电影。", options: ["我昨天看了一部电影。", "我昨天买了一本书。", "我昨天收到了一封信。", "我昨天上了一门课。"], audioSrc: "./assets/audio/classifiers/sentence-yesterday-movie.mp3" },
  { prompt: "Há um guarda-chuva perto da porta.", answer: "门口有一把雨伞。", options: ["门口有一把雨伞。", "门口有一支笔。", "门口有一台电脑。", "门口有一件衣服。"], audioSrc: "./assets/audio/classifiers/sentence-door-umbrella.mp3" },
  { prompt: "Há três canetas sobre a mesa.", answer: "桌上有三支笔。", options: ["桌上有三支笔。", "桌上有三封信。", "桌上有三把雨伞。", "桌上有三门课。"], audioSrc: "./assets/audio/classifiers/sentence-three-pens.mp3" },
  { prompt: "Ela recebeu uma carta.", answer: "她收到了一封信。", options: ["她收到了一封信。", "她找到了一份工作。", "她买了一支笔。", "她看了一部电影。"], audioSrc: "./assets/audio/classifiers/sentence-she-letter.mp3" },
  { prompt: "Por favor, me dê um cardápio.", answer: "请给我一份菜单。", options: ["请给我一份菜单。", "请给我一封信。", "请给我一门课。", "请给我一台电脑。"], audioSrc: "./assets/audio/classifiers/sentence-give-menu.mp3" },
  { prompt: "Hoje eu tenho duas disciplinas.", answer: "我今天有两门课。", options: ["我今天有两门课。", "我今天有两间房。", "我今天有两台电脑。", "我今天有两位老师。"], audioSrc: "./assets/audio/classifiers/sentence-two-courses.mp3" },
];

export const truthGameQuestions = [
  { sentence: "一本书", translation: "um livro", answer: true, explanation: "本 é usado com livros.", audioSrc: "./assets/audio/classifiers/phrase-book.mp3" },
  { sentence: "一杯车", translation: "um carro", answer: false, explanation: "Carro usa 辆: 一辆车.", audioSrc: "./assets/audio/classifiers/trap-cup-car.mp3" },
  { sentence: "一双鞋", translation: "um par de sapatos", answer: true, explanation: "双 indica um par.", audioSrc: "./assets/audio/classifiers/phrase-shoes.mp3" },
  { sentence: "一只猫", translation: "um gato", answer: true, explanation: "只 é usado com muitos animais.", audioSrc: "./assets/audio/classifiers/phrase-cat.mp3" },
  { sentence: "一张茶", translation: "uma xícara de chá", answer: false, explanation: "Chá usa 杯: 一杯茶.", audioSrc: "./assets/audio/classifiers/trap-sheet-tea.mp3" },
  { sentence: "一瓶水", translation: "uma garrafa de água", answer: true, explanation: "瓶 indica uma garrafa.", audioSrc: "./assets/audio/classifiers/phrase-bottle.mp3" },
  { sentence: "一条鱼", translation: "um peixe", answer: true, explanation: "条 é usado com peixes e coisas compridas.", audioSrc: "./assets/audio/classifiers/phrase-fish.mp3" },
  { sentence: "一本车", translation: "um carro", answer: false, explanation: "Livro usa 本; carro usa 辆.", audioSrc: "./assets/audio/classifiers/trap-book-car.mp3" },
  { sentence: "一位老师", translation: "um professor, de forma respeitosa", answer: true, explanation: "位 é o classificador polido para pessoas.", audioSrc: "./assets/audio/classifiers/phrase-teacher.mp3" },
  { sentence: "一间电脑", translation: "um computador", answer: false, explanation: "Computador usa 台: 一台电脑.", audioSrc: "./assets/audio/classifiers/trap-room-computer.mp3" },
  { sentence: "一家餐厅", translation: "um restaurante", answer: true, explanation: "家 é usado com estabelecimentos e empresas.", audioSrc: "./assets/audio/classifiers/phrase-restaurant.mp3" },
  { sentence: "一部老师", translation: "um professor", answer: false, explanation: "Professor usa 位 ou 个; 部 é usado com filmes e obras.", audioSrc: "./assets/audio/classifiers/trap-movie-teacher.mp3" },
  { sentence: "一台电脑", translation: "um computador", answer: true, explanation: "台 é usado com máquinas e aparelhos.", audioSrc: "./assets/audio/classifiers/phrase-computer.mp3" },
  { sentence: "一把电影", translation: "um filme", answer: false, explanation: "Filme usa 部: 一部电影.", audioSrc: "./assets/audio/classifiers/trap-handle-movie.mp3" },
  { sentence: "一封信", translation: "uma carta", answer: true, explanation: "封 é usado com cartas e correspondências.", audioSrc: "./assets/audio/classifiers/phrase-letter.mp3" },
  { sentence: "一支房间", translation: "um quarto", answer: false, explanation: "Quarto usa 间: 一间房间.", audioSrc: "./assets/audio/classifiers/trap-pen-room.mp3" },
  { sentence: "一门课", translation: "uma disciplina", answer: true, explanation: "门 é usado com disciplinas e cursos.", audioSrc: "./assets/audio/classifiers/phrase-course.mp3" },
  { sentence: "一份雨伞", translation: "um guarda-chuva", answer: false, explanation: "Guarda-chuva usa 把: 一把雨伞.", audioSrc: "./assets/audio/classifiers/trap-portion-umbrella.mp3" },
  { sentence: "一台餐厅", translation: "um restaurante", answer: false, explanation: "Restaurante usa 家: 一家餐厅.", audioSrc: "./assets/audio/classifiers/trap-machine-restaurant.mp3" },
  { sentence: "一位菜单", translation: "um cardápio", answer: false, explanation: "Cardápio usa 份: 一份菜单.", audioSrc: "./assets/audio/classifiers/trap-person-menu.mp3" },
];
