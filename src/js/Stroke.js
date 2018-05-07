
export default class Stroke {
  constructor(settings, ctx) {
    this.width = settings.width
    this.height = settings.height
    this.x = settings.x
    this.y = settings.y
    this.animDist = 60

    this.color = settings.colorWhite
    this.animColor = settings.colorRed 

    this.colors = {
      white: settings.colorWhite,
      red: settings.colorRed,
      darkRed: settings.colorDarkRed,
      green: settings.colorGreen
    }

    this.bounce = 0

    this.opacity = settings.opacity
    this.lineWidth = settings.lineWidth

    this.ctx = ctx

    this._currentTweens = []
  }

  draw(ctx, bounce, opactity = 1) {
    this.bounce = bounce

    ctx.strokeStyle = `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, ${this.opacity})`
    ctx.lineWidth = this.lineWidth

    ctx.strokeRect(this.x - this.bounce, this.y - this.bounce, this.width + (this.bounce * 2), this.height + (this.bounce * 2))
  }

  drawPulse(progress, ctx) {
    ctx.strokeStyle = `rgba(${this.animColor[0]}, ${this.animColor[1]}, ${this.animColor[2]}, ${this.opacity - progress})`

    const wave1Pos = {
      x: this.x - (this.animDist * progress),
      y: this.y - (this.animDist * progress),
      width: this.width + (this.animDist * progress * 2),
      height: this.height + (this.animDist * progress * 2)
    }
    ctx.strokeRect(wave1Pos.x, wave1Pos.y, wave1Pos.width, wave1Pos.height)
  }

  drawIdleFadeIn(progress, ctx) {
    ctx.strokeStyle = `rgba(${this.colors.white[0]}, ${this.colors.white[1]}, ${this.colors.white[2]}, ${progress})`
    ctx.strokeRect(this.x - this.bounce, this.y - this.bounce, this.width + (this.bounce * 2), this.height + (this.bounce * 2))
  }

  setColors(current, target, progress) {
    let r = current[0] + ((target[0] - current[0]) * progress)
    let g = current[1] + ((target[1] - current[1]) * progress)
    let b = current[2] + ((target[2] - current[2]) * progress)

    return [r, g, b]
  }

  die() {
    this.damage(this.colors.darkRed, this.colors.darkRed)
  }

  damage(firstTargetColor = this.colors.red, secondTargetColor = this.colors.white) {
    this.killTweens()

    let _this = this

    let tweenObj = {
      val: 0
    }

    this._currentTweens.push( 
      TweenMax.to(
        tweenObj, 
        0.9, 
        {   
          val: 1,
          onUpdate: function() {
            _this.color = _this.setColors(_this.colors.white, firstTargetColor, this.ratio)
          }
        }
      )
    )

    this._currentTweens.push( 
      TweenMax.delayedCall(0.9, () => this.expand())
    )

    this._currentTweens.push(
      TweenMax.delayedCall(1.24, () => {
        this.expand()
        this.fadeInIdleDamage(secondTargetColor)
      })
    )
  }

  expand() {
    let _this = this

    let tweenObj = {
      val: 0
    }
    this._currentTweens.push( 
      TweenMax.to(
        tweenObj, 
        0.8, 
        {   
          val: 1,
          onUpdate: function() {
            _this.drawPulse(this.ratio, _this.ctx)
          }
        }
      )
    )
  }

  fadeInIdleDamage(secondTargetColor) {
    let _this = this

    let tweenObj = {
      val: 0
    }
    this._currentTweens.push(
      TweenMax.to(
        tweenObj, 
        0.8, 
        {   
          val: 1,
          onUpdate: function() {
            _this.color = _this.setColors(_this.colors.red, secondTargetColor, this.ratio)

          }
        }
      )
    )
  }

  heal() {
    this.killTweens()

    let _this = this

    let tweenObj = {
      val: 0
    }
    this._currentTweens.push( 
      TweenMax.to(
        tweenObj, 
        0.5, 
        {   
          val: 1,
          onUpdate: function() {
            _this.color = _this.setColors(_this.colors.white, _this.colors.green, this.ratio)
          },
          onComplete: () => {
            this.fadeInIdleHeal()
          }
        }
      )
    )
  }

  fadeInIdleHeal() {
    let _this = this

    let tweenObj = {
      val: 0
    }
    this._currentTweens.push( 
      TweenMax.to(
        tweenObj, 
        0.8, 
        {   
          val: 1,
          onUpdate: function() {
            _this.color = _this.setColors(_this.colors.green, _this.colors.white, this.ratio)
          }
        }
      )
    )
  }

  killTweens() {
    this._currentTweens.forEach(tween => {
      tween.kill()
    })
    this._currentTweens.length = 0
  }

  dispose() {
    this.killTweens()
    this.ctx = undefined
  }
}
