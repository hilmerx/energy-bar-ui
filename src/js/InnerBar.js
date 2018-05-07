
export default class InnerBar {
  constructor(settings) {
    this.width = settings.width
    this.height = settings.height
    this.bounceAnim = 0
    this.x = settings.x
    this.y = settings.y
    this.colors = {
      green: settings.colorGreen,
      lightGreen: settings.colorLightGreen,
      red: settings.colorRed,
      darkRed: settings.colorDarkRed,
      white: settings.colorWhite
    }

    this.energy = undefined

    this.lowerColor = this.colors.green
    this.lowerBaseColor = this.colors.green
    this.lowerEnergy = undefined

    this.higherColor = this.colors.green
    this.higherBaseColor = this.colors.green
    this.higherEnergy = undefined

    this.bgColor = this.colors.white
    this.bgBaseColor = this.colors.white

    this.opacity = 1

    this.damageAnimationDone = 0
    this.healAnimationDone = 0

    this._currentTweens = []
    this.setInitialEnergy(0.5)
  }

  setColor(current, target, progress) {
    if (progress <= 1) {
      let r = current[0] + ((target[0] - current[0]) * progress)
      let g = current[1] + ((target[1] - current[1]) * progress)
      let b = current[2] + ((target[2] - current[2]) * progress)

      return [r, g, b]
    } else {
      return target
    }
  }

  setInitialEnergy(energy) {
    this.energy = energy
    this.lowerEnergy = energy
    this.higherEnergy = energy
  }


  damage(energyChange) {
    if (this.damageAnimationDone === 0) {
      this.lowerEnergy = this.energy
      this.higherEnergy = this.energy
    }

    this.killTweens()

    this.damageAnimationDone++

    TweenMax.delayedCall(1, () => {
      this.damageAnimationDone--
    })


    this.energy -= energyChange

    let _this = this

    this._currentTweens.push( 
      TweenMax.to(this, 0.4, {lowerEnergy: this.energy, 
        onStart: function() {
          _this.higherBaseColor = _this.higherColor
          _this.lowerBaseColor = _this.lowerColor
        },
        onUpdate: function() {
          _this.higherColor = _this.setColor(_this.higherBaseColor, _this.colors.darkRed, this.ratio)
          _this.lowerColor = _this.setColor(_this.lowerBaseColor, _this.colors.red, this.ratio)
        },
        onComplete: () => {
          this._currentTweens.push( 
            TweenMax.delayedCall(0.90, () => this.damageFadeBackToNormal())
          )
        }
      })
    )

    this._currentTweens.push( 
      TweenMax.delayedCall(0.7, () => {
        this.squeezeAnim()
      })
    )
  }

  damageFadeBackToNormal() {
    let _this = this

    let tweenObj = {
      val: 0
    }

    if (this.higherColor[0] === this.colors.darkRed[0]) {
      this._currentTweens.push( 
        TweenMax.to(tweenObj, 0.8, {val: 1, 
          onStart: function() {
            _this.higherBaseColor = _this.higherColor
            _this.lowerBaseColor = _this.lowerColor
          },
          onUpdate: function() {
            _this.higherColor = _this.setColor(_this.higherBaseColor, _this.colors.white, this.ratio * 1.6)
            _this.lowerColor = _this.setColor(_this.lowerBaseColor, _this.colors.green, this.ratio)
          }  
        })
      )
    }
  }

