class Monster extends Character{
    static healthPosition = 5
    static all = []

    constructor(x,y,ROOT_URL){
        super(x,y,ROOT_URL)

        Monster.all.push(this)

        //makes health bar for each monster
        this.healthBar = c('progress')
        //start with 100 hp
        this.healthBar.max = 100
        this.healthBar.value = 100

        //puts to top right in order
        this.healthBar.style.top = Monster.healthPosition

        //labels the health
        this.healthCount = 100
        this.healthBar.setAttribute('health-count',`${this.healthCount}`)
        Monster.healthPosition = Monster.healthPosition + 20

        //speed is slower than normal when walking around
        this.speed = 2

        //makes monster go in random directions every second
        setInterval(()=>{

            const left = parseInt(this.element.style.left)
            const bottom = parseInt(this.element.style.bottom)

            const directionsArray = ['Up','Down','Left','Right']
            let rand = directionsArray[Math.floor(Math.random() * directionsArray.length)]

            if(rand === 'Up'){
                this.element.direction = [null,null]
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

    hurtbox(){
        let leftBorder = parseInt(this.element.style.left) + 25
        let rightBorder = parseInt(this.element.style.left) + 55
        let topBorder = parseInt(this.element.style.bottom) + 75
        let bottomBorder = parseInt(this.element.style.bottom)

        return [leftBorder,rightBorder,topBorder,bottomBorder]
    }

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

    hitstun(direction){

        this.element.style.backgroundColor = "red"
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
            this.healthBar.value --
            this.healthCount --
            this.healthBar.setAttribute('health-count',`${this.healthCount}`)

            if(this.healthBar.value == 0){
                this.element.remove()
                this.healthBar.remove()
            }
        },100)

        setTimeout(()=>{
            this.speed = 2
            this.stop()
        },300)
    }
}