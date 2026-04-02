# 🎮 BELLO RUN

**Bello Run** é um jogo 2D desenvolvido em JavaScript utilizando **Canvas API**, onde o jogador precisa desviar de obstáculos, derrotar inimigos e sobreviver o máximo possível enquanto acumula pontos.

---

## 🧠 Sobre o Projeto

O jogo foi desenvolvido com foco em:

* Programação orientada a objetos (POO)
* Manipulação de canvas (renderização gráfica)
* Lógica de jogos (Game Loop)
* Eventos e colisões
* Estrutura modular de código

---

## 🎮 Funcionalidades

* ✅ Modo **Single Player**
* ✅ Modo **Multiplayer Local (2 jogadores)**
* ✅ Sistema de pontuação dinâmica
* ✅ Sistema de vidas
* ✅ Power-ups (Boost e Vida)
* ✅ Inimigos e obstáculos variados
* ✅ Boss com dano elevado
* ✅ Aumento progressivo de dificuldade
* ✅ Efeitos visuais (trail, flash, shake)
* ✅ HUD completo (vidas + pontos)
* ✅ Tela de Game Over interativa

---

## 🕹️ Controles

### 🎯 Player 1:

* `W` → subir
* `S` → descer
* `↑` → subir
* `↓` → descer

### 🎯 Player 2:

* `I` → subir
* `K` → descer

---

## 🏆 Objetivo

* Desviar de inimigos e obstáculos
* Coletar itens
* Sobreviver o máximo possível
* Alcançar **300 pontos para vencer**

---

## ⚙️ Tecnologias Utilizadas

* HTML5
* CSS3
* JavaScript (Vanilla)
* Canvas API

---

## 🧩 Estrutura do Projeto

```bash
jogo-poo/
│
├── audio/
│   └── fase1/
│
├── img/
│   └── fase1/
│
├── models/
│   ├── Carro.js
│
├── diagramas_uml/
│
├── index.html
├── jogo.html
├── index.js
├── style.css
```

---

## 🏗️ Arquitetura do Código

O projeto segue um modelo baseado em classes:

### 🔹 Classe Base

* `Obj` → Classe genérica para renderização

### 🔹 Personagem

* Movimentação
* Vida e pontuação
* Efeitos (boost, slow, dano)

### 🔹 Inimigos

* `InimigoAnimado`
* `Obstaculo`
* `Boss`

### 🔹 Itens

* `Coletavel`
* `Boost`

### 🔹 Sistema

* Loop principal (`main`)
* Atualização (`atualizar`)
* Renderização (`desenhar`)
* Colisões
* Pontuação

---

## 🔁 Game Loop

O jogo roda em um loop contínuo:

```js
function main(){
    desenhar()
    atualizar()
    requestAnimationFrame(main)
}
```

---

## ⚡ Mecânicas Importantes

### 💥 Colisão

* Reduz vida
* Aplica efeitos (slow, dano, boost)

### 🚀 Boost

* Aumenta velocidade temporariamente
* Gera efeito visual (rastro)

### 🧱 Obstáculo

* Aplica redução de velocidade

### 👾 Boss

* Causa dano alto
* Spawn aleatório

---

## 📈 Sistema de Dificuldade

A dificuldade aumenta conforme a pontuação:

* Inimigos ficam mais rápidos
* Itens aparecem com mais frequência
* Boss se torna mais agressivo

---

## 🎨 Interface (HUD)

* Vida representada por ícones
* Pontuação em tempo real
* Indicação de jogador (P1/P2)
* Estado (vivo / eliminado)

---

## 🔊 Sistema de Áudio

* Sons de colisão
* Sons de coleta
* Som de motor contínuo
* Efeitos especiais (boost, boss)

---

## 🧪 Como Executar

1. Clone o projeto:

```bash
git clone https://github.com/seu-repositorio/bello-run.git
```

2. Abra o arquivo:

```bash
index.html
```

3. Para modo multiplayer:

```
jogo.html?modo=2p
```

---

## 📌 Melhorias Futuras

* 🎮 Sistema de fases
* 🌐 Multiplayer online
* 💾 Salvamento de ranking
* 🎨 Skins de personagem
* 🔊 Controle de volume

---

## 👨‍💻 Autor

Desenvolvido por **Guilherme Bello**

---

## 📄 Licença

Este projeto é acadêmico e sem fins comerciais.
