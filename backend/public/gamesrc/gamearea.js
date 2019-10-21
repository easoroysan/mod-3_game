class GameArea{

    static endLevelQuit

    constructor(savefile_id){
        this.link = s(".home")

        this.exitButton = c('button')
        this.exitButton.id = "exit-button"
        this.exitButton.innerText = "Quit Game"
        this.exitButton.addEventListener('click',()=>this.exitGame())

        //gets savefile
        fetch(`http://localhost:3000/savefiles/${savefile_id}`)
        .then(response => response.json())
        .then(savefile => {
            this.savefile = savefile
            //clears page and changes which css file to use
            this.render()
            //loads level based on savefile
            new Level(this.savefile)
        })
        
        GameArea.endLevelQuit = () =>{
            this.exitGame()
        }
    }

    render(){
        document.body.innerText = ""
        this.link.href = gameLink
        document.body.append(this.exitButton)
    }

    exitGame(){
        Monster.all = []
        Boss.all = []
        document.body.innerHTML = ""
        this.link.href = styleLink
        let userPage = new UserPage(this.savefile.user)
        userPage.render()
    }
}