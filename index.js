let canvas = document.getElementById('des')
let des = canvas.getContext('2d')

// LIMITES DA RUA
const RUA_TOPO = 340
const RUA_BASE = 620

// MODO DE JOGO — lido da URL (?modo=2p)
const params   = new URLSearchParams(window.location.search)
const MODO_2P  = params.get('modo') === '2p'

// ── PERSONAGENS ──
// P1 nasce na faixa superior da rua
let personagem = new Personagem(120, RUA_TOPO + 30, 70, 110)
personagem.id  = 1

// P2 nasce na faixa inferior (só usado em 2P)
let personagem2 = null
if(MODO_2P){
    personagem2    = new Personagem(120, RUA_TOPO + 140, 70, 110)
    personagem2.id = 2
    personagem2.spriteBase = './img/fase1/personagem2_001'
    personagem2.temSprite2 = false  
    let testeImg = new Image()
    testeImg.onload  = () => { personagem2.temSprite2 = true }
    testeImg.onerror = () => { personagem2.spriteBase = './img/fase1/personagem_001' }
    testeImg.src = './img/fase1/personagem2_001.png'
}

// Estado de cada player
let p1Vivo = true
let p2Vivo = MODO_2P   // começa vivo se for 2P, false em 1P

// INIMIGOS
let inimigo1  = new InimigoAnimado(1300, RUA_TOPO + 20,  70,  110, 'inimigo')

// CARROS
let carro1    = new InimigoAnimado(1500, RUA_TOPO + 80,  160,  80, 'carro1')

// OBSTÁCULOS
let obstaculo1 = new Obstaculo(1900, RUA_TOPO + 30, 40, 40, './img/fase1/obstaculo1.png')

// ITENS
let vidaItem  = new Coletavel(1700, RUA_TOPO + 100, 40, 40)
let boostItem = new Boost(1800, RUA_TOPO + 60,  40, 40)

// BOSS
let boss = new Boss(2000, RUA_TOPO + 80, 140, 100)

let txtPontos = new Text()
let txtVida   = new Text()

// SONS
let motor        = new Audio('./audio/fase1/motor.wav')
let batida       = new Audio('./audio/fase1/batida.wav')
let somPersonagem = new Audio('./audio/fase1/shadow.wav')
let somCarro     = new Audio('./audio/fase1/batida.mp3')
let somObstaculo = new Audio('./audio/fase1/obstaculo.wav')
let coletarSom   = new Audio('./audio/fase1/coletar.wav')
let somBoost     = new Audio('./audio/fase1/boost.wav')
let somBoss      = new Audio('./audio/fase1/boss.wav')

motor.loop = true

let jogando          = true
let nivelDificuldade = 1
let shake            = 0

// Pontuação compartilhada em 2P (quem está vivo pontua pelo time)
// Em 1P usa personagem.pontos normalmente
function getPontos(){
    if(!MODO_2P) return personagem.pontos
    // em 2P, pontuação é a maior entre os dois vivos
    if(p1Vivo && p2Vivo) return Math.max(personagem.pontos, personagem2.pontos)
    if(p1Vivo)  return personagem.pontos
    if(p2Vivo)  return personagem2.pontos
    return Math.max(personagem.pontos, personagem2.pontos)
}

// FUNDOS
let imgFundo1 = new Image()
let imgFundo2 = new Image()
let imgFundo3 = new Image()
let fundoCarregado = false

imgFundo1.onload = () => fundoCarregado = true
imgFundo1.src = './img/fase1/fundo.png'
imgFundo2.src = './img/fase1/fundo2.png'
imgFundo3.src = './img/fase1/fundo3.png'

// RESIZE
function redimensionar(){
    canvas.style.width  = window.innerWidth  + 'px'
    canvas.style.height = window.innerHeight + 'px'
}
window.addEventListener('resize', redimensionar)
redimensionar()

