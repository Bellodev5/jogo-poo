let canvas = document.getElementById('des')
let des = canvas.getContext('2d')

// LIMITES DA RUA (área cinza do background)
const RUA_TOPO = 340      // onde a rua começa (y)
const RUA_BASE = 680      // onde a rua termina (y)

// PLAYER — nasce no meio da rua
let personagem = new Personagem(120, RUA_TOPO + 50, 70, 110)

// INIMIGOS
let inimigo1 = new InimigoAnimado(1300, RUA_TOPO + 20, 70, 110, 'inimigo')

// CARROS 
let carro1 = new InimigoAnimado(1500, RUA_TOPO + 80, 160, 80, 'carro1')

// OBSTÁCULOS
let obstaculo1 = new Obstaculo(1900, RUA_TOPO + 30, 40, 40, './img/fase1/obstaculo1.png')

// ITENS
let vidaItem = new Coletavel(1700, RUA_TOPO + 100, 40, 40)
let boostItem = new Boost(1800, RUA_TOPO + 60, 40, 40)

// BOSS
let boss = new Boss(2000, RUA_TOPO + 80, 140, 100)

let txtPontos = new Text()
let txtVida = new Text()

// SONS
let motor = new Audio('./audio/fase1/motor.wav')
let batida = new Audio('./audio/fase1/batida.wav')
let somPersonagem = new Audio('./audio/fase1/shadow.wav')
let somCarro = new Audio('./audio/fase1/batida.mp3')
let somObstaculo = new Audio('./audio/fase1/obstaculo.wav')
let coletarSom = new Audio('./audio/fase1/coletar.wav')
let somBoost = new Audio('./audio/fase1/boost.wav')
let somBoss = new Audio('./audio/fase1/boss.wav')

motor.loop = true

let jogando = true
let nivelDificuldade = 1
let shake = 0

// FUNDOS
let imgFundo1 = new Image()
let imgFundo2 = new Image()
let imgFundo3 = new Image()
let fundoCarregado = false

imgFundo1.onload = () => fundoCarregado = true
imgFundo1.src = './img/fase1/fundo.png'
imgFundo2.src = './img/fase1/fundo2.png'
imgFundo3.src = './img/fase1/fundo3.png'

// RESIZE — canvas sempre ocupa a tela sem acumular bordas
function redimensionar(){
    canvas.style.width  = window.innerWidth  + 'px'
    canvas.style.height = window.innerHeight + 'px'
}
window.addEventListener('resize', redimensionar)
redimensionar()

// CONTROLES
document.addEventListener('keydown', (e) => {
    motor.play()
    if (e.key === 'w' || e.key === 'ArrowUp')   personagem.dir = -1
    if (e.key === 's' || e.key === 'ArrowDown')  personagem.dir = 1
})

document.addEventListener('keyup', () => {
    personagem.dir = 0
})

// DIFICULDADE
function atualizarDificuldade(){
    let novoNivel = Math.floor(personagem.pontos / 15) + 1

    if(novoNivel > nivelDificuldade){
        nivelDificuldade = novoNivel

        inimigo1.vel  += 0.5
        carro1.vel    += 0.6
        obstaculo1.vel += 0.4
        boss.vel      += 0.8

        vidaItem.delaySpawn  -= 20
        boostItem.delaySpawn -= 20
    }
}

// COLISÕES
function verificarColisoes(){

    if(personagem.colisao(inimigo1)){
        somPersonagem.play()
        personagem.vida--
        personagem.tomarDano()
        inimigo1.reiniciar()
        shake = 10
    }

    if(personagem.colisao(carro1)){
        somCarro.play()
        personagem.vida--
        personagem.tomarDano()
        carro1.reiniciar()
        shake = 10
    }

    if(personagem.colisao(obstaculo1)){
        somObstaculo.play()
        personagem.aplicarSlow()
        obstaculo1.reiniciar()
        shake = 3
    }

    if(vidaItem.ativo && personagem.colisao(vidaItem)){
        coletarSom.play()
        personagem.vida++
        vidaItem.reiniciar()
    }

    if(boostItem.ativo && personagem.colisao(boostItem)){
        somBoost.play()
        personagem.aplicarBoost()
        boostItem.reiniciar()
    }

    if(boss.ativo && personagem.colisao(boss)){
        somBoss.play()
        personagem.vida -= 3
        personagem.tomarDano()
        boss.reiniciar()
        shake = 40
    }
}

// PONTOS
function pontuar(){
    let objs = [inimigo1, carro1]
    objs.forEach(obj => {
        if(personagem.passou(obj)){
            personagem.pontos += 10
            obj.reiniciar()
        }
    })
}

// helper para retângulos arredondados
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
let vidaScore = new Image()
vidaScore.src = `./img/fase1/vidaScore.png`

