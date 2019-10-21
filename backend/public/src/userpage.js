class UserPage{

    constructor(user){
        this.user = user
        this.h1 = c('h1')
        this.h1.innerText = `Hello ${this.user.username.toUpperCase()}`
        this.h1.className = 'main-title'

        //div for save file divs
        this.optionsdiv = c('div')

        //div for new file
        let newDiv = c('div')
        newDiv.className = "save-file"
        let newh1 = c('h1')
        newh1.className = "save-title"
        newh1.innerText = "Start New Game"
        newDiv.append(newh1)

        newh1.addEventListener('click',()=>{
            fetch(`http://localhost:3000/savefiles`,{ 
            method:'POST',
            headers: {
                "Content-Type":'application/json',
                'Accept':'application/json'
            },
            body: JSON.stringify({
                user_id: this.user.id,
                level: 1,
                time: 0,
                health: 5
            })
            })
            .then(response => response.json())
            .then(result => {
                let  gameArea = new GameArea(result.id)
                gameArea.render()
            })
        })

        //makes divs for each save file. fetching for when user obect passed does not have savefiles listed
        let count = 1
        fetch(`http://localhost:3000/users/${this.user.id}`)
        .then(response => response.json())
        .then( desiredUser => {
            desiredUser.savefiles.forEach((file)=>{
                this.saveFile(file,count)
                count++
            })
        })

        this.optionsdiv.append(newDiv)

        //logout button
        this.logoutbutton = c('button')
        this.logoutbutton.innerText = "Log Out"
        this.logoutbutton.className = 'logout'
        this.logoutbutton.addEventListener('click',()=>this.logout())

        //delete account button
        this.deleteAccountButton = c('button')
        this.deleteAccountButton.innerText = "Delete Account"
        this.deleteAccountButton.className = 'delete-account'
        this.deleteAccountButton.addEventListener('click',()=>this.deleteAccount())   
    }

    render(){
        document.body.innerHTML = ""
        document.body.append(this.h1,this.optionsdiv,this.logoutbutton,this.deleteAccountButton)

        loadSource()
    }

    saveFile(file,count){
        let div = c('div')
        div.className = 'save-file'

        let h2 = c('h2')
        h2.className = 'save-title'
        h2.innerText = `Save File ${count}`
        
        let level = c('h3')
        level.className = 'save-info'
        if(file.level <=20){
            level.innerText = "Current Level: " + file.level
        }else{
            level.innerText = "Game Completed: Final Score"
        }
        

        let time = c('h3')
        time.className = 'save-info'
        time.innerText = "Time: " + file.time

        let health = c('h3')
        health.className = 'save-info'
        health.innerText = "Health: " + file.health

        //delete account button
        let deleteButton = c('button')
        deleteButton.innerText = "Delete"
        deleteButton.className = 'button-savefile'
        deleteButton.addEventListener('click',()=>{
            let deleteSavefile = confirm("Are you sure you want to delete this savefile? If this is a high score, it will remove it from the high score board.")
            if(deleteSavefile){
                fetch(`http://localhost:3000/savefiles/${file.id}`, {method:'DELETE'})
                .then(()=>div.remove())
            }
        })

        //delete account button
        let loadButton = c('button')
        loadButton.innerText = "Load"
        loadButton.className = 'button-savefile'
        loadButton.addEventListener('click',()=>{
            let  gameArea = new GameArea(file.id)
            gameArea.render()
        })  

        if(file.level <=20){
            div.append(h2,level,time,health,deleteButton,loadButton)
        }else{
            div.append(h2,level,time,health,deleteButton)
        }
        this.optionsdiv.append(div)
    }

    logout(){
        homePage.render()
    }

    deleteAccount(){
        let deletion = confirm('Are you sure you want to delete your account? This will delete all of your save files and high scores.')
        if(deletion){
            fetch(`http://localhost:3000/users/${this.user.id}`, {method:'DELETE'})
            this.logout()
        }
    }
}