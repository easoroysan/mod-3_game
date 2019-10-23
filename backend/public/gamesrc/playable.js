class PlayableCharacter extends Character{
        
    static all = []

    constructor(x,y,health){

        super(x,y,`${animationURL}/knight`)

        PlayableCharacter.all.push(this)

        //health for player
        this.health = health
        this.healthBar = c('img')
        this.healthBar.id = "player-health"
        this.reduceHealth(false)

        //defense count for player
        this.defense = 5
        this.defenseBar = c('img')
        this.defenseBar.id = "player-defense"
        this.reduceDefense(false)

        //determines if player is invincible/hurt
        this.invincible = false

        //will slash up on game start when slash button is pressed
        this.upkey = "ArrowUp"
        this.idleDirection = 'up'

        //recording keyboard inputs
        document.addEventListener('keydown', (e)=> {

            //save downkey to check how to stop on up keys
            if(e.key.includes('Arrow')){
                this.downkey = e.key
            }

            if(this.dead){
                this.downkey = null
            }
            

            if(event.repeat){
                return
            }

            if(e.key == 'ArrowUp'){
                this.runUp()
            }
            if(e.key == 'ArrowDown'){
                this.runDown()
            }
            if(e.key == 'ArrowLeft'){
                this.runLeft()
            }
            if(e.key == 'ArrowRight'){
                this.runRight()
            }
            if(e.key == ' ' && !this.element.src.includes("slash")){
                this.slash()
            }
        })

        //stops if no key is pressed
        document.addEventListener('keyup',(e)=>{
            
            this.upkey = e.key
            if(this.dead){
                this.upkey = null
            }
            // logic to move in diagonal directions
            // also, if left/right is pressed down before right/left is lifted up, won't stop the character
            if( (this.upkey == 'ArrowLeft' && this.downkey != 'ArrowRight') || (this.upkey == 'ArrowRight' && this.downkey != 'ArrowLeft') ){
                if(this.element.direction[1] == null){
                    this.stop()
                }else{
                    this.stop_x()
                }
            }else if( (this.upkey == 'ArrowUp' && this.downkey != 'ArrowDown') || (this.upkey == 'ArrowDown' && this.downkey != 'ArrowUp') ){
                if(this.element.direction[0] == null){
                    this.stop()
                }else{
                    this.stop_y()
                }
            }

            //checks for direction to use for slashing when idle
            if(this.upkey !== ' ' && this.upkey.includes('Arrow')){
                this.idleDirection = this.upkey.slice(5)
            }

        })
    }

    render(){
        document.body.append(this.element,this.healthBar,this.defenseBar)
    }


    // slashes is whichever direction player is walking or the last direction that was let go (prioritize left or right)
    slash(){
        if(this.element.direction[0]){
            this.slashanimation(this.element.direction[0])
        }
        else if(this.element.direction[1]){
            this.slashanimation(this.element.direction[1])
        }
        else{
            this.slashanimation(this.idleDirection)
        }
    }

    //animation for slash
    slashanimation(direction){

        // set hit and animation direction of sword for sword hitbox
        this.element.src = `${this.ASSET_ROOT}/slash${direction}.gif`
        this.hitDirection = direction
        this.hitbox(this.hitDirection)

        if(!this.dead){
            setTimeout( ()=>{
                // will put player in death animation if they were killed while slashing
                if(this.dead){
                    this.element.src = `${this.ASSET_ROOT}/death.gif`
                }
                // checks if player is moving left or right
                else if(this.element.direction[0]){
                    this.element.src = `${this.ASSET_ROOT}/run${this.element.direction[0]}.gif`
                
                // checks if player is moving up or down
                }else if(this.element.direction[1]){
                    this.element.src = `${this.ASSET_ROOT}/run${this.element.direction[1]}.gif`

                // puts player in idle animation if not moving and still alive
                }else{
                    this.element.src = `${this.ASSET_ROOT}/idle.gif`
                }
                
                //turns off hitbox at the end of the 200 milliseconds
                this.hitDirection = null
            },200)
        }
    }

    hitbox(direction){
        let leftBorder = null
        let rightBorder = null
        let topBorder = null
        let bottomBorder = null

        if(direction == 'Right'){
            leftBorder = parseInt(this.element.style.left) + 40
            rightBorder = parseInt(this.element.style.left) + 90
            topBorder = parseInt(this.element.style.bottom) + 60
            bottomBorder = parseInt(this.element.style.bottom) + 10
        }
        if(direction == 'Left'){
            leftBorder = parseInt(this.element.style.left) - 15
            rightBorder = parseInt(this.element.style.left) + 35
            topBorder = parseInt(this.element.style.bottom) + 60
            bottomBorder = parseInt(this.element.style.bottom) + 10
        }
        if(direction == 'Up'){
            leftBorder = parseInt(this.element.style.left)
            rightBorder = parseInt(this.element.style.left) + 75
            topBorder = parseInt(this.element.style.bottom) + 90
            bottomBorder = parseInt(this.element.style.bottom) + 50
        }
        if(direction == 'Down'){
            leftBorder = parseInt(this.element.style.left)
            rightBorder = parseInt(this.element.style.left) + 75
            topBorder = parseInt(this.element.style.bottom) + 35
            bottomBorder = parseInt(this.element.style.bottom) - 15
        }

        return [leftBorder,rightBorder,topBorder,bottomBorder]

    }

    hurtbox(){
        let leftBorder = parseInt(this.element.style.left) + 30
        let rightBorder = parseInt(this.element.style.left) + 45
        let topBorder = parseInt(this.element.style.bottom) + 60
        let bottomBorder = parseInt(this.element.style.bottom) + 20

        if(this.invincible){
            return [null,null,null,null]
        }else{
            return [leftBorder,rightBorder,topBorder,bottomBorder]
        }
    }

    hurt(monster){
        let monsterLeft = monster.hitbox()[0]
        let monsterRight = monster.hitbox()[1]
        let monsterUp = monster.hitbox()[2]
        let monsterDown = monster.hitbox()[3]

        let selfLeft = this.hurtbox()[0]
        let selfRight = this.hurtbox()[1]
        let selfUp = this.hurtbox()[2]
        let selfDown = this.hurtbox()[3]

        if(monsterRight >= selfLeft && monsterLeft <= selfRight){
            if(monsterUp >= selfDown && monsterDown <= selfUp){
                this.hitstun()
            } 
        }
    }

    hitstun(){
        this.hitEffect()
        if(!this.dead){
            setTimeout(()=>{
                this.hitEffect(false)
            },1000)
        }
        
    }

    hitEffect(over = true){
        if(over){
            if(this.defense <=0){
                this.reduceHealth()
            }else{
                this.reduceDefense()
            }
            this.invincible = true
            if(this.health <= 0){
                this.gameOver()
            }else{
                this.element.style.animation = 'shake 1s'
                this.element.style.backgroundColor = "#FFA50070"
            }
            
        }else{
            this.element.style.animation = 'none'
            this.element.style.backgroundColor = "transparent"
            this.invincible = false
        }
    }

    //displays health as falshing if 1 or normal if anything else. if reducing, will reduce health.
    reduceHealth(reduce = true){
        if(reduce){
            this.health--
        }
        if(this.health == 1){
            this.healthBar.src = this.ASSET_ROOT + `/HP/Value_1.gif`
        }else{
            this.healthBar.src = this.ASSET_ROOT + `/HP/Value_${this.health}.png`
        }
    }

    //displays defense as flashing if 5 or normal if anything else. if reducing, will reduce defense.
    reduceDefense(reduce = true){
        if(reduce){
            this.defense--
        }
        if(this.defense == 5){
            this.defenseBar.src = this.ASSET_ROOT + `/defense/Value_5.gif`
        }else{
            this.defenseBar.src = this.ASSET_ROOT + `/defense/Value_${this.defense}.png`
        }
    }

    gameOver(){
        this.dead = true
        this.stop()
        this.element.src = `${this.ASSET_ROOT}/death.gif`
    }

}