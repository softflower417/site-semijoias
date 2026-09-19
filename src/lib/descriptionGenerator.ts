interface ProductData {
  name: string;
  category: string;
  material?: string;
  plating?: string;
  measurements?: string;
  warranty?: string;
  price?: string;
  is_on_sale?: boolean;
  sale_price?: string;
}

// Função para extrair características do nome do produto
function extractNameFeatures(name: string): {
  shape?: string;
  format?: string;
  detail?: string;
  finish?: string;
  size?: string;
  religious?: boolean;
} {
  const lowerName = name.toLowerCase();
  
  const features: ReturnType<typeof extractNameFeatures> = {};
  
  // Detectar formatos
  if (lowerName.includes('liso')) features.format = 'liso';
  else if (lowerName.includes('detalhado') || lowerName.includes('detalhada')) features.format = 'detalhado';
  else if (lowerName.includes('cravejado') || lowerName.includes('cravejad')) features.format = 'cravejado';
  else if (lowerName.includes('entrelaçado') || lowerName.includes('entrelaç')) features.format = 'entrelaçado';
  else if (lowerName.includes('torcido') || lowerName.includes('torcid')) features.format = 'torcido';
  else if (lowerName.includes('solitário') || lowerName.includes('solitari')) features.format = 'solitário';
  
  // Detectar formas
  if (lowerName.includes('redondo') || lowerName.includes('redond')) features.shape = 'redondo';
  else if (lowerName.includes('oval')) features.shape = 'oval';
  else if (lowerName.includes('quadrado')) features.shape = 'quadrado';
  else if (lowerName.includes('gota')) features.shape = 'gota';
  else if (lowerName.includes('argola')) features.shape = 'argola';
  else if (lowerName.includes('meia argola')) features.shape = 'meia argola';
  else if (lowerName.includes('coração') || lowerName.includes('coraç')) features.shape = 'coração';
  else if (lowerName.includes('x ')) features.shape = 'x';
  else if (lowerName.includes('bola') || lowerName.includes('bolas')) features.shape = 'bolas';
  else if (lowerName.includes('bolinha') || lowerName.includes('bolinhas')) features.shape = 'bolinhas';
  else if (lowerName.includes('chapa') || lowerName.includes('chapas')) features.shape = 'chapas';
  else if (lowerName.includes('pérola') || lowerName.includes('pérolas')) features.shape = 'pérolas';
  else if (lowerName.includes('elo português') || lowerName.includes('elo portugues')) features.shape = 'elo português';
  else if (lowerName.includes('cordão baiano') || lowerName.includes('cordao baiano')) features.shape = 'cordão baiano';
  else if (lowerName.includes('malha roliça') || lowerName.includes('malha rolica')) features.shape = 'malha roliça';
  else if (lowerName.includes('escapulário') || lowerName.includes('escapulari')) features.shape = 'escapulário';
  else if (lowerName.includes('fita')) features.shape = 'fita';
  
  // Detectar detalhes
  if (lowerName.includes('zircônia') || lowerName.includes('zirconia') || lowerName.includes('zirc')) features.detail = 'zircônia';
  else if (lowerName.includes('micro zircônia') || lowerName.includes('micro zirconia')) features.detail = 'micro zircônia';
  else if (lowerName.includes('cristal') || lowerName.includes('cristais')) features.detail = 'cristal';
  else if (lowerName.includes('quartzo rosa') || lowerName.includes('quartzo')) features.detail = 'quartzo rosa';
  else if (lowerName.includes('bolinha') && !features.shape) features.detail = 'bolinha';
  else if (lowerName.includes('tubo')) features.detail = 'tubo';
  else if (lowerName.includes('ponto de luz') || lowerName.includes('ponto luz')) features.detail = 'ponto de luz';
  else if (lowerName.includes('regulável') || lowerName.includes('regulavel')) features.detail = 'regulável';
  else if (lowerName.includes('medalhada') || lowerName.includes('medalhad')) features.detail = 'medalhada';
  else if (lowerName.includes('espírito santo') || lowerName.includes('espirito santo')) features.detail = 'espírito santo';
  
  // Detectar acabamentos
  if (lowerName.includes('dourado') || lowerName.includes('dourad')) features.finish = 'dourado';
  else if (lowerName.includes('branco')) features.finish = 'branco';
  else if (lowerName.includes('ródio') || lowerName.includes('rodio') || lowerName.includes('ród')) features.finish = 'ródio';
  else if (lowerName.includes('rosa')) features.finish = 'rosa';
  
  // Detectar tamanhos
  if (lowerName.includes('6mm')) features.size = '6mm';
  else if (lowerName.includes('8mm')) features.size = '8mm';
  else if (lowerName.includes('10mm')) features.size = '10mm';
  else if (lowerName.includes('4mm')) features.size = '4mm';
  else if (lowerName.includes('3mm')) features.size = '3mm';
  else if (lowerName.includes('35cm')) features.size = '35cm';
  else if (lowerName.includes('45cm')) features.size = '45cm';
  else if (lowerName.includes('50cm')) features.size = '50cm';
  else if (lowerName.includes('60cm')) features.size = '60cm';
  else if (lowerName.includes('fino') || lowerName.includes('fin')) features.size = 'fino';
  else if (lowerName.includes('grosso') || lowerName.includes('gross')) features.size = 'grosso';
  
  // Detectar religiosos
  if (lowerName.includes('nossa senhora') || lowerName.includes('nossa senhora da graça') || lowerName.includes('espírito santo')) {
    features.religious = true;
  }
  
  return features;
}