// ── CONTROLES ──
// P1: W / S
// P2: ArrowUp / ArrowDown
document.addEventListener('keydown', (e) => {
    motor.play()

    // P1
    if (e.key === 'w' || e.key === 'W') personagem.dir = -1
    if (e.key === 's' || e.key === 'S') personagem.dir = 1

    // P2 (só processa se P2 existir e estiver vivo)
    if (MODO_2P && personagem2 && p2Vivo) {
        if (e.key === 'ArrowUp')   personagem2.dir = -1
        if (e.key === 'ArrowDown') personagem2.dir = 1
    }
})

document.addEventListener('keyup', (e) => {
    // P1
    if (['w', 'W', 's', 'S'].includes(e.key)) personagem.dir = 0

    // P2
    if (MODO_2P && personagem2) {
        if (['ArrowUp', 'ArrowDown'].includes(e.key)) personagem2.dir = 0
    }
})

// DIFICULDADE — baseada na maior pontuação ativa
function atualizarDificuldade(){
    let novoNivel = Math.floor(getPontos() / 15) + 1

    if(novoNivel > nivelDificuldade){
        nivelDificuldade = novoNivel

        inimigo1.vel   += 0.5
        carro1.vel     += 0.6
        obstaculo1.vel += 0.4
        boss.vel       += 0.8

        vidaItem.delaySpawn  -= 20
        boostItem.delaySpawn -= 20
    }
}

// ── COLISÕES ──
function verificarColisoesPara(p){
    if(!p) return

    if(p.colisao(inimigo1)){
        somPersonagem.play()
        p.vida--
        p.tomarDano()
        inimigo1.reiniciar()
        shake = 10
    }

    if(p.colisao(carro1)){
        somCarro.play()
        p.vida--
        p.tomarDano()
        carro1.reiniciar()
        shake = 10
    }

    if(p.colisao(obstaculo1)){
        somObstaculo.play()
        p.aplicarSlow()
        obstaculo1.reiniciar()
        shake = 3
    }

    if(vidaItem.ativo && p.colisao(vidaItem)){
        coletarSom.play()
        p.vida++
        vidaItem.reiniciar()
    }

    if(boostItem.ativo && p.colisao(boostItem)){
        somBoost.play()
        p.aplicarBoost()
        boostItem.reiniciar()
    }

    if(boss.ativo && p.colisao(boss)){
        somBoss.play()
        p.vida -= 3
        p.tomarDano()
        boss.reiniciar()
        shake = 40
    }
}

function verificarColisoes(){
    if(p1Vivo) verificarColisoesPara(personagem)
    if(MODO_2P && p2Vivo) verificarColisoesPara(personagem2)
}

// PONTOS
function pontuar(){
    let objs = [inimigo1, carro1]
    objs.forEach(obj => {
        if(p1Vivo && personagem.passou(obj)){
            personagem.pontos += 10
            if(MODO_2P && p2Vivo) personagem2.pontos = personagem.pontos
            obj.reiniciar()
        } else if(MODO_2P && p2Vivo && !p1Vivo && personagem2.passou(obj)){
            personagem2.pontos += 10
            obj.reiniciar()
        }
    })
}

// ── HELPER RETÂNGULO ARREDONDADO ──
function arredondar(ctx, x, y, w, h, r){
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.lineTo(x + w - r, y)
    ctx.quadraticCurveTo(x + w, y, x + w, y + r)
    ctx.lineTo(x + w, y + h - r)
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
    ctx.lineTo(x + r, y + h)
    ctx.quadraticCurveTo(x, y + h, x, y + h - r)
    ctx.lineTo(x, y + r)
    ctx.quadraticCurveTo(x, y, x + r, y)
    ctx.closePath()
}

// ── HUD ──
function desenharHUD(){
    const hudY = 20

    if(!MODO_2P){
        desenharHUDPlayer(personagem, 20, hudY, 'rgba(255,60,60,0.8)', 'esquerda')
        desenharHUDPontos(personagem.pontos, hudY)

    } else {
        desenharHUDPlayer(personagem,  20, hudY, 'rgba(80,160,255,0.9)', 'esquerda', 'P1', p1Vivo)
        desenharHUDPlayer(personagem2, 600, hudY, 'rgba(255,100,60,0.9)', 'esquerda', 'P2', p2Vivo)
        desenharHUDPontos(getPontos(), hudY)
    }
}