function desenharHUD(){
    let hudY = 20

    // --- VIDAS (esquerda) ---
    let vx = 20, vy = hudY, vw = 170, vh = 50

    // FUNDO
    des.fillStyle = 'rgba(0,0,0,0.65)'
    arredondar(des, vx, vy, vw, vh, 12)
    des.fill()

    // BORDA
    des.strokeStyle = 'rgba(255,60,60,0.8)'
    des.lineWidth = 2
    arredondar(des, vx, vy, vw, vh, 12)
    des.stroke()

    // IMAGEM (vida)
    if (vidaScore.complete) {
        des.drawImage(vidaScore, vx + 12, vy + 10, 24, 24)
    }

    // TEXTO VIDA
    des.font = 'bold 24px Arial'
    des.fillStyle = '#FFFFFF'
    des.fillText(`${personagem.vida}`, vx + 42, vy + 34)

    // CORAÇÕES
    let maxVida = 5
    for(let i = 0; i < maxVida; i++){
        des.font = '14px Arial'
        des.fillStyle = i < personagem.vida ? '#FF4444' : 'rgba(255,255,255,0.2)'
        des.fillText('♥', vx + 84 + i * 17, vy + 34)
    }

    // --- PONTOS (direita) ---
    let pw = 200, ph = 50
    let px = 1200 - pw - 20, py = hudY

    // FUNDO
    des.fillStyle = 'rgba(0,0,0,0.65)'
    arredondar(des, px, py, pw, ph, 12)
    des.fill()

    // BORDA
    des.strokeStyle = 'rgba(255,210,0,0.8)'
    des.lineWidth = 2
    arredondar(des, px, py, pw, ph, 12)
    des.stroke()

    // ÍCONE ESTRELA
    des.font = 'bold 22px Arial'
    des.fillStyle = '#FFD700'
    des.fillText('★', px + 14, py + 34)

    // PONTOS
    des.font = 'bold 24px Arial'
    des.fillStyle = '#FFE866'
    des.fillText(`${personagem.pontos}`, px + 44, py + 34)

    // "pts"
    des.font = '13px Arial'
    des.fillStyle = 'rgba(255,220,80,0.65)'
    des.fillText('pts', px + pw - 38, py + 34)
}

function desenharGameOver(){
    des.fillStyle = 'rgba(0,0,0,0.65)'
    des.fillRect(0, 0, 1200, 700)

    let vitoria = personagem.pontos >= 300
    let cx = 600, cy = 350

    let pw = 520, ph = 270
    let px = cx - pw/2, py = cy - ph/2

    des.fillStyle = 'rgba(0,0,0,0.5)'
    arredondar(des, px + 6, py + 6, pw, ph, 22)
    des.fill()

    des.fillStyle = 'rgba(12,12,24,0.95)'
    arredondar(des, px, py, pw, ph, 22)
    des.fill()

    des.strokeStyle = vitoria ? '#00ff88' : '#FFD700'
    des.lineWidth = 2.5
    arredondar(des, px, py, pw, ph, 22)
    des.stroke()

    des.strokeStyle = vitoria ? 'rgba(0,255,136,0.12)' : 'rgba(255,215,0,0.12)'
    des.lineWidth = 1
    arredondar(des, px + 6, py + 6, pw - 12, ph - 12, 18)
    des.stroke()

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
    des.fillText(vitoria ? 'VOCÊ VENCEU!' : 'GAME OVER', cx, cy - 60)
    des.shadowBlur = 0

    des.fillStyle = 'rgba(200,200,200,0.7)'
    des.font = '18px Arial'
    des.fillText('Pontuação final', cx, cy + 12)

    des.fillStyle = vitoria ? '#00ff88' : '#FFD700'
    des.font = 'bold 32px Arial'
    des.fillText(`${personagem.pontos}`, cx, cy + 50)

    let estrelasGanhas = vitoria ? 3 : (personagem.pontos >= 150 ? 2 : 1)
    for(let i = 0; i < 3; i++){
        des.font = i < estrelasGanhas ? 'bold 36px Arial' : '30px Arial'
        des.fillStyle = i < estrelasGanhas
            ? (vitoria ? '#00ff88' : '#FFD700')
            : 'rgba(255,255,255,0.12)'
        des.fillText('★', cx - 54 + i * 54, cy + 104)
    }

    des.font = '14px Arial'
    des.fillStyle = 'rgba(180,180,180,0.5)'
    des.fillText(
        vitoria ? 'Parabéns! Fase concluída!' : 'Pressione F5 para tentar novamente',
        cx, cy + 118
    )

    des.textAlign = 'left'
    des.shadowBlur = 0
}

// LOOP — DESENHAR
function desenhar(){

    if(shake > 0){
        des.save()
        des.translate(Math.random()*10-5, Math.random()*10-5)
        shake--
    }

    let fundoAtual = imgFundo1
    if(personagem.pontos >= 201)      fundoAtual = imgFundo3
    else if(personagem.pontos >= 101) fundoAtual = imgFundo2

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

        personagem.desenhar()

        desenharHUD()

    } else {
        desenharGameOver()
    }

    if(shake > 0) des.restore()
}

// LOOP — ATUALIZAR
function atualizar(){

    if(!jogando) return

    personagem.mover()
    personagem.animar()
    personagem.atualizarEstado()

    if(personagem.y < RUA_TOPO)                    personagem.y = RUA_TOPO
    if(personagem.y + personagem.h > RUA_BASE)     personagem.y = RUA_BASE - personagem.h

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

    if(personagem.vida <= 0 || personagem.pontos >= 300){
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