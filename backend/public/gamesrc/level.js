class Level{

    //keeps track of time
    static time

    constructor(savefile){

        //clears out any monsters or bosses that were created before
        Monster.all = []
        Boss.all = []

        this.savefile = savefile

        //checks to make sure savefile is not greater than 20
        if(this.savefile.level > 20){
            this.savefile.level = 20
        }

        //sets start time
        Level.time = this.savefile.time
        this.tracker = c('h3')
        this.tracker.id = "time-tracker"
        this.tracker.innerText = `Time: ${Level.time}`
        document.body.append(this.tracker)

        //shows what level player is on
        let showLevel = c('h3')
        showLevel.id = "show-level"
        showLevel.innerText = `Level: ${savefile.level}`
        document.body.append(showLevel)

        //resets monster health bar positions
        Monster.healthPosition = 15
        Boss.healthPosition = 15
        Monster.healthPositionChange = false
        Boss.healthPositionChange = false

        //loads player with proper health
        this.player = new PlayableCharacter(30,60,savefile.health)
        this.player.render()

        //load directions if player is starting level 1
        if(savefile.level == 1){
            this.directions()
        }

        //creates monsters based on level number
        for (let i = 0; i < this.savefile.level; i++) {
            //health of monsters will increase after every 5 levels
            //levels 1-5: 20hp, 6-10 40hp, 11-15 60hp, 16-20 80hp
            let health = 20 * (parseInt((this.savefile.level-1)/5)+1)
            let slimemonster = new Monster(500,500,health)
            slimemonster.render()

            //checks if monster is hit by sword or player is hit by monster every 20 ms
            setInterval( ()=>{
                slimemonster.hurt(this.player)
                this.player.hurt(slimemonster)
            },20)

        }

        //creates 1 more boss monster every 5 levels.
        for (let i = 0; i < parseInt(this.savefile.level/5); i++) {
            let skullBoss = new Boss(600,500)
            skullBoss.render()

            setInterval( ()=>{
                skullBoss.hurt(this.player)
                this.player.hurt(skullBoss)
            },20)
        }



        let interval = setInterval(()=>{
            Level.time ++
            this.tracker.innerText = `Time: ${Level.time}`
            let monsterCheck = Monster.all.filter( (monster)=> monster.dead )
            let bossCheck = Boss.all.filter( (boss)=> boss.dead )
            if(this.player.dead){
                this.player.gameOver()
                setTimeout(()=>{
                    //puts status box with defeat text and options
                    this.defeat()
                },3000)

                //ends setInterval
                clearInterval(interval)

            }else if(monsterCheck.length == Monster.all.length && bossCheck.length == Boss.all.length && Monster.all.length !== 0){
                //stops player from moving
                this.player.stop()

                //puts status box with victory
                this.victory()
                
                //ends setInterval
                clearInterval(interval)
            }

        },20)
    }

    directions(){
        //directions box
        let statusBox = c('div')
        statusBox.id = "status-box"
        let statusText = c('h1')
        statusText.id = "status-text"
        statusText.innerText = "Directions"

        //arrow-keys and space bar pictures
        let arrow = c('div')
        arrow.className = "direction-box"
        let arrowImage = c('img')
        arrowImage.className = "direction-image"
        arrowImage.src = "./animations/directions/arrow-keys.png"
        arrow.append(arrowImage)
        let space = c('div')
        space.className = "direction-box"
        let spaceImage = c('img')
        spaceImage.className = "direction-image"
        spaceImage.src = "./animations/directions/spacebar.png"
        space.append(spaceImage)

        
        statusBox.append(statusText,arrow,space)

        document.body.append(statusBox)
        setTimeout(()=> statusBox.remove(),2000)
    }

    victory(){
        let timeReduction = this.player.defense * 100
        this.tracker.innerText = `Time: ${Level.time} - ${timeReduction}`
        Level.time = Level.time - timeReduction
        setTimeout(()=>{
            this.tracker.innerText = `Time: ${Level.time}`
        },1000)
        if(this.savefile.level < 20){
            //if player beat level under level 20
            this.endScreen("Level Complete","Save & Continue","Save & Quit")
            this.option1.addEventListener('click', ()=> this.save(false))
            this.option2.addEventListener('click', ()=> this.save(true))
        }else{
            //if player beat level 20
            this.endScreen("YOU WIN!","No More Levels","Save & Quit")
            this.option1.addEventListener('click', ()=> this.save(false))
            this.option2.addEventListener('click', ()=> this.save(true))
        }
    }

    defeat(){
        this.endScreen("Game Over","Try Again","Quit")
        this.option1.addEventListener('click',()=>{
            let  gameArea = new GameArea(this.savefile.id)
            gameArea.render()
        })
            this.option2.addEventListener('click',()=>{
            GameArea.endLevelQuit()
        })
    }

    endScreen(stringStatus,string1,string2){
        //status div box for if player wins or dies
        let statusBox = c('div')
        statusBox.id = "status-box"
        let statusText = c('h1')
        statusText.id = "status-text"

        //option boxes for when player wins/loses
        this.option1 = c('div')
        this.option1.className = "option-box"
        let option1Text = c('h2')
        option1Text.className = "option-text"
        this.option1.append(option1Text)
        this.option2 = c('div')
        this.option2.className = "option-box"
        let option2Text = c('h2')
        option2Text.className = "option-text"
        this.option2.append(option2Text)

        if(string1 == "No More Levels"){
            statusBox.append(statusText,this.option2)
        }else{
            statusBox.append(statusText,this.option1,this.option2)
        }

        statusText.innerText = stringStatus
        option1Text.innerText = string1
        option2Text.innerText = string2

        document.body.append(statusBox)
    }

    save(quit){
        //adds one health if health is less than 5
        if(this.player.health<5){
            this.player.health ++
        }

        //makes sure not to save anything past level 20
        if(this.savefile.level > 20){
            this.savefile.level = 20
        }

        //fetch request to save
        fetch(`http://localhost:3000/savefiles/${this.savefile.id}`,{
            method:'PATCH',
            headers: {
                "Content-Type":'application/json',
                'Accept':'application/json'
            },
            body: JSON.stringify({
                level: (this.savefile.level+1),
                time: Level.time,
                health: this.player.health
            })
        })
        .then(response => response.json())
        .then(result => {
            if(quit){
                GameArea.endLevelQuit()
            }else{
                let  gameArea = new GameArea(this.savefile.id)
                gameArea.render()
            }
        })
    }
}