class Obj{
    constructor(x,y,w,h,img){
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.img = img
    }

    desenhar(){
        let imagem = new Image()
        imagem.src = this.img
        des.drawImage(imagem, this.x, this.y, this.w, this.h)
    }
}

// PERSONAGEM 
class Personagem extends Obj{

    dir = 0
    velocidadeBase = 10
    velocidadeAtual = 10

    vida = 5
    pontos = 0

    frame = 1
    tempo = 0

    slowTimer = 0
    boostTimer = 0

    trail = []
    danoFlash = 0

    mover(){
        this.y += this.dir * this.velocidadeAtual

        if(this.y < 62) this.y = 62
        if(this.y > 650) this.y = 650
    }

    aplicarSlow(){
        this.velocidadeAtual = 4
        this.slowTimer = 60
    }

    aplicarBoost(){
        this.velocidadeAtual = 16
        this.boostTimer = 80
    }

    tomarDano(){
        this.danoFlash = 10
    }

    atualizarEstado(){

        this.trail.push({x:this.x, y:this.y})
        if(this.trail.length > 10) this.trail.shift()

        if(this.danoFlash > 0) this.danoFlash--

        if(this.slowTimer > 0){
            this.slowTimer--
            return
        }

        if(this.boostTimer > 0){
            this.boostTimer--
            return
        }

        this.velocidadeAtual = this.velocidadeBase
    }

    desenhar(){

        // BOOST
        if(this.boostTimer > 0){
            for(let i=0; i<this.trail.length; i++){
                let t = this.trail[i]
                des.globalAlpha = i / 10
                let img = new Image()
                img.src = this.img
                des.drawImage(img, t.x, t.y, this.w, this.h)
            }
            des.globalAlpha = 1
        }

        // AURA
        if(this.boostTimer > 0){
            des.beginPath()
            des.arc(this.x + this.w/2, this.y + this.h/2, this.w/1.5, 0, Math.PI*2)
            des.fillStyle = "rgba(0,200,255,0.2)"
            des.fill()
        }

        // FLASH
        if(this.danoFlash > 0){
            des.globalAlpha = 0.5
        }

        super.desenhar()
        des.globalAlpha = 1
    }

    colisao(obj){
        let margem = 30

        return (
            this.x + margem < obj.x + obj.w &&
            this.x + this.w - margem > obj.x &&
            this.y + margem < obj.y + obj.h &&
            this.y + this.h - margem > obj.y
        )
    }

    passou(obj){
        return obj.x <= -100
    }

    animar(){
        this.tempo++

        if(this.tempo > 10){
            this.tempo = 0
            this.frame++
        }

        if(this.frame > 2) this.frame = 1

        this.img = `./img/fase1/personagem_00${this.frame}.png`
    }
}


class InimigoAnimado extends Obj{
    vel = 5
    frame = 1
    tempo = 0
    tipo

    constructor(x,y,w,h,tipo){
        super(x,y,w,h,`./img/fase1/${tipo}_001.png`)
        this.tipo = tipo
    }

    animar(){
        this.tempo++
        if(this.tempo > 12){
            this.tempo = 0
            this.frame++
        }
        if(this.frame > 2) this.frame = 1
        this.img = `./img/fase1/${this.tipo}_00${this.frame}.png`
    }

    reiniciar(){
        this.x = 1300 + Math.random() * 300
        let topo = typeof RUA_TOPO !== 'undefined' ? RUA_TOPO : 415
        let base = typeof RUA_BASE !== 'undefined' ? RUA_BASE : 660
        this.y = topo + Math.random() * (base - topo - this.h)
    }

    mover(){
        this.x -= this.vel
        if(this.x <= -200) this.reiniciar()
    }
}

class Obstaculo extends Obj{
    vel = 4

    reiniciar(){
        this.x = 1300 + Math.random() * 300
        let topo = typeof RUA_TOPO !== 'undefined' ? RUA_TOPO : 415
        let base = typeof RUA_BASE !== 'undefined' ? RUA_BASE : 660
        this.y = topo + Math.random() * (base - topo - this.h)
    }

    mover(){
        this.x -= this.vel
        if(this.x <= -200) this.reiniciar()
    }
}

class Coletavel extends Obj{
    vel = 3
    frame = 1
    tempo = 0
    ativo = false
    tempoSpawn = 0
    delaySpawn = 400

    constructor(x,y,w,h){
        super(x,y,w,h,'./img/fase1/vida_001.png')
    }

    animar(){
        this.tempo++
        if(this.tempo > 15){
            this.tempo = 0
            this.frame++
        }
        if(this.frame > 2) this.frame = 1
        this.img = `./img/fase1/vida_00${this.frame}.png`
    }

    reiniciar(){
        this.ativo = false
        this.tempoSpawn = 0
    }

    mover(){
        if(!this.ativo){
            this.tempoSpawn++
            if(this.tempoSpawn > this.delaySpawn){
                this.ativo = true
                this.x = 1300
                let topo = typeof RUA_TOPO !== 'undefined' ? RUA_TOPO : 415
                let base = typeof RUA_BASE !== 'undefined' ? RUA_BASE : 660
                this.y = topo + Math.random() * (base - topo - this.h)
            }
            return
        }

        this.x -= this.vel
        if(this.x <= -200) this.reiniciar()
    }
}

class Boost extends Coletavel{
    constructor(x,y,w,h){
        super(x,y,w,h)
        this.img = './img/fase1/boost_001.png'
    }

    animar(){
        this.tempo++
        if(this.tempo > 12){
            this.tempo = 0
            this.frame++
        }
        if(this.frame > 2) this.frame = 1
        this.img = `./img/fase1/boost_00${this.frame}.png`
    }
}

class Boss extends Obj{
    vel = 7
    frame = 1
    tempo = 0
    ativo = false
    tempoSpawn = 0
    proximoSpawn = this.gerarTempo()

    constructor(x,y,w,h){
        super(x,y,w,h,'./img/fase1/boss1_001.png')
    }

    gerarTempo(){
        return Math.floor(Math.random() * (2800 - 2400) + 2400)
    }

    animar(){
        this.tempo++
        if(this.tempo > 10){
            this.tempo = 0
            this.frame++
        }
        if(this.frame > 2) this.frame = 1
        this.img = `./img/fase1/boss1_00${this.frame}.png`
    }

    reiniciar(){
        this.ativo = false
        this.tempoSpawn = 0
        this.proximoSpawn = this.gerarTempo()
    }

    mover(){
        if(!this.ativo){
            this.tempoSpawn++
            if(this.tempoSpawn > this.proximoSpawn){
                this.ativo = true
                this.x = 1300
                let topo = typeof RUA_TOPO !== 'undefined' ? RUA_TOPO : 415
                let base = typeof RUA_BASE !== 'undefined' ? RUA_BASE : 660
                this.y = topo + Math.random() * (base - topo - this.h)
            }
            return
        }

        this.x -= this.vel
        if(this.x <= -200) this.reiniciar()
    }
}

class Text{
    desenhar(text,x,y,cor,font){
        des.fillStyle = cor
        des.font = font
        des.fillText(text,x,y)
    }
}