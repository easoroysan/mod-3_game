class PlayableCharacter extends Character{
        
    static all = []

    constructor(x,y){

        //used full path so animation comparisons will work
        super(x,y,'file:///Users/flatironschool/Desktop/mod-3_game/frontend/animations/knight')

        PlayableCharacter.all.push(this)

        //health for player
        this.health = 5
        this.healthBar = c('img')
        this.healthBar.id = "player-health"
        this.healthBar.src = `/Users/flatironschool/Desktop/mod-3_game/frontend/animations/HP/HP_Value_${this.health}.png`

        //determines if player is invincible/hurt
        this.invincible = false
        this.isHurt = false

        //will slash up on game start when slash button is pressed
        this.idleDirection = 'Up'

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
            if(this.downkey == ' '){
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

            //checks for animation after slash is complete
            if(this.upkey !== ' ' && this.upkey){
                this.idleDirection = this.upkey.slice(5)
                this.slashCheck = false
            }

        })
    }

    render(){
        document.body.append(this.element)
        document.body.append(this.healthBar)
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

        setTimeout( ()=>{
            // boolean to say slash animation is finished
            this.finishSlash = true

            // put idle checks for if the player was idle before slash animation starts
            if(this.element.src === `${this.ASSET_ROOT}/idle.gif`){
                idleCheck = true
            }

            //checks if player moved direction before slash animation was complete
            if(this.slashCheck && !idleCheck){
                this.element.src = `${this.ASSET_ROOT}/run${direction}.gif`
            // checks if player stopped moving before slash animation was complete
            }else if(idleCheck){
                this.element.src = `${this.ASSET_ROOT}/idle.gif`
            }

            //turns off hitbox at the end of the 200 milliseconds
            this.hitDirection = null
        },200)
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
                this.isHurt = false
            },100)
            setTimeout(()=>{
                this.hitEffect(false)
            },1000)
        }
        
    }

    hitEffect(over = true){
        if(over){
            this.health --
            this.healthBar.src = `/Users/flatironschool/Desktop/mod-3_game/frontend/animations/HP/HP_Value_${this.health}.png`
            this.invincible = true
            if(this.health <= 0){
                this.dead = true
                this.stop()
            }else{
                this.element.style.animation = 'shake 1s'
                this.element.style.backgroundColor = "#FFA50070"
                this.isHurt = true
            }
            
        }else{
            this.element.style.animation = 'none'
            this.element.style.backgroundColor = "transparent"
            this.invincible = false
        }
    }

}