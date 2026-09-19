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

export type DescriptionStyle = 
  | "basico" 
  | "detalhado" 
  | "emocional" 
  | "vendas" 
  | "curto";

const templates = {
  Brincos: {
    basico: (data: ProductData) => 
      `${data.name} é um ${data.category.toLowerCase()} elegante, ideal para qualquer ocasião. ${data.material ? `Feito com ${data.material}.` : ''} ${data.measurements ? `Medidas: ${data.measurements}.` : ''} ${data.warranty ? `Garantia: ${data.warranty}.` : ''}`,
    
    detalhado: (data: ProductData) => 
      `Descubra a elegância do ${data.name}, um ${data.category.toLowerCase()} cuidadosamente elaborado para realçar sua beleza. ${data.material ? `Confeccionado em ${data.material},` : ''} ${data.plating ? `com acabamento em ${data.plating},` : ''} esta peça combina qualidade e sofisticação. ${data.measurements ? `Com ${data.measurements},` : ''} oferece o ajuste perfeito. ${data.warranty ? `Inclui garantia de ${data.warranty} para sua tranquilidade.` : ''} Ideal para uso diário ou ocasiões especiais.`,
    
    emocional: (data: ProductData) => 
      `Sinta-se especial com o ${data.name}. Cada detalhe deste ${data.category.toLowerCase()} foi pensado para fazer você brilhar. ${data.material ? `A qualidade do ${data.material} garante durabilidade e conforto.` : ''} ${data.measurements ? `Com ${data.measurements},` : ''} é a peça perfeita para expressar seu estilo único. ${data.warranty ? `Sua satisfação é nossa prioridade, com garantia de ${data.warranty}.` : ''} Uma escolha que vai além da beleza, é um gesto de amor próprio.`,
    
    vendas: (data: ProductData) => 
      `✨ ${data.name} - O ${data.category.toLowerCase()} que você precisa! ${data.material ? `Material premium: ${data.material}.` : ''} ${data.measurements ? `Tamanho perfeito: ${data.measurements}.` : ''} ${data.warranty ? `Garantia total: ${data.warranty}.` : ''} ${data.is_on_sale ? `🔥 PROMOÇÃO ESPECIAL! De R$ ${data.price} por apenas R$ ${data.sale_price}!` : `Valor exclusivo: R$ ${data.price}.`} Adicione ao carrinho agora e eleve seu estilo!`,
    
    curto: (data: ProductData) => 
      `${data.name}: ${data.category.toLowerCase()} elegante. ${data.material ? `${data.material}.` : ''} ${data.measurements ? `${data.measurements}.` : ''} ${data.warranty ? `Garantia: ${data.warranty}.` : ''}`
  },
  
  Colares: {
    basico: (data: ProductData) => 
      `${data.name} é um ${data.category.toLowerCase()} versátil que complementa qualquer look. ${data.material ? `Produzido com ${data.material}.` : ''} ${data.measurements ? `Comprimento: ${data.measurements}.` : ''} ${data.warranty ? `Garantia: ${data.warranty}.` : ''}`,
    
    detalhado: (data: ProductData) => 
      `Elevate seu estilo com o ${data.name}, um ${data.category.toLowerCase()} extraordinário que combina design contemporâneo com acabamento impecável. ${data.material ? `Fabricado em ${data.material} de alta qualidade,` : ''} ${data.plating ? `com banho em ${data.plating},` : ''} esta peça é durável e resistente. ${data.measurements ? `Medindo ${data.measurements},` : ''} oferece versatilidade para diferentes estilos de decote. ${data.warranty ? `Garantia de ${data.warranty} assegura sua compra.` : ''} Perfeito para uso diário ou eventos especiais.`,
    
    emocional: (data: ProductData) => 
      `O ${data.name} é mais que um ${data.category.toLowerCase()} - é uma declaração de elegância. ${data.material ? `Cada detalhe em ${data.material} conta uma história de cuidado e dedicação.` : ''} ${data.measurements ? `Com ${data.measurements},` : ''} ajusta-se perfeitamente ao seu estilo, seja casual ou sofisticado. ${data.warranty ? `Traga esta peça especial para sua coleção com garantia de ${data.warranty}.` : ''} Um presente para si mesma ou alguém especial.`,
    
    vendas: (data: ProductData) => 
      `💎 ${data.name} - Coleção Premium! ${data.material ? `Material de excelência: ${data.material}.` : ''} ${data.measurements ? `Medida ideal: ${data.measurements}.` : ''} ${data.warranty ? `Garantia assegurada: ${data.warranty}.` : ''} ${data.is_on_sale ? `🎯 OFERTA IMPERDÍVEL! Antes R$ ${data.price}, agora R$ ${data.sale_price}!` : `Investimento em beleza: R$ ${data.price}.`} Compre agora e transforme seus looks!`,
    
    curto: (data: ProductData) => 
      `${data.name}: ${data.category.toLowerCase()} elegante. ${data.material ? `${data.material}.` : ''} ${data.measurements ? `${data.measurements}.` : ''} ${data.warranty ? `Garantia: ${data.warranty}.` : ''}`
  },
  
  Pulseiras: {
    basico: (data: ProductData) => 
      `${data.name} é uma ${data.category.toLowerCase()} charmosa que adiciona um toque especial ao seu look. ${data.material ? `Elaborada com ${data.material}.` : ''} ${data.measurements ? `Tamanho: ${data.measurements}.` : ''} ${data.warranty ? `Garantia: ${data.warranty}.` : ''}`,
    
    detalhado: (data: ProductData) => 
      `Adicione um toque de sofisticação ao seu pulso com o ${data.name}. Esta ${data.category.toLowerCase()} combina design moderno com artesanato cuidadoso. ${data.material ? `Confeccionada em ${data.material},` : ''} ${data.plating ? `com acabamento ${data.plating},` : ''} oferece qualidade superior. ${data.measurements ? `Com ${data.measurements},` : ''} proporciona conforto e estilo. ${data.warranty ? `Inclui garantia de ${data.warranty} para sua segurança.` : ''} Ideal para compor looks do dia a dia ou ocasiões especiais.`,
    
    emocional: (data: ProductData) => 
      `Deixe-se encantar pelo ${data.name}. Esta ${data.category.toLowerCase()} foi criada para fazer você se sentir única e confiante. ${data.material ? `A escolha do ${data.material} reflete nosso compromisso com qualidade.` : ''} ${data.measurements ? `Com ${data.measurements},` : ''} é a companheira perfeita para cada momento. ${data.warranty ? `Sua alegria é garantida com ${data.warranty} de proteção.` : ''} Um acessório que conta sua história.`,
    
    vendas: (data: ProductData) => 
      `⚡ ${data.name} - Estilo que Conquista! ${data.material ? `Material premium: ${data.material}.` : ''} ${data.measurements ? `Ajuste perfeito: ${data.measurements}.` : ''} ${data.warranty ? `Garantia completa: ${data.warranty}.` : ''} ${data.is_on_sale ? `🚀 SUPER PROMOÇÃO! De R$ ${data.price} por R$ ${data.sale_price}!` : `Valor especial: R$ ${data.price}.`} Garanta a sua agora!`,
    
    curto: (data: ProductData) => 
      `${data.name}: ${data.category.toLowerCase()} estilosa. ${data.material ? `${data.material}.` : ''} ${data.measurements ? `${data.measurements}.` : ''} ${data.warranty ? `Garantia: ${data.warranty}.` : ''}`
  },
  
  Braceletes: {
    basico: (data: ProductData) => 
      `${data.name} é um ${data.category.toLowerCase()} moderno que expressa sua personalidade. ${data.material ? `Feito com ${data.material}.` : ''} ${data.measurements ? `Medidas: ${data.measurements}.` : ''} ${data.warranty ? `Garantia: ${data.warranty}.` : ''}`,
    
    detalhado: (data: ProductData) => 
      `Expressa seu estilo único com o ${data.name}, um ${data.category.toLowerCase()} que combina tendência e qualidade. ${data.material ? `Produzido com ${data.material} selecionado,` : ''} ${data.plating ? `e acabamento em ${data.plating},` : ''} esta peça é durável e elegante. ${data.measurements ? `Com ${data.measurements},` : ''} oferece o ajuste ideal para seu pulso. ${data.warranty ? `Garantia de ${data.warranty} incluída.` : ''} Perfeito para criar looks impactantes.`,
    
    emocional: (data: ProductData) => 
      `O ${data.name} é mais que um acessório - é uma extensão da sua personalidade. ${data.material ? `Cada detalhe em ${data.material} foi pensado para te fazer sentir especial.` : ''} ${data.measurements ? `Com ${data.measurements},` : ''} adapta-se ao seu estilo, do casual ao elegante. ${data.warranty ? `Leve esta peça com confiança, garantida por ${data.warranty}.` : ''} Uma declaração de quem você é.`,
    
    vendas: (data: ProductData) => 
      `🌟 ${data.name} - Trend Alert! ${data.material ? `Material de qualidade: ${data.material}.` : ''} ${data.measurements ? `Medida perfeita: ${data.measurements}.` : ''} ${data.warranty ? `Garantia total: ${data.warranty}.` : ''} ${data.is_on_sale ? `💥 PREMIUM SALE! Era R$ ${data.price}, agora R$ ${data.sale_price}!` : `Valor exclusivo: R$ ${data.price}.`} Compre agora e destaque-se!`,
    
    curto: (data: ProductData) => 
      `${data.name}: ${data.category.toLowerCase()} moderno. ${data.material ? `${data.material}.` : ''} ${data.measurements ? `${data.measurements}.` : ''} ${data.warranty ? `Garantia: ${data.warranty}.` : ''}`
  },
  
  Anéis: {
    basico: (data: ProductData) => 
      `${data.name} é um ${data.category.toLowerCase()} sofisticado que realça a beleza das suas mãos. ${data.material ? `Produzido com ${data.material}.` : ''} ${data.measurements ? `Tamanho: ${data.measurements}.` : ''} ${data.warranty ? `Garantia: ${data.warranty}.` : ''}`,
    
    detalhado: (data: ProductData) => 
      `Adicione um toque de elegância ao seu dedo com o ${data.name}. Este ${data.category.toLowerCase()} excepcional combina design refinado com acabamento premium. ${data.material ? `Elaborado em ${data.material} de alta qualidade,` : ''} ${data.plating ? `com banho em ${data.plating},` : ''} oferece durabilidade e brilho. ${data.measurements ? `Com ${data.measurements},` : ''} proporciona ajuste confortável. ${data.warranty ? `Garantia de ${data.warranty} assegura sua compra.` : ''} Ideal para uso diário ou ocasiões memoráveis.`,
    
    emocional: (data: ProductData) => 
      `O ${data.name} é uma promessa de elegância e significado. ${data.material ? `Cada curva e detalhe em ${data.material} foi desenhado para tocar seu coração.` : ''} ${data.measurements ? `Com ${data.measurements},` : ''} é a peça perfeita para celebrar momentos especiais ou simplesmente porque você merece. ${data.warranty ? `Leve esta joia com tranquilidade, protegida por ${data.warranty} de garantia.` : ''} Um símbolo de beleza eterna.`,
    
    vendas: (data: ProductData) => 
      `💍 ${data.name} - Sofisticação Garantida! ${data.material ? `Material premium: ${data.material}.` : ''} ${data.measurements ? `Tamanho ideal: ${data.measurements}.` : ''} ${data.warranty ? `Garantia completa: ${data.warranty}.` : ''} ${data.is_on_sale ? `✨ OFFER! De R$ ${data.price} por R$ ${data.sale_price}!` : `Valor especial: R$ ${data.price}.`} Adicione ao carrinho e encante-se!`,
    
    curto: (data: ProductData) => 
      `${data.name}: ${data.category.toLowerCase()} elegante. ${data.material ? `${data.material}.` : ''} ${data.measurements ? `${data.measurements}.` : ''} ${data.warranty ? `Garantia: ${data.warranty}.` : ''}`
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
      return `${data.name} é um ${categoryName} elegante. ${data.material ? `Feito com ${data.material}.` : ''} ${data.measurements ? `Medidas: ${data.measurements}.` : ''} ${data.warranty ? `Garantia: ${data.warranty}.` : ''}`;
    
    case "detalhado":
      return `${data.name} é um ${categoryName} excepcional que combina qualidade e design. ${data.material ? `Confeccionado em ${data.material},` : ''} ${data.measurements ? `com ${data.measurements},` : ''} esta peça é durável e elegante. ${data.warranty ? `Inclui garantia de ${data.warranty}.` : ''}`;
    
    case "emocional":
      return `Sinta-se especial com o ${data.name}. ${data.material ? `A qualidade do ${data.material} garante conforto e durabilidade.` : ''} ${data.measurements ? `Com ${data.measurements},` : ''} é a peça perfeita para expressar seu estilo. ${data.warranty ? `Garantia de ${data.warranty} para sua tranquilidade.` : ''}`;
    
    case "vendas":
      return `✨ ${data.name} - Qualidade Premium! ${data.material ? `Material: ${data.material}.` : ''} ${data.measurements ? `Medidas: ${data.measurements}.` : ''} ${data.warranty ? `Garantia: ${data.warranty}.` : ''} ${data.is_on_sale ? `🔥 PROMOÇÃO! De R$ ${data.price} por R$ ${data.sale_price}!` : `Valor: R$ ${data.price}.`} Compre agora!`;
    
    case "curto":
      return `${data.name}: ${categoryName}. ${data.material ? `${data.material}.` : ''} ${data.measurements ? `${data.measurements}.` : ''} ${data.warranty ? `Garantia: ${data.warranty}.` : ''}`;
    
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