  heal(energyChange) {
    if (this.healAnimationDone === 0) {
      this.higherEnergy = this.energy
      this.lowerEnergy = this.energy
    }

    this.killTweens()

    this.healAnimationDone++
    TweenMax.delayedCall(1, () => {
      this.healAnimationDone--
    })


    this.energy += energyChange

    let _this = this

    this._currentTweens.push(
      TweenMax.to(this, 0.4, {higherEnergy: this.energy, 
        onStart: function() {
          _this.higherBaseColor = _this.higherColor
          _this.lowerBaseColor = _this.lowerColor
          _this.bgBaseColor = _this.bgColor
        },
        onUpdate: function() {
          _this.higherColor = _this.setColor(_this.higherBaseColor, _this.colors.green, this.ratio)
          _this.lowerColor = _this.setColor(_this.lowerBaseColor, _this.colors.lightGreen, this.ratio)
          _this.bgColor = _this.setColor(_this.bgBaseColor, _this.colors.white, this.ratio)
        },
        onComplete: () => {
          this._currentTweens.push(
            TweenMax.delayedCall(0.45, () => this.healFadeBackToNormal())
          )
        }
      })
    )
  }

  healFadeBackToNormal() {
    let _this = this

    let tweenObj = {
      val: 0
    }

    if (this.lowerColor[0] === this.colors.lightGreen[0]) {
      this._currentTweens.push(
        TweenMax.to(tweenObj, 0.8, {val: 1, 
          onStart: function() {
            _this.higherBaseColor = _this.higherColor
            _this.lowerBaseColor = _this.lowerColor
          },
          onUpdate: function() {
            _this.higherColor = _this.setColor(_this.higherBaseColor, _this.colors.green, this.ratio * 2)
            _this.lowerColor = _this.setColor(_this.lowerBaseColor, _this.colors.green, this.ratio)
          }
        })
      )
    }
  }


  die() {
    this.higherEnergy = this.energy
    this.lowerEnergy = this.energy
    this.killTweens()
    let _this = this

    let tweenObj = {
      val: 0
    }
    this._currentTweens.push(
      TweenMax.to(tweenObj, 2 , {val: 1,
        onStart: function() {
          _this.bgBaseColor = _this.bgColor
        },
        onUpdate: function() {
          _this.bgColor = _this.setColor(_this.bgBaseColor, _this.colors.red, this.ratio)
        }
      })
    )
    this._currentTweens.push(
      TweenMax.delayedCall(0.68, () => this.squeezeAnim())
    )
  }

  squeezeAnim() {
    let _this = this

    let tweenObj = {
      val: -0.7
    }

    this._currentTweens.push(
      TweenMax.to(tweenObj, 0.4, {
        val: 0.4, 
        ease: Power0.easeNone,
        onUpdate: function() {
          _this.bounceAnim = Math.sin(tweenObj.val) * 10
        },
        onComplete: function() {
          _this.bounceAnim = 0
        }
      })
    )
  }

  killTweens() {
    this._currentTweens.forEach(tween => {
      tween.kill()
    })

    this._currentTweens.length = 0
    this.bounceAnim = 0
    this.lowerEnergy = this.energy
    this.higherEnergy = this.energy
  }

  draw(ctx) {
    //background bar
    let bgWidth = this.width + (this.bounceAnim * 2)
    ctx.fillStyle= `rgba(${this.bgColor[0]}, ${this.bgColor[1]}, ${this.bgColor[2]}, ${this.opacity})` 
    ctx.fillRect(this.x -  this.bounceAnim, this.y - this.bounceAnim, bgWidth, this.height + (this.bounceAnim * 2));

    //higher bar
    let higherBarWidth = bgWidth * this.higherEnergy
    ctx.fillStyle= `rgba(${this.higherColor[0]}, ${this.higherColor[1]}, ${this.higherColor[2]}, ${this.opacity})` 
    ctx.fillRect(this.x - this.bounceAnim, this.y - this.bounceAnim, higherBarWidth, this.height + (this.bounceAnim * 2));

    //lower bar
    let lowerBarWidth = bgWidth * this.lowerEnergy
    ctx.fillStyle= `rgba(${this.lowerColor[0]}, ${this.lowerColor[1]}, ${this.lowerColor[2]}, ${this.opacity})` 
    ctx.fillRect(this.x - this.bounceAnim, this.y - this.bounceAnim, lowerBarWidth, this.height + (this.bounceAnim * 2));
  }

  dispose() {
    this.killTweens()
  }
}
