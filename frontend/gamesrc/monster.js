class Monster extends Character{
    static healthPosition = 15
    static healthPositionChange = false
    static all = []

    constructor(x,y,hp){
        super(x,y,`${animationURL}/monster`)

        Monster.all.push(this)

        //makes health bar for each monster
        this.healthBar = c('progress')
        //start with whatever hp is passed
        this.healthBar.max = hp
        this.healthBar.value = hp

        //puts to top right in order
        this.healthBar.style.top = Monster.healthPosition
        //lowers next health bar for next monster created
        //will keep lowering until 10 monsters are created. then goes back up
        if(!Monster.healthPositionChange){
            Monster.healthPosition = Monster.healthPosition + 20
            if(Monster.healthPosition >= 190){
                Monster.healthPositionChange = true
                Monster.healthPosition = Monster.healthPosition - 10
            }
        }else{
            Monster.healthPosition = Monster.healthPosition - 20
            if(Monster.healthPosition <= 5){
                Monster.healthPositionChange = false
            }
        }

        //labels the health
        this.healthCount = this.healthBar.value
        this.healthBar.setAttribute('health-count',`${this.healthCount}`)

        //speed is slower than normal when walking around
        this.speed = 2

        // makes monster go in random directions every second
        setInterval(()=>{

            const left = parseInt(this.element.style.left)
            const bottom = parseInt(this.element.style.bottom)

            //picks random direction each interval
            const directionsArray = ['Up','Down','Left','Right']
            let rand = directionsArray[Math.floor(Math.random() * directionsArray.length)]

            if(rand === 'Up'){
                this.element.direction = [null,null]
                //boolean to check if monster is running against a wall
                if ( document.documentElement.clientHeight >= (bottom+240) ){
                    this.runUp()
                }else{
                    this.runDown()
                }
            }
            if(rand === 'Down'){
                this.element.direction = [null,null]
                if ( bottom - 10 > 0 ){
                    this.runDown()
                }else{
                    this.runUp()
                }
                
            }
            if(rand === 'Left'){
                this.element.direction = [null,null]
                if( left+10 > 0 ){
                    this.runLeft()
                }else{
                    this.runRight()
                }
            }
            if(rand === 'Right'){
                this.element.direction = [null,null]
                if( document.documentElement.clientWidth >= (left+80) ){
                    this.runRight()
                }else{
                    this.runLeft()
                }
                
            }

        },1000)



    }

    render(){
        document.body.append(this.healthBar)
        document.body.append(this.element)
    }

    //hitbox for monster
    hitbox(){
        let leftBorder = parseInt(this.element.style.left) + 10
        let rightBorder = parseInt(this.element.style.left) + 65
        let topBorder = parseInt(this.element.style.bottom) + 55
        let bottomBorder = parseInt(this.element.style.bottom) + 20

        return [leftBorder,rightBorder,topBorder,bottomBorder]
    }

    //hurtbox for monster
    hurtbox(){
        let leftBorder = parseInt(this.element.style.left)
        let rightBorder = parseInt(this.element.style.left) + 75
        let topBorder = parseInt(this.element.style.bottom) + 55
        let bottomBorder = parseInt(this.element.style.bottom) + 20

        return [leftBorder,rightBorder,topBorder,bottomBorder]
    }

    //checks if hitbox of player touches hurtbox of monster
    hurt(player){
        let hitbox = player.hitbox(player.hitDirection)

        let swordLeft = hitbox[0]
        let swordRight = hitbox[1]
        let swordUp = hitbox[2]
        let swordDown = hitbox[3]

        let selfLeft = this.hurtbox()[0]
        let selfRight = this.hurtbox()[1]
        let selfUp = this.hurtbox()[2]
        let selfDown = this.hurtbox()[3]

        if(swordRight >= selfLeft && swordLeft <= selfRight){
            if(swordUp >= selfDown && swordDown <= selfUp){
                this.hitstun(player.hitDirection)
            } 
        }
    }

    //what monster does when hit
    hitstun(direction){

        //shows when monster is hit
        this.element.style.backgroundColor = "#FF000080"

        //decreases health
        this.healthBar.value --
        this.healthCount --
        this.healthBar.setAttribute('health-count',`${this.healthCount}`)

        //if health reaches 0, monster is removed
        if(this.healthBar.value <= 0){
            this.dead = true
            this.healthBar.remove()
            this.element.remove()
            this.element.style = ""
        }

        //makes monster run in direction he was hit
        setTimeout(()=>{
            this.element.style.backgroundColor = "transparent"
            if(direction == 'Right'){
                this.speed = 8
                this.runRight()
            }
            if(direction == 'Left'){
                this.speed = 8
                this.runLeft()
            }
            if(direction == 'Up'){
                this.speed = 8
                this.runUp()
            }
            if(direction == 'Down'){
                this.speed = 8
                this.runDown()
            }

        },100)

        //puts speed back to normal and stops monster for a moment
        setTimeout(()=>{
            this.speed = 2
            this.stop()
        },300)
    }

}