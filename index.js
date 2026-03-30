let canvas = document.getElementById('des')
let des = canvas.getContext('2d')

// LIMITES DA RUA (área cinza do background)
const RUA_TOPO = 340      // onde a rua começa (y)
const RUA_BASE = 620      // onde a rua termina (y)

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

// LOOP — DESENHAR
function desenhar(){

    if(shake > 0){
        des.save()
        des.translate(Math.random()*10-5, Math.random()*10-5)
        shake--
    }

    // FUNDO — muda conforme os pontos
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

        txtPontos.desenhar(`Pontos: ${personagem.pontos}`, 900, 40, 'yellow', '26px Arial')
        txtVida.desenhar(`Vida: ${personagem.vida}`, 40, 40, 'red', '26px Arial')

    } else {
        des.fillStyle = 'rgba(0,0,0,0.5)'
        des.fillRect(0, 0, 1200, 700)

        if(personagem.pontos >= 300){
            txtPontos.desenhar('VOCÊ VENCEU!', 370, 360, '#00ff88', '70px Arial')
        } else {
            txtPontos.desenhar('GAME OVER', 430, 360, 'yellow', '70px Arial')
        }

        txtPontos.desenhar(`Pontos: ${personagem.pontos}`, 480, 440, 'white', '30px Arial')
    }

    if(shake > 0) des.restore()
}

// LOOP — ATUALIZAR
function atualizar(){

    if(!jogando) return

    personagem.mover()
    personagem.animar()
    personagem.atualizarEstado()

    // limita personagem à rua
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

    // FIM DE JOGO — derrota ou vitória
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