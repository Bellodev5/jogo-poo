# BELLO RUN - Resumo dos Requisitos

===================================

Guilherme Bello | SENAI 2026

1. REGRAS DE NEGÓCIO

---

1.1. Início do Jogo
- O jogador inicia com 5 vidas
- Pontuação inicial igual a 0

1.2. Movimentação
- O jogador pode se mover verticalmente na tela
- No modo multiplayer, cada jogador possui controle independente

1.3. Colisão com Inimigos
- Ao colidir com inimigos COMUNS:
- O jogador perde 1 vida

1.4. Colisão com Obstáculo
- Reduz a velocidade do jogador temporariamente

1.5. Game Over
- Ocorre quando as vidas do jogador chegam a 0

1.6. Sistema de Pontuação
- O jogador ganha pontos a cada inimigo que passa ao final da tela sem colidir
- Pontuação é de 10 em 10
- A cada 100 pontos, fase muda

1.7. Itens Coletáveis
- Vida:
- Recupera 1 vida (máximo de 5)
- Boost:
- Aumenta a velocidade temporariamente

1.8. Boss
- Aparece aleatoriamente durante o jogo
- Causa maior dano ao jogador; Tira 3 vidas

1.9. Dificuldade
- Aumenta progressivamente com o tempo
- Inimigos ficam mais rápidos

1.10. Multiplayer
- Dois jogadores simultâneos
- Cada jogador possui:
- Vidas independentes
- Pontuação independente
- Vence quem sobreviver pelas 3 fases

2. FUNCIONALIDADES

---

2.1. Modos de Jogo
- Modo Single Player
- Modo Multiplayer Local

2.2. Canvas
- Renderização via HTML5 Canvas

2.3. Controles
- Jogador 1:
- W / S ou Setas
- Jogador 2:
- I / K

2.4. Sistema de Colisão
- Detecção baseada em área (hitbox)
- Interações:
- Jogador x Inimigos
- Jogador x Obstáculos
- Jogador x Itens

2.5. Itens
- Gerados aleatoriamente durante o jogo
- Aplicam efeitos imediatos ao jogador

2.6. Sistema de Atualização
- Loop contínuo utilizando requestAnimationFrame
- Responsável por:
- Movimentação
- Colisões
- Pontuação
- Spawn de objetos

2.7. Renderização
- Desenho contínuo dos elementos:
- Personagem
- Inimigos
- Obstáculos
- Itens
- HUD

2.8. HUD (Interface)
- Exibe:
- Vidas
- Pontuação
- Estado do jogador

2.9. Efeitos Visuais
- Flash ao tomar dano
- Rastro ao usar boost
- Animações de destruição

2.10. Áudio
- Sons de:
- Colisão
- Coleta
- Game Over
- Música de fundo

2.11. Telas do Sistema
- Tela inicial
- Tela de jogo
- Tela de Game Over

2.12. Reinício
- Possibilidade de reiniciar o jogo sem recarregar a página

2.13. Multiplayer
- Dois jogadores simultâneos na mesma tela
- HUD separado para cada jogador

3. ASPECTOS TÉCNICOS

---

3.1. Performance
- Uso de requestAnimationFrame

3.2. Tecnologia
- HTML5
- CSS3
- JavaScript (Vanilla)

3.3. Estrutura de Código
- Organização baseada em classes:
- Personagem
- Inimigo
- Obstáculo
- Item
- Separação por arquivos

3.4. Arquitetura
- Game Loop principal:
- atualizar()
- desenhar()

3.5. Compatibilidade / Portabilidade
- Desktop
- Não compatível com mobile

3.6. Canvas
- Renderização 2D
- Manipulação direta do contexto

3.7. Sistema de Estados
- Controle de:
- Jogando
- Game Over
- Menu
