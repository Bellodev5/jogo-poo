
## Documentação de Requisitos


| Campo          | Informação                                  |
|----------------|---------------------------------------------|
| Desenvolvedor  | Bello (Guilherme Bello)                     |
| Curso          | Desenvolvimento de Sistemas — SESI SENAI    |
| Orientador     | Prof. Carlos Roberto da Silva Filho         |
| Disciplina     | Modelagem de Sistemas                       |
| Tecnologias    | HTML5, JavaScript (Canvas API), CSS         |
| Ano            | 2025                                        |

---

## 1. Visão Geral do Projeto

O projeto consiste em um jogo 2D de runner desenvolvido integralmente em JavaScript puro com HTML5 Canvas. O jogador controla um personagem que se move verticalmente em uma pista e deve desviar de inimigos, carros e obstáculos enquanto coleta itens especiais para sobreviver e acumular pontos.

O jogo possui menu principal estilizado, sistema de modo 1 ou 2 jogadores, tela de carregamento animada, manual de controles, tela "Sobre" com dados do desenvolvedor e telas de vitória e derrota. Todo o código roda diretamente no navegador, sem frameworks ou transpilação.

---

## 2. Requisitos Não Funcionais (RNF)

| Código | Nome              | Descrição |
|--------|------------------|----------|
| RNF01 | Tecnologia | Desenvolvido em JavaScript puro, compatível com navegadores modernos sem necessidade de transpilação ou bundler. |
| RNF02 | Portabilidade | Roda diretamente no navegador via HTML5 Canvas, sem instalação de dependências externas pelo usuário. |
| RNF03 | Usabilidade | Interface projetada para desktop, otimizada para resolução de canvas 1200×700 pixels com layout responsivo via CSS. |
| RNF04 | Desempenho | Utiliza requestAnimationFrame garantindo fluidez e taxa de quadros estável de aproximadamente 60 FPS. |
| RNF05 | Estética Pixel Art | Menu principal e elementos de HUD utilizam a fonte 'Press Start 2P' e image-rendering: pixelated para manter a identidade visual retro. |
| RNF06 | Modularidade | O código está organizado em arquivos separados: Carro.js (entidades) e index.js (lógica do jogo), facilitando manutenção. |

---

## 3. Regras de Negócio (RN)

| Código | Nome | Descrição |
|--------|------|----------|
| RN01 | Condição de Vitória | O jogador vence ao atingir 300 pontos com pelo menos 1 vida restante. Ao atingir a pontuação, a flag jogando é definida como false e a tela de vitória é exibida. |
| RN02 | Condição de Derrota | O jogo encerra quando as vidas chegam a zero. A tela de Game Over é exibida com a pontuação final e estrelas proporcionais ao desempenho. |
| RN03 | Dificuldade Progressiva | A cada 15 pontos acumulados, o nível de dificuldade sobe: velocidade dos inimigos, carros, obstáculos e boss aumentam; o delay de spawn dos coletáveis diminui. |
| RN04 | Troca de Cenário | O fundo muda automaticamente conforme a pontuação: fundo1 (0–100 pts), fundo2 (101–200 pts), fundo3 (201+ pts), indicando progressão visual. |
| RN05 | Sistema de Pontuação | O jogador ganha 10 pontos ao passar por um inimigo ou carro sem colisão (quando o objeto sai da tela à esquerda). |
| RN06 | Efeito Slow | Colisão com obstáculo reduz a velocidade do personagem para 4 (base: 10) por 60 frames, sem causar perda de vida. |
| RN07 | Efeito Boost | Coleta do item Boost eleva a velocidade para 16 por 80 frames, ativando trilha visual e aura azul no personagem. |
| RN08 | Dano do Boss | Colisão com o boss retira 3 vidas de uma vez, causa flash de dano e screen shake de 40 frames, sendo o evento mais severo do jogo. |
| RN09 | Modo 2 Jogadores | No modo 2P, cada jogador controla seu próprio personagem independentemente (P1: W/S; P2: setas). Se um personagem perder todas as vidas, o outro continua. |
| RN10 | Manual de Instruções | O jogo possui tela de controles explicando comandos e mecânicas, acessível pelo menu antes de iniciar a partida. |

---

## 4. Requisitos Funcionais (RF)

| Código | Nome | Descrição |
|--------|------|----------|
| RF01 | Movimentação do Personagem | O jogador se move verticalmente (eixo Y) com as teclas W/S (P1) ou setas Cima/Baixo (P2). O movimento fica restrito aos limites da pista (RUA_TOPO a RUA_BASE). |
| RF02 | Sistema de Vidas | O personagem inicia com 5 vidas representadas por corações no HUD. Colisões com inimigos e carros retiram 1 vida; colisão com o boss retira 3. |
| RF03 | Sistema de Pontuação | Pontuação exibida em tempo real no HUD. O jogador acumula 10 pontos por inimigo ou carro que passa sem colisão. |
| RF04 | Coletáveis — Vida | Item de coração aparece periodicamente na pista com delay de spawn. Ao coletá-lo, o jogador recupera 1 vida. Emite som de coleta. |
| RF05 | Coletáveis — Boost | Item de boost aparece com delay de spawn independente. Ao coletá-lo, aplica efeito de velocidade aumentada por 80 frames com trilha visual e aura. |
| RF06 | Inimigos Animados | Dois tipos de inimigos animados (personagem e carro) com sprites de 2 frames. Reaparecem aleatoriamente dentro dos limites da pista ao sair da tela. |
| RF07 | Obstáculos | Objeto estático que aplica efeito slow ao ser tocado, sem retirar vida. Reaparece aleatoriamente na pista. |
| RF08 | Boss | Inimigo especial com spawn aleatório entre 2400–2800 frames. Retira 3 vidas na colisão. Maior, mais rápido e com sprite animado próprio. |
| RF09 | HUD | Interface de jogo exibe: vidas (ícone + número + corações), pontuação (estrela + valor + 'pts'), tudo em painel semi-transparente com bordas coloridas. |
| RF10 | Screen Shake | Efeito de tremida de tela ao sofrer dano: 10 frames para inimigos/carros, 3 frames para obstáculos, 40 frames para o boss. |
| RF11 | Fundo Dinâmico | 3 imagens de fundo trocadas automaticamente com base na pontuação, criando sensação de progressão visual durante a partida. |
| RF12 | Menu Principal | Tela inicial com fundo em vídeo, título animado (bounce), botões estilo pixel art navegáveis por teclado (W/S/Enter) ou mouse. |
| RF13 | Seleção de Modo | Modal de seleção permite escolher entre Modo 1 Player e Modo 2 Players antes de iniciar a partida. |
| RF14 | Tela de Carregamento | Loading screen animada com barra de progresso, porcentagem, dicas rotativas e badge indicando o modo selecionado. |
| RF15 | Manual de Controles | Tela fullscreen com instruções de teclas, descrição dos inimigos/itens com sprites animados e dicas de gameplay. |
| RF16 | Tela Sobre | Tela com foto e dados do desenvolvedor (nome, curso, skills, redes sociais) e informações do orientador. Inclui versículo bíblico. |
| RF17 | Tela de Game Over | Overlay semi-transparente com painel pixel art exibindo: título (GAME OVER / VOCÊ VENCEU!), pontuação final e 1–3 estrelas conforme desempenho. |
| RF18 | Efeitos Sonoros | Sons individuais para: motor do personagem, colisão com inimigo, colisão com carro, obstáculo, coleta de vida, boost e boss. |

---

## 5. Arquitetura e Estrutura de Arquivos

O projeto segue uma arquitetura simples de dois arquivos JavaScript principais, carregados em sequência via tags `<script defer>` no HTML:

| Arquivo | Responsabilidade |
|--------|-----------------|
| index.html | Menu principal — telas de controles, sobre e loading. Navegação por teclado/mouse. |
| jogo.html | Página do canvas do jogo. Carrega Carro.js e index.js via defer. |
| models/Carro.js | Definição de todas as classes de entidade: Obj, Personagem, InimigoAnimado, Obstaculo, Coletavel, Boost, Boss e Text. |
| index.js | Lógica principal do jogo: instâncias, controles, colisões, pontuação, dificuldade, HUD, Game Over e loop principal (requestAnimationFrame). |
| img/fase1/ | Sprites animados por fase (personagem, inimigos, boss, itens, fundos). |
| audio/fase1/ | Efeitos sonoros individuais por evento de jogo. |

---

## 6. Hierarquia de Classes (Carro.js)

Todas as entidades do jogo herdam da classe base Obj, que encapsula posição, dimensões e método de desenho no canvas:

- Obj  
- Personagem — jogador com movimento, animação, efeitos de slow/boost/dano e sistema de trilha visual  
- InimigoAnimado — inimigos e carros com sprite de 2 frames e velocidade configurável  
- Obstaculo — objeto sem animação que aplica slow ao personagem  
- Coletavel — item base com sistema de spawn temporizado  
- Boost (herda de Coletavel) — variante com animação própria e efeito de velocidade  
- Boss — inimigo especial com spawn aleatório e maior impacto no jogo  
- Text — utilitário para renderizar textos no canvas  

---

## 7. Telas do Sistema (RF06)

| Tela | Descrição |
|------|----------|
| Menu Inicial | Tela com vídeo de fundo, título animado (bounce), botões pixel art navegáveis por teclado e mouse. Opções: Jogar, Controles, Sobre. |
| Seleção de Modo | Modal sobreposto com escolha entre 1 Player e 2 Players antes de iniciar a partida. |
| Tela de Jogo | Canvas 1200x700 com personagem(s), inimigos, obstáculos, boss, coletáveis, HUD e fundo dinâmico. |
| Tela de Carregamento | Fullscreen animada com barra de progresso, porcentagem, dicas rotativas e badge do modo selecionado. |
| Manual de Controles | Tela fullscreen com lista de teclas, descrição dos inimigos/itens com sprites animados e dicas. |
| Tela Sobre | Perfil do desenvolvedor (foto, dados, redes sociais), informações do orientador e versículo bíblico. |
| Tela de Vitória | Overlay com painel 'VOCÊ VENCEU!', pontuação final e 3 estrelas verdes. Exibida ao atingir 300 pts. |
| Tela de Derrota | Overlay com painel 'GAME OVER', pontuação final e 1–2 estrelas amarelas. Exibida ao zerar as vidas. |