export type DescriptionStyle = 
  | "basico" 
  | "detalhado" 
  | "emocional" 
  | "vendas" 
  | "curto";

const templates = {
  Brincos: {
    basico: (data: ProductData) => {
      const features = extractNameFeatures(data.name);
      const finish = features.finish || 'elegante';
      const shape = features.shape || 'versátil';
      const format = features.format || 'sofisticado';
      
      return `${data.name} é a peça perfeita para elevar seu estilo com elegância. Este brinco ${shape} ${format} ${finish} foi desenhado para realçar sua beleza natural, adicionando um toque de charme a qualquer look.

Ideal para o dia a dia ou para ocasiões especiais, combina versatilidade com um design atemporal que nunca sai de moda. ${data.measurements ? `Com ${data.measurements}, oferece o ajuste perfeito para seu conforto.` : ''} Uma escolha essencial para quem valoriza qualidade e bom gosto.`;
    },
    
    detalhado: (data: ProductData) => {
      const features = extractNameFeatures(data.name);
      const finish = features.finish || 'elegante';
      const shape = features.shape || 'versátil';
      const format = features.format || 'sofisticado';
      const detail = features.detail;
      
      let detailText = '';
      if (detail === 'zircônia') detailText = 'Os zircônias cuidadosamente selecionados adicionam um brilho extra que captura a luz de forma magnética.';
      else if (detail === 'cristal') detailText = 'Os cristais incorporados ao design criam reflexos deslumbrantes que chamam a atenção.';
      else if (detail === 'ponto de luz') detailText = 'O design ponto de luz oferece brilho intenso e sofisticação discreta.';
      else if (detail === 'bolinha') detailText = 'As bolinhas delicadas adicionam um toque feminino e charmoso ao conjunto.';
      else if (detail === 'tubo') detailText = 'O formato tubo moderno confere contemporaneidade ao design clássico.';
      else if (detail === 'regulável') detailText = 'O sistema regulável permite o ajuste perfeito ao seu gosto e conforto.';
      
      return `Descubra a elegância transformadora do ${data.name}, um brinco ${shape} ${format} ${finish} que une design contemporâneo com acabamento impecável. Cada detalhe foi cuidadosamente pensado para criar uma peça que não apenas embeleza, mas também conta uma história de sofisticação.

${detailText} Este acessório versátil se adapta perfeitamente a diferentes estilos, do casual ao mais elegante. ${data.measurements ? `Com ${data.measurements},` : ''} foi projetado para oferecer conforto e segurança durante todo o dia. Seja para o trabalho, um jantar especial ou simplesmente para se sentir bem, este brinco será sua companheira ideal.

A beleza desta peça está em sua capacidade de transformar qualquer look simples em algo extraordinário, adicionando aquele toque final que faz toda a diferença. É aquele tipo de acessório que você vai querer usar todos os dias, pela forma como ele faz você se sentir confiante e elegante.`;
    },
    
    emocional: (data: ProductData) => {
      const features = extractNameFeatures(data.name);
      const finish = features.finish || 'especial';
      const shape = features.shape || 'único';
      
      return `${data.name} é mais que um acessório - é uma declaração de amor próprio e elegância. Este brinco ${shape} ${finish} foi criado para fazer você se sentir especial em cada momento, realçando sua beleza única e personalidade.

Cada curva e detalhe do design reflete um compromisso com a excelência e o bem-estar. ${data.measurements ? `Com ${data.measurements},` : ''} proporciona uma experiência confortável que permite que você brilhe sem esforço. É a peça perfeita para celebrar conquistas, marcar momentos especiais ou simplesmente para lembrar-se do quanto você é extraordinária.

Ao usar este brinco, você carrega consigo não apenas uma joia, mas uma atitude de confiança e graça. Deixe-se envolver por sua beleza e sinta o poder de se sentir bem na própria pele. Esta peça foi feita para você, que merece se sentir bonita e confiante em cada dia.`;
    },
    
    vendas: (data: ProductData) => {
      const features = extractNameFeatures(data.name);
      const finish = features.finish || 'elegante';
      const shape = features.shape || 'versátil';
      
      return `✨ Transforme seu look com o ${data.name} - o brinco ${shape} ${finish} que vai fazer você se sentir única!

Este acessório extraordinário combina design sofisticado com versatilidade incomparável. Perfeito para qualquer ocasião, do trabalho aos eventos mais especiais, ele eleva automaticamente seu estilo e confere um ar de elegância que não passa despercebido.

${data.measurements ? `Com ${data.measurements},` : ''} oferece o ajuste ideal para seu conforto e segurança. É uma daquelas peças essenciais que toda mulher deve ter em sua coleção - aquela que resolve qualquer look e sempre faz você se sentir confiante.

${data.is_on_sale ? `🔥 PROMOÇÃO ESPECIAL! De R$ ${data.price} por apenas R$ ${data.sale_price}!` : `Valor exclusivo: R$ ${data.price}.`} Adicione ao carrinho agora e descubra o poder de um acessório bem escolhido!`;
    },
    
    curto: (data: ProductData) => {
      const features = extractNameFeatures(data.name);
      const finish = features.finish || 'elegante';
      const shape = features.shape || 'versátil';
      
      return `${data.name}: elegância e sofisticação em um brinco ${shape} ${finish}. Design versátil que realça sua beleza natural e combina com qualquer ocasião. ${data.measurements ? `Com ${data.measurements} para o ajuste perfeito.` : ''} A peça essencial que sua coleção merece.`;
    }
  },
  
  Colares: {
    basico: (data: ProductData) => {
      const features = extractNameFeatures(data.name);
      const finish = features.finish || 'elegante';
      const shape = features.shape || 'versátil';
      const religious = features.religious;
      
      let religiousText = religious ? 'Este colar tem um significado especial, perfeito para expressar sua fé e devoção.' : '';
      
      return `${data.name} é a peça perfeita para adicionar um toque de elegância ao seu decote. Este colar ${shape} ${finish} complementa qualquer look, do casual ao mais sofisticado, com um design que nunca sai de moda.

${religiousText} Ideal para o dia a dia ou ocasiões especiais, este acessório foi criado para realçar sua beleza natural com simplicidade e charme. ${data.measurements ? `Com ${data.measurements},` : ''} oferece o comprimento ideal para se adaptar a diferentes estilos de roupa. Uma escolha essencial para quem gosta de se sentir bem e elegante sempre.`;
    },
    
    detalhado: (data: ProductData) => {
      const features = extractNameFeatures(data.name);
      const finish = features.finish || 'elegante';
      const shape = features.shape || 'versátil';
      const detail = features.detail;
      const religious = features.religious;
      
      let detailText = '';
      if (detail === 'zircônia') detailText = 'As zircônias estrategicamente posicionadas criam um efeito de brilho contínuo que encanta.';
      else if (detail === 'micro zircônia') detailText = 'As micro zircônias adicionam sofisticação discreta com um brilho elegante e duradouro.';
      else if (detail === 'cristal') detailText = 'Os cristais incorporados ao design criam reflexos deslumbrantes que capturam a luz de forma mágica.';
      else if (shape === 'bolinhas' || shape === 'bolas') detailText = 'O design de bolinhas oferece textura interessante e movimento suave ao colar.';
      else if (shape === 'pérolas') detailText = 'As pérolas naturais adicionam toque de classicismo e elegância atemporal.';
      
      let religiousText = religious ? 'Este colar religioso carrega consigo significado espiritual e simbolismo especial, perfeito para momentos de fé.' : '';
      
      return `Elevate seu estilo com o ${data.name}, um colar ${shape} ${finish} que combina design contemporâneo com acabamento impecável. Esta peça foi cuidadosamente elaborada para se tornar o ponto focal do seu look, adicionando sofisticação e elegância sem esforço.

${detailText} ${religiousText} A versatilidade deste acessório é impressionante - ele funciona perfeitamente com blusas decotadas, vestidos elegantes ou até mesmo sobre camisas mais casuais. ${data.measurements ? `Com ${data.measurements},` : ''} foi projetado para oferecer o equilíbrio perfeito entre discreto e impactante, permitindo que você brilhe sem exageros.

Seja para o escritório, um jantar romântico ou um evento especial, este colar será sua companheira ideal. É uma daquelas peças atemporais que você pode usar por anos e sempre receber elogios, graças ao seu design clássico e elegante.`;
    },
    
    emocional: (data: ProductData) => {
      const features = extractNameFeatures(data.name);
      const finish = features.finish || 'especial';
      const shape = features.shape || 'único';
      const religious = features.religious;
      
      let religiousText = religious ? 'Este colar tem um significado espiritual profundo, conectando você com sua fé e proteção.' : '';
      
      return `${data.name} é mais que um colar - é uma declaração de elegância e autoconfiança. Esta peça ${shape} ${finish} foi criada para fazer você se sentir especial em cada momento, realçando sua beleza única de forma sutil e poderosa.

${religiousText} Cada detalhe do design foi pensado para contar uma história de sofisticação e bom gosto. ${data.measurements ? `Com ${data.measurements},` : ''} este acessório se adapta perfeitamente ao seu estilo, seja você mais discreta ou ousada. É a peça perfeita para presentear a si mesma ou alguém especial, pois carrega consigo um significado de apreciação e valor.

Ao usar este colar, você não apenas embeleza seu visual, mas também eleva sua autoestima. É aquele tipo de acessório que faz você se sentir pronta para qualquer situação, confiante e radiante. Uma escolha que reflete seu bom gosto e sua valorização pessoal.`;
    },
    
    vendas: (data: ProductData) => {
      const features = extractNameFeatures(data.name);
      const finish = features.finish || 'elegante';
      const shape = features.shape || 'versátil';
      
      return `💎 ${data.name} - O toque de elegância que seu look merece!

Este colar ${shape} ${finish} extraordinário combina design sofisticado com versatilidade incomparável. Perfeito para qualquer ocasião, ele adiciona instantaneamente um ar de elegância ao seu visual, seja qual for seu estilo.

${data.measurements ? `Com ${data.measurements},` : ''} oferece o comprimento ideal para se adaptar a diferentes looks e decotes. É uma daquelas peças coringa que toda mulher precisa ter - elegante o suficiente para eventos especiais, versátil o suficiente para o dia a dia.

${data.is_on_sale ? `🎯 OFERTA IMPERDÍVEL! Antes R$ ${data.price}, agora R$ ${data.sale_price}!` : `Investimento em beleza: R$ ${data.price}.`} Compre agora e transforme seus looks!`;
    },
    
    curto: (data: ProductData) => {
      const features = extractNameFeatures(data.name);
      const finish = features.finish || 'elegante';
      const shape = features.shape || 'versátil';
      
      return `${data.name}: elegância atemporal em um colar ${shape} ${finish}. Design sofisticado que realça sua beleza natural e combina com qualquer look. ${data.measurements ? `Com ${data.measurements} para o ajuste perfeito.` : ''} A peça essencial para toda coleção.`;
    }
  },
  
  Pulseiras: {
    basico: (data: ProductData) => {
      const features = extractNameFeatures(data.name);
      const finish = features.finish || 'elegante';
      const shape = features.shape || 'versátil';
      
      return `${data.name} é a peça perfeita para adicionar um toque de charme ao seu pulso. Esta pulseira ${shape} ${finish} combina design moderno com versatilidade, complementando qualquer look com sofisticação.

Ideal para uso diário ou ocasiões especiais, este acessório foi criado para fazer você se sentir bem e confiante. ${data.measurements ? `Com ${data.measurements},` : ''} oferece o ajuste perfeito para seu conforto. Uma escolha excelente para quem valoriza estilo e qualidade.`;
    },
    
    detalhado: (data: ProductData) => {
      const features = extractNameFeatures(data.name);
      const finish = features.finish || 'elegante';
      const shape = features.shape || 'versátil';
      const detail = features.detail;
      
      let detailText = '';
      if (shape === 'elo português') detailText = 'O clássico elo português oferece durabilidade e elegância tradicional que nunca sai de moda.';
      else if (shape === 'bolinhas' || shape === 'bolas') detailText = 'O design de bolinhas adiciona textura interessante e movimento suave à pulseira.';
      else if (shape === 'chapas') detailText = 'As chapas cuidadosamente trabalhadas criam um visual sofisticado e contemporâneo.';
      else if (shape === 'cordão baiano') detailText = 'O cordão baiano tradicional oferece conforto excepcional e estilo autêntico brasileiro.';
      else if (shape === 'pérolas') detailText = 'As pérolas naturais adicionam toque de classicismo e elegância atemporal.';
      else if (detail === 'medalhada') detailText = 'A medalha central adiciona significado especial e ponto focal elegante ao design.';
      else if (detail === 'espírito santo') detailText = 'O símbolo do Espírito Santo traz proteção e significado espiritual à peça.';
      
      return `Adicione um toque de sofisticação ao seu pulso com o ${data.name}. Esta pulseira ${shape} ${finish} excepcional combina design contemporâneo com acabamento impecável, criando uma peça que é tanto elegante quanto versátil.

${detailText} O design inteligente deste acessório permite que ele seja usado sozinho como destaque, ou combinado com outras pulseiras para um look mais elaborado. ${data.measurements ? `Com ${data.measurements},` : ''} foi projetado para oferecer conforto durante todo o dia, permitindo que você se mova com liberdade e estilo.

Seja para o trabalho, um encontro casual ou um evento especial, esta pulseira será sua companheira ideal. É uma peça atemporal que você pode usar em diferentes situações, sempre recebendo elogios pelo seu bom gosto. A elegância está nos detalhes, e este acessório tem todos eles.`;
    },
    
    emocional: (data: ProductData) => {
      const features = extractNameFeatures(data.name);
      const finish = features.finish || 'especial';
      const shape = features.shape || 'única';
      
      return `${data.name} é mais que um acessório - é uma extensão da sua personalidade e estilo. Esta pulseira ${shape} ${finish} foi criada para fazer você se sentir única e confiante, adicionando um toque especial ao seu visual que reflete quem você é.

Cada elemento do design foi pensado para criar uma conexão emocional, transformando uma simples joia em algo significativo. ${data.measurements ? `Com ${data.measurements},` : ''} esta peça se adapta perfeitamente ao seu pulso, como se fosse feita sob medida para você. É a companheira perfeita para cada momento da sua vida.

Ao usar esta pulseira, você carrega consigo uma atitude de elegância e confiança. É aquele tipo de acessório que faz você se sentir pronta para conquistar o mundo, uma pulseira que conta sua história sem precisar dizer uma palavra. Uma escolha que reflete sua beleza interior e exterior.`;
    },
    
    vendas: (data: ProductData) => {
      const features = extractNameFeatures(data.name);
      const finish = features.finish || 'elegante';
      const shape = features.shape || 'versátil';
      
      return `⚡ ${data.name} - O toque de estilo que seu pulso merece!

Esta pulseira ${shape} ${finish} extraordinária combina design moderno com elegância atemporal. Perfeita para qualquer ocasião, ela adiciona instantaneamente sofisticação ao seu visual, seja qual for seu estilo pessoal.

${data.measurements ? `Com ${data.measurements},` : ''} oferece o ajuste ideal para seu conforto e segurança. Use-a sozinha para um look minimalista elegante ou combine com outras pulseiras para criar um visual mais ousado e personalizado - as possibilidades são infinitas!

${data.is_on_sale ? `🚀 SUPER PROMOÇÃO! De R$ ${data.price} por R$ ${data.sale_price}!` : `Valor especial: R$ ${data.price}.`} Garanta a sua agora e eleve seu estilo!`;
    },
    
    curto: (data: ProductData) => {
      const features = extractNameFeatures(data.name);
      const finish = features.finish || 'elegante';
      const shape = features.shape || 'versátil';
      
      return `${data.name}: charme e elegância no seu pulso. Design ${shape} ${finish} que combina com qualquer look, do casual ao sofisticado. ${data.measurements ? `Com ${data.measurements} para o ajuste perfeito.` : ''} A pulseira essencial para sua coleção.`;
    }
  },
  
  Braceletes: {
    basico: (data: ProductData) => {
      const features = extractNameFeatures(data.name);
      const finish = features.finish || 'moderno';
      
      return `${data.name} é a peça perfeita para expressar sua personalidade com estilo. Este bracelete ${finish} combina tendência atual com versatilidade, permitindo que você crie looks únicos e autênticos.

Ideal para quem gosta de estar na moda sem perder elegância, este acessório complementa qualquer visual com um toque contemporâneo. ${data.measurements ? `Com ${data.measurements},` : ''} oferece o ajuste perfeito para seu conforto. Uma escolha excelente para quem valoriza estilo e originalidade.`;
    },
    
    detalhado: (data: ProductData) => {
      const features = extractNameFeatures(data.name);
      const finish = features.finish || 'moderno';
      const format = features.format || 'sofisticado';
      
      return `Expressa seu estilo único com o ${data.name}, um bracelete ${finish} que combina as últimas tendências com um design atemporal. Esta peça excepcional foi criada para quem não segue modas, mas as define com elegância e confiança.

O design ${format} deste acessório é impressionante - ele funciona perfeitamente como destaque principal ou como complemento sofisticado de outros acessórios. ${data.measurements ? `Com ${data.measurements},` : ''} foi projetado para oferecer conforto e estilo, permitindo que você o use durante todo o dia sem preocupações.

Seja para expressar sua criatividade, adicionar um toque moderno ao visual corporativo ou simplesmente para se sentir bem, este bracelete será sua escolha ideal. É uma peça que conversa com diferentes estilos e personalidades, sempre mantendo sua elegância e sofisticação.`;
    },
    
    emocional: (data: ProductData) => {
      const features = extractNameFeatures(data.name);
      const finish = features.finish || 'especial';
      
      return `${data.name} é mais que um acessório - é uma declaração de quem você é. Este bracelete ${finish} foi criado para expressar sua personalidade única, adicionando ao seu visual um toque que é só seu, autêntico e especial.

Cada detalhe do design reflete uma compreensão profunda de estilo e identidade. ${data.measurements ? `Com ${data.measurements},` : ''} esta peça se adapta perfeitamente ao seu pulso, como se fosse uma extensão natural do seu estilo. É a companheira ideal para cada momento em que você quer se sentir autêntica e confiante.

Ao usar este bracelete, você conta sua história sem dizer uma palavra. É aquele tipo de acessório que as pessoas notam e perguntam "onde você comprou?", pois ele tem uma personalidade própria. Uma escolha que reflete sua coragem de ser você mesma e seu bom gosto incomparável.`;
    },
    
    vendas: (data: ProductData) => {
      const features = extractNameFeatures(data.name);
      const finish = features.finish || 'moderno';
      
      return `🌟 ${data.name} - O bracelete que define seu estilo!

Este bracelete ${finish} trendsetter combina design contemporâneo com elegância sofisticada. Perfeito para quem quer se destacar, ele adiciona instantaneamente personalidade ao seu visual de forma única e memorável.

${data.measurements ? `Com ${data.measurements},` : ''} oferece o ajuste ideal para seu conforto. Use-o para elevar um look casual ou adicionar um toque moderno a produções mais elaboradas - as possibilidades são infinitas!

${data.is_on_sale ? `💥 PREMIUM SALE! Era R$ ${data.price}, agora R$ ${data.sale_price}!` : `Valor exclusivo: R$ ${data.price}.`} Compre agora e destaque-se!`;
    },
    
    curto: (data: ProductData) => {
      const features = extractNameFeatures(data.name);
      const finish = features.finish || 'moderno';
      
      return `${data.name}: expressão e estilo no seu pulso. Design bracelete ${finish} que combina tendência com elegância atemporal. ${data.measurements ? `Com ${data.measurements} para o ajuste perfeito.` : ''} O bracelete para quem define seu próprio estilo.`;
    }
  },
  
  Anéis: {
    basico: (data: ProductData) => {
      const features = extractNameFeatures(data.name);
      const finish = features.finish || 'elegante';
      const shape = features.shape || 'versátil';
      
      return `${data.name} é a peça perfeita para adicionar elegância e sofisticação às suas mãos. Este anel ${shape} ${finish} combina design refinado com versatilidade, realçando sua beleza natural de forma sutil e impactante.

Ideal para uso diário ou ocasiões especiais, este acessório foi criado para fazer você se sentir bem e confiante. ${data.measurements ? `Com ${data.measurements},` : ''} oferece o ajuste perfeito para seu conforto. Uma escolha essencial para quem valoriza elegância e bom gosto.`;
    },
    
    detalhado: (data: ProductData) => {
      const features = extractNameFeatures(data.name);
      const finish = features.finish || 'elegante';
      const shape = features.shape || 'versátil';
      const detail = features.detail;
      
      let detailText = '';
      if (detail === 'zircônia') detailText = 'As zircônias cuidadosamente posicionadas criam um efeito de brilho contínuo que encanta.';
      else if (detail === 'micro zircônia') detailText = 'As micro zircônias adicionam sofisticação discreta com um brilho elegante e duradouro.';
      else if (detail === 'cristal') detailText = 'O cristal central adiciona ponto focal de brilho intenso e elegância clássica.';
      else if (shape === 'ponto de luz') detailText = 'O design ponto de luz oferece brilho máximo com sofisticação discreta.';
      else if (shape === 'gota') detailText = 'O formato gota adiciona toque romântico e feminino ao design.';
      else if (shape === 'coração') detailText = 'O formato coração simboliza amor e afeto, tornando a peça ainda mais especial.';
      else if (shape === 'x') detailText = 'O design inovador em formato X oferece contemporaneidade e estilo único.';
      else if (detail === 'regulável') detailText = 'O sistema regulável permite o ajuste perfeito a diferentes tamanhos de dedo.';
      
      return `Adicione um toque de elegância ao seu dedo com o ${data.name}. Este anel ${shape} ${finish} extraordinário combina design refinado com acabamento impecável, criando uma peça que é tanto bela quanto significativa.

${detailText} A beleza deste acessório está em sua capacidade de transformar o simples em extraordinário. Um gesto simples como acenar ou apoiar a mão se torna uma declaração de elegância. ${data.measurements ? `Com ${data.measurements},` : ''} foi projetado para oferecer conforto perfeito, permitindo que você o use durante todo o dia sem nem perceber que está lá.

Seja como símbolo de um momento especial, expressão de estilo pessoal ou simplesmente porque você merece, este anel será sua escolha ideal. É uma peça atemporal que pode ser usada sozinha como destaque ou combinada com outros anéis para um look mais elaborado.`;
    },
    
    emocional: (data: ProductData) => {
      const features = extractNameFeatures(data.name);
      const finish = features.finish || 'especial';
      const shape = features.shape || 'único';
      
      return `${data.name} é mais que uma joia - é uma promessa de elegância e significado. Este anel ${shape} ${finish} foi criado para tocar seu coração, seja como celebração de uma conquista, símbolo de um compromisso ou simplesmente porque você merece se sentir especial.

Cada curva e detalhe do design foi pensado para criar uma conexão emocional profunda. ${data.measurements ? `Com ${data.measurements},` : ''} esta peça se adapta perfeitamente ao seu dedo, como se fosse feita exclusivamente para você. É a companheira perfeita para cada momento em que você quer se sentir amada, valorizada e elegante.

Ao usar este anel, você carrega consigo uma história, um sentimento, uma memória. É aquele tipo de acessório que as pessoas notam e perguntam sobre, pois ele tem uma presença especial. Uma escolha que reflete sua capacidade de amar e ser amada, sua beleza interior e exterior.`;
    },
    
    vendas: (data: ProductData) => {
      const features = extractNameFeatures(data.name);
      const finish = features.finish || 'elegante';
      const shape = features.shape || 'versátil';
      
      return `💍 ${data.name} - O anel que vai fazer você se sentir especial!

Este anel ${shape} ${finish} excepcional combina design sofisticado com elegância atemporal. Perfeito para qualquer ocasião, ele adiciona instantaneamente um ar de sofisticação ao seu visual, seja qual for seu estilo.

${data.measurements ? `Com ${data.measurements},` : ''} oferece o ajuste ideal para seu conforto e segurança. Use-o como destaque principal ou combine com outros anéis para criar um visual único e personalizado - as possibilidades são infinitas!

${data.is_on_sale ? `✨ OFFER! De R$ ${data.price} por R$ ${data.sale_price}!` : `Valor especial: R$ ${data.price}.`} Adicione ao carrinho e encante-se!`;
    },
    
    curto: (data: ProductData) => {
      const features = extractNameFeatures(data.name);
      const finish = features.finish || 'elegante';
      const shape = features.shape || 'versátil';
      
      return `${data.name}: elegância e significado no seu dedo. Design anel ${shape} ${finish} que realça sua beleza natural com sofisticação. ${data.measurements ? `Com ${data.measurements} para o ajuste perfeito.` : ''} O anel essencial para toda coleção.`;
    }
  }
};

export function generateDescription(
  data: ProductData, 
  style: DescriptionStyle = "basico"
): string {
  const categoryTemplates = templates[data.category as keyof typeof templates];
  
  if (!categoryTemplates) {
    return generateDefaultDescription(data, style);
  }
  
  const template = categoryTemplates[style];
  return template(data);
}

function generateDefaultDescription(
  data: ProductData, 
  style: DescriptionStyle
): string {
  const categoryName = data.category.toLowerCase();
  
  switch (style) {
    case "basico":
      return `${data.name} é um ${categoryName} elegante que complementa qualquer look com sofisticação. ${data.measurements ? `Com ${data.measurements},` : ''} oferece o ajuste perfeito para seu conforto. Ideal para o dia a dia ou ocasiões especiais, esta peça combina versatilidade com design atemporal.`;
    
    case "detalhado":
      return `${data.name} é um ${categoryName} excepcional que combina design contemporâneo com acabamento impecável. Cada detalhe foi cuidadosamente pensado para criar uma peça que não apenas embeleza, mas também conta uma história de sofisticação.

Este acessório versátil se adapta perfeitamente a diferentes estilos, do casual ao mais elegante. ${data.measurements ? `Com ${data.measurements},` : ''} foi projetado para oferecer conforto e segurança durante todo o dia. Seja para o trabalho, um jantar especial ou simplesmente para se sentir bem, este ${data.category.toLowerCase()} será sua companheira ideal.

A beleza desta peça está em sua capacidade de transformar qualquer look simples em algo extraordinário, adicionando aquele toque final que faz toda a diferença.`;
    
    case "emocional":
      return `${data.name} é mais que um acessório - é uma declaração de elegância e autoconfiança. Este ${data.category.toLowerCase()} foi criado para fazer você se sentir especial em cada momento, realçando sua beleza única e personalidade.

Cada detalhe do design reflete um compromisso com a excelência e o bem-estar. ${data.measurements ? `Com ${data.measurements},` : ''} proporciona uma experiência confortável que permite que você brilhe sem esforço. É a peça perfeita para celebrar conquistas, marcar momentos especiais ou simplesmente para lembrar-se do quanto você é extraordinária.

Ao usar este ${data.category.toLowerCase()}, você carrega consigo não apenas uma joia, mas uma atitude de confiança e graça. Deixe-se envolver por sua beleza e sinta o poder de se sentir bem na própria pele.`;
    
    case "vendas":
      return `✨ ${data.name} - O ${categoryName} que vai transformar seu estilo!

Este acessório extraordinário combina design sofisticado com versatilidade incomparável. Perfeito para qualquer ocasião, do trabalho aos eventos mais especiais, ele eleva automaticamente seu estilo e confere um ar de elegância que não passa despercebido.

${data.measurements ? `Com ${data.measurements},` : ''} oferece o ajuste ideal para seu conforto e segurança. É uma daquelas peças essenciais que toda mulher deve ter em sua coleção - aquela que resolve qualquer look e sempre faz você se sentir confiante.

${data.is_on_sale ? `🔥 PROMOÇÃO ESPECIAL! De R$ ${data.price} por apenas R$ ${data.sale_price}!` : `Valor exclusivo: R$ ${data.price}.`} Adicione ao carrinho agora!`;
    
    case "curto":
      return `${data.name}: elegância e sofisticação em um único ${categoryName}. Design versátil que realça sua beleza natural e combina com qualquer ocasião. ${data.measurements ? `Com ${data.measurements} para o ajuste perfeito.` : ''} A peça essencial que sua coleção merece.`;
    
    default:
      return generateDefaultDescription(data, "basico");
  }
}

export function getAllStyles(): DescriptionStyle[] {
  return ["basico", "detalhado", "emocional", "vendas", "curto"];
}

export function getStyleLabel(style: DescriptionStyle): string {
  const labels: Record<DescriptionStyle, string> = {
    basico: "Básico",
    detalhado: "Detalhado",
    emocional: "Emocional",
    vendas: "Focado em Vendas",
    curto: "Curto"
  };
  return labels[style];
}
