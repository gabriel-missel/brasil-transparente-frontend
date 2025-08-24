export enum OrigemPreposicao {
    do = 'do',
    da = 'da',
    de = 'de',
    dos = 'dos',
    das = 'das'
}

export interface FonteDados {
  nome: string;
  url: string;
  preposicao?: OrigemPreposicao;
}