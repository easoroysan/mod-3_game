class Boss extends Character {
	static all = []
	static healthPosition = 15
	static healthPositionChange = false

	constructor(x, y) {
		super(x, y, `${animationURL}/boss`)

		this.element.style.width = '100px'
		this.element.style.height = '100px'
		this.speed = 4
		Boss.all.push(this)

		// health bar for boss
		this.health = 100
		this.healthBar = c('div')
		this.healthBar.id = 'boss-health-bar'
		this.healthBar.style.top = Boss.healthPosition
		this.bar = c('div')
		this.bar.id = 'boss-health'
		this.bar.style.width = `${this.health}%`
		this.bar.innerText = `${this.health}%`
		this.healthBar.append(this.bar)

		//lowers next health bar for next monster created
		//will keep lowering until 10 monsters are created. then goes back up
		if (!Boss.healthPositionChange) {
			Boss.healthPosition = Boss.healthPosition + 40
			if (Boss.healthPosition >= 160) {
				Boss.healthPositionChange = true
			}
		} else {
			Boss.healthPosition = Boss.healthPosition - 20
			if (Boss.healthPosition <= 10) {
				Boss.healthPositionChange = false
			}
		}

		// makes boss go in random directions every second
		setInterval(() => {
			const left = parseInt(this.element.style.left)
			const bottom = parseInt(this.element.style.bottom)

			//picks random direction each interval
			const directionsArray = ['Up', 'Down', 'Left', 'Right']
			let rand =
				directionsArray[Math.floor(Math.random() * directionsArray.length)]

			if (rand === 'Up') {
				this.element.direction = [null, null]
				//boolean to check if boss is running against a wall
				if (document.documentElement.clientHeight >= bottom + 240) {
					this.runUp()
				} else {
					this.runDown()
				}
			}
			if (rand === 'Down') {
				this.element.direction = [null, null]
				if (bottom - 10 > 0) {
					this.runDown()
				} else {
					this.runUp()
				}
			}
			if (rand === 'Left') {
				this.element.direction = [null, null]
				if (left + 10 > 0) {
					this.runLeft()
				} else {
					this.runRight()
				}
			}
			if (rand === 'Right') {
				this.element.direction = [null, null]
				if (document.documentElement.clientWidth >= left + 100) {
					this.runRight()
				} else {
					this.runLeft()
				}
			}
		}, 500)
	}

	render() {
		document.body.append(this.healthBar)
		document.body.append(this.element)
	}

	//hitbox for monster
	hitbox() {
		let leftBorder = parseInt(this.element.style.left) + 10
		let rightBorder = parseInt(this.element.style.left) + 90
		let topBorder = parseInt(this.element.style.bottom) + 70
		let bottomBorder = parseInt(this.element.style.bottom) + 30

		return [leftBorder, rightBorder, topBorder, bottomBorder]
	}

	//hurtbox for monster
	hurtbox() {
		let leftBorder = parseInt(this.element.style.left) + 10
		let rightBorder = parseInt(this.element.style.left) + 90
		let topBorder = parseInt(this.element.style.bottom) + 70
		let bottomBorder = parseInt(this.element.style.bottom) + 30

		return [leftBorder, rightBorder, topBorder, bottomBorder]
	}

	//checks if hitbox of player touches hurtbox of monster
	hurt(player) {
		let hitbox = player.hitbox(player.hitDirection)

		let swordLeft = hitbox[0]
		let swordRight = hitbox[1]
		let swordUp = hitbox[2]
		let swordDown = hitbox[3]

		let selfLeft = this.hurtbox()[0]
		let selfRight = this.hurtbox()[1]
		let selfUp = this.hurtbox()[2]
		let selfDown = this.hurtbox()[3]

		if (swordRight >= selfLeft && swordLeft <= selfRight) {
			if (swordUp >= selfDown && swordDown <= selfUp) {
				this.hitstun(player.hitDirection)
			}
		}
	}

	//what monster does when hit
	hitstun(direction) {
		//shows when monster is hit
		this.element.style.backgroundColor = '#FF000080'

		//decreases health
		this.health--
		this.bar.style.width = `${this.health}%`
		this.bar.innerText = `${this.health}%`

		//if health reaches 0, boss is removed
		if (this.health <= 0) {
			this.dead = true
			this.healthBar.remove()
			this.element.remove()
			this.element.style = ''
		}

		//makes monster run in direction he was hit
		setTimeout(() => {
			this.element.style.backgroundColor = 'transparent'
			if (direction == 'Right') {
				this.speed = 12
				this.runRight()
			}
			if (direction == 'Left') {
				this.speed = 12
				this.runLeft()
			}
			if (direction == 'Up') {
				this.speed = 12
				this.runUp()
			}
			if (direction == 'Down') {
				this.speed = 12
				this.runDown()
			}
		}, 100)

		//puts speed back to normal and stops monster for a moment
		setTimeout(() => {
			this.speed = 4
			this.stop()
		}, 300)
	}
}
