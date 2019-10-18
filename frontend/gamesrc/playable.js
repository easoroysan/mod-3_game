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

            //checks for animation after slash is complete
            //this ensures player is not stuck in slash animation when changing direction
            this.slashCheck = false

            //save downkey to check how to stop on up keys
            this.downkey = e.key
            if(this.dead){
                this.downkey = null
            }
            

            if(event.repeat){
                return
            }

            if(this.downkey == 'ArrowUp'){
                this.runUp()
            }
            if(this.downkey == 'ArrowDown'){
                this.runDown()
            }
            if(this.downkey == 'ArrowLeft'){
                this.runLeft()
            }
            if(this.downkey == 'ArrowRight'){
                this.runRight()
            }
            if(this.downkey == ' ' && !this.element.src.includes("slash")){
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
                if(this.element.direction[0] == null){
                    this.stop()
                }else{
                    this.stop_x()
                }
            }else if( (this.upkey == 'ArrowUp' && this.downkey != 'ArrowDown') || (this.upkey == 'ArrowDown' && this.downkey != 'ArrowUp') ){
                if(this.element.direction[1] == null){
                    this.stop()
                }else{
                    this.stop_y()
                }
            }

            //checks for direction to use for slashing when idle
            if(this.upkey !== ' ' && this.upkey){
                this.idleDirection = this.upkey.slice(5)
                this.slashCheck = false
            }

        })
    }

    render(){
        document.body.append(this.element,this.healthBar,this.defenseBar)
    }


    // slashes is whichever direction player is facing or was last facing
    slash(){
        if(this.directionCheck('Right')){
            this.slashanimation('Right')
        }
        if(this.directionCheck('Left')){
            this.slashanimation('Left')
        }
        if(this.directionCheck('Up')){
            this.slashanimation('Up')
        }
        if(this.directionCheck('Down')){
            this.slashanimation('Down')
        }
        if(this.element.src === `${this.ASSET_ROOT}/idle.gif`){
            let string = this.upkey
            this.slashanimation(string.slice(5))
        }
    }

    // boolean statement to see what direction the character was facing
    directionCheck(direction){
        return this.element.src === `${this.ASSET_ROOT}/run${direction}.gif` || this.element.src === `${this.ASSET_ROOT}/slash${direction}.gif`
    }

    //animation for slash
    slashanimation(direction){
        this.slashCheck = true

        // put idle checks for if the player was idle before slash animation starts
        let idleCheck = false
        if(this.element.src === `${this.ASSET_ROOT}/idle.gif`){
            idleCheck = true
            direction = this.idleDirection
        }

        // boolean to say that slash animation is not finished
        this.finishSlash = false
        this.element.src = `${this.ASSET_ROOT}/slash${direction}.gif`

        // set hit direction of sword for sword hitbox
        this.hitDirection = direction
        this.hitbox()

        if(!this.dead){
            setTimeout( ()=>{
                // boolean to say slash animation is finished
                this.finishSlash = true
                
                // put idle checks for if the player was idle before slash animation starts
                if(this.element.src === `${this.ASSET_ROOT}/idle.gif`){
                    idleCheck = true
                }
                
                //checks if player moved direction before slash animation was complete
                if(this.slashCheck && !idleCheck && !this.dead){
                    this.element.src = `${this.ASSET_ROOT}/run${direction}.gif`
                
                // checks if player stopped moving before slash animation was complete
                }else if(idleCheck && !this.dead){
                    this.element.src = `${this.ASSET_ROOT}/idle.gif`
                }else if(this.dead){
                    this.element.src = `${this.ASSET_ROOT}/death.gif`
                }else{
                    this.element.src = this.storedAnimation
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

    //displays defense as falshing if 5 or normal if anything else. if reducing, will reduce defense.
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