function desenharHUDPlayer(p, vx, vy, corBorda, lado, label, vivo){
    let vw = MODO_2P ? 190 : 170
    let vh = 50

    // se morreu em 2P, fica semitransparente
    des.globalAlpha = (MODO_2P && !vivo) ? 0.35 : 1

    des.fillStyle = 'rgba(0,0,0,0.65)'
    arredondar(des, vx, vy, vw, vh, 12)
    des.fill()
    des.strokeStyle = corBorda
    des.lineWidth = 2
    arredondar(des, vx, vy, vw, vh, 12)
    des.stroke()

    // Label P1/P2
    if(MODO_2P && label){
        des.font = 'bold 10px Arial'
        des.fillStyle = corBorda.replace('0.9','1')
        des.fillText(label, vx + 10, vy + 13)
    }

    // coração + número
    let offsetY = MODO_2P ? 36 : 34
    des.font = 'bold 22px Arial'
    des.fillStyle = '#FF4444'
    des.fillText('♥', vx + 10, vy + offsetY)
    des.font = 'bold 22px Arial'
    des.fillStyle = '#FFFFFF'
    des.fillText(`${p.vida}`, vx + 36, vy + offsetY)

    // corações individuais
    let maxVida = 5
    for(let i = 0; i < maxVida; i++){
        des.font = '12px Arial'
        des.fillStyle = i < p.vida ? '#FF4444' : 'rgba(255,255,255,0.2)'
        des.fillText('♥', vx + 70 + i * 22, vy + offsetY)
    }

    // X morreu
    if(MODO_2P && !vivo){
        des.fillStyle = 'rgba(255,80,80,0.9)'
        des.font = 'bold 13px Arial'
        des.fillText('✖ ELIMINADO', vx + vw/2 - 52, vy + vh/2 + 4)
    }

    des.globalAlpha = 1
}

function desenharHUDPontos(pts, hudY){
    let pw = 200, ph = 50
    let px = 1200 - pw - 20, py = hudY
    des.fillStyle = 'rgba(0,0,0,0.65)'
    arredondar(des, px, py, pw, ph, 12)
    des.fill()
    des.strokeStyle = 'rgba(255,210,0,0.8)'
    des.lineWidth = 2
    arredondar(des, px, py, pw, ph, 12)
    des.stroke()

    des.font = 'bold 22px Arial'
    des.fillStyle = '#FFD700'
    des.fillText('★', px + 14, py + 34)
    des.font = 'bold 24px Arial'
    des.fillStyle = '#FFE866'
    des.fillText(`${pts}`, px + 44, py + 34)
    des.font = '13px Arial'
    des.fillStyle = 'rgba(255,220,80,0.65)'
    des.fillText('pts', px + pw - 38, py + 34)
}

let hudTeclaTimer = 300  // frames
function desenharGuiaTeclas(){
    if(!MODO_2P || hudTeclaTimer <= 0) return
    hudTeclaTimer--

    let alpha = hudTeclaTimer < 60 ? hudTeclaTimer / 60 : 1
    des.globalAlpha = alpha * 0.85

    // P1
    des.fillStyle = 'rgba(0,0,0,0.7)'
    arredondar(des, 20, 80, 160, 44, 8)
    des.fill()
    des.strokeStyle = 'rgba(80,160,255,0.7)'
    des.lineWidth = 1.5
    arredondar(des, 20, 80, 160, 44, 8)
    des.stroke()
    des.fillStyle = 'rgba(80,160,255,0.9)'
    des.font = 'bold 11px Arial'
    des.fillText('P1: W ↑  /  S ↓', 32, 107)

    // P2
    des.fillStyle = 'rgba(0,0,0,0.7)'
    arredondar(des, 600, 80, 160, 44, 8)
    des.fill()
    des.strokeStyle = 'rgba(255,100,60,0.7)'
    des.lineWidth = 1.5
    arredondar(des, 600, 80, 160, 44, 8)
    des.stroke()
    des.fillStyle = 'rgba(255,120,80,0.9)'
    des.font = 'bold 11px Arial'
    des.fillText('P2: ↑ cima  /  ↓ baixo', 612, 107)

    des.globalAlpha = 1
}

// ── GAME OVER / VITÓRIA ──
function desenharGameOver(){
    des.fillStyle = 'rgba(0,0,0,0.65)'
    des.fillRect(0, 0, 1200, 700)

    const pts    = getPontos()
    const vitoria = pts >= 300

    // Em 2P: descobrir quem venceu/perdeu
    let subtitulo = ''
    if(MODO_2P){
        if(vitoria){
            subtitulo = (!p1Vivo && p2Vivo) ? 'P2 chegou até o fim!' :
                        (!p2Vivo && p1Vivo) ? 'P1 chegou até o fim!' :
                        'Ambos venceram!'
        } else {
            subtitulo = 'Ambos eliminados!'
        }
    }

    let cx = 600, cy = 350
    let pw = 560, ph = vitoria || MODO_2P ? 300 : 270
    let px = cx - pw/2, py = cy - ph/2

    // sombra
    des.fillStyle = 'rgba(0,0,0,0.5)'
    arredondar(des, px + 6, py + 6, pw, ph, 22)
    des.fill()

    // painel
    des.fillStyle = 'rgba(12,12,24,0.95)'
    arredondar(des, px, py, pw, ph, 22)
    des.fill()

    // borda
    des.strokeStyle = vitoria ? '#00ff88' : '#FFD700'
    des.lineWidth = 2.5
    arredondar(des, px, py, pw, ph, 22)
    des.stroke()

    des.strokeStyle = vitoria ? 'rgba(0,255,136,0.12)' : 'rgba(255,215,0,0.12)'
    des.lineWidth = 1
    arredondar(des, px + 6, py + 6, pw - 12, ph - 12, 18)
    des.stroke()

    // linha separadora
    des.strokeStyle = vitoria ? 'rgba(0,255,136,0.3)' : 'rgba(255,215,0,0.3)'
    des.lineWidth = 1
    des.beginPath()
    des.moveTo(px + 40, py + 84)
    des.lineTo(px + pw - 40, py + 84)
    des.stroke()

    des.textAlign = 'center'
    des.shadowColor = vitoria ? '#00ff88' : '#FFD700'
    des.shadowBlur = 20
    des.fillStyle = vitoria ? '#00ff88' : '#FFE01B'
    des.font = vitoria ? 'bold 58px Arial' : 'bold 68px Arial'
    des.fillText(vitoria ? 'VOCÊ VENCEU!' : 'GAME OVER', cx, cy - 62)
    des.shadowBlur = 0

    // subtítulo 2P
    if(MODO_2P && subtitulo){
        des.fillStyle = 'rgba(180,180,180,0.7)'
        des.font = '15px Arial'
        des.fillText(subtitulo, cx, cy - 30)
    }

    // pontuação final
    des.fillStyle = 'rgba(200,200,200,0.7)'
    des.font = '18px Arial'
    des.fillText('Pontuação final', cx, cy + 10)

    des.fillStyle = vitoria ? '#00ff88' : '#FFD700'
    des.font = 'bold 32px Arial'
    des.fillText(`${pts}`, cx, cy + 48)

    // placares individuais em 2P
    if(MODO_2P){
        des.font = '13px Arial'
        des.fillStyle = p1Vivo ? 'rgba(80,160,255,0.9)' : 'rgba(120,120,120,0.5)'
        des.fillText(`P1: ${personagem.pontos} pts  ${p1Vivo ? '✔' : '✖'}`, cx - 80, cy + 78)
        des.fillStyle = p2Vivo ? 'rgba(255,100,60,0.9)' : 'rgba(120,120,120,0.5)'
        des.fillText(`P2: ${personagem2.pontos} pts  ${p2Vivo ? '✔' : '✖'}`, cx + 40, cy + 78)
    }

    // estrelas
    let estrelasGanhas = vitoria ? 3 : (pts >= 150 ? 2 : 1)
    let starY = MODO_2P ? cy + 112 : cy + 104
    for(let i = 0; i < 3; i++){
        des.font = i < estrelasGanhas ? 'bold 36px Arial' : '30px Arial'
        des.fillStyle = i < estrelasGanhas
            ? (vitoria ? '#00ff88' : '#FFD700')
            : 'rgba(255,255,255,0.12)'
        des.fillText('★', cx - 54 + i * 54, starY)
    }

    // mensagem
    des.font = '14px Arial'
    des.fillStyle = 'rgba(180,180,180,0.5)'
    des.fillText(
        vitoria ? 'Parabéns! Fase concluída!' : 'Pressione F5 para tentar novamente',
        cx, starY + 40
    )

    des.textAlign = 'left'
    des.shadowBlur = 0
}

// ── LOOP — DESENHAR ──
function desenhar(){

    if(shake > 0){
        des.save()
        des.translate(Math.random()*10-5, Math.random()*10-5)
        shake--
    }

    const pts = getPontos()
    let fundoAtual = imgFundo1
    if(pts >= 201)      fundoAtual = imgFundo3
    else if(pts >= 101) fundoAtual = imgFundo2

    if(fundoCarregado){
        des.drawImage(fundoAtual, 0, 0, 1200, 700)
    } else {
        des.fillStyle = '#1a1a2e'
        des.fillRect(0, 0, 1200, 700)
    }

    if(jogando){

        inimigo1.desenhar()
        carro1.desenhar()
        obstaculo1.desenhar()

        if(vidaItem.ativo)  vidaItem.desenhar()
        if(boostItem.ativo) boostItem.desenhar()
        if(boss.ativo)      boss.desenhar()

        if(p1Vivo) personagem.desenhar()
        if(MODO_2P && p2Vivo) personagem2.desenhar()

        desenharHUD()
        desenharGuiaTeclas()

    } else {
        desenharGameOver()
    }

    if(shake > 0) des.restore()
}

// ── LOOP — ATUALIZAR ──
function atualizar(){

    if(!jogando) return

    // ── P1 ──
    if(p1Vivo){
        personagem.mover()
        personagem.animar()
        personagem.atualizarEstado()

        if(personagem.y < RUA_TOPO)                   personagem.y = RUA_TOPO
        if(personagem.y + personagem.h > RUA_BASE)    personagem.y = RUA_BASE - personagem.h

        // Morreu
        if(personagem.vida <= 0){
            p1Vivo = false
            personagem.dir = 0
            if(!MODO_2P){
                jogando = false
                motor.pause()
                return
            }
        }
    }

    // ── P2 ──
    if(MODO_2P && p2Vivo){
        personagem2.mover()
        personagem2.animar()
        personagem2.atualizarEstado()

        if(personagem2.y < RUA_TOPO)                  personagem2.y = RUA_TOPO
        if(personagem2.y + personagem2.h > RUA_BASE)  personagem2.y = RUA_BASE - personagem2.h

        // Morreu
        if(personagem2.vida <= 0){
            p2Vivo = false
            personagem2.dir = 0
        }
    }

    // Obstáculos sempre se movem
    inimigo1.mover()
    inimigo1.animar()

    carro1.mover()
    carro1.animar()

    obstaculo1.mover()

    vidaItem.mover()
    vidaItem.animar()

    boostItem.mover()
    boostItem.animar()

    boss.mover()
    boss.animar()

    verificarColisoes()
    pontuar()
    atualizarDificuldade()

    // FIM DE JOGO
    const ambosEliminados = !p1Vivo && (!MODO_2P || !p2Vivo)
    const alguemVenceu    = getPontos() >= 300

    if(ambosEliminados || alguemVenceu){
        jogando = false
        motor.pause()
    }
}

function main(){
    des.clearRect(0, 0, 1200, 700)
    desenhar()
    atualizar()
    requestAnimationFrame(main)
}

main()
