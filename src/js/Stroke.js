
export default class Stroke {
    constructor(settings, ctx) {
        this.width = settings.width
        this.height = settings.height
        this.x = settings.x
        this.y = settings.y
        this.animDist = 60

        this.idleColor = settings.color
        this.damageColor = settings.damageColor
        this.colorGreen = settings.colorGreen
        this.animProgress = 0
        this.color = this.idleColor
        this.animColor = settings.damageColor 
        this.bounce = 0

        this.opacity = settings.opacity
        this.lineWidth = settings.lineWidth

        this.ctx = ctx
    }

    draw(ctx, bounce) {
        this.bounce = bounce

        ctx.strokeStyle = `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, ${this.opacity})`
        ctx.lineWidth = this.lineWidth

        ctx.strokeRect(this.x - this.bounce, this.y - this.bounce, this.width + (this.bounce * 2), this.height + (this.bounce * 2))
        // ctx.strokeRect(this.x - bounce, this.y - bounce, this.width + (bounce * 2), this.height + (bounce * 2))
    }

    drawAnim(progress, ctx) {
        // wave 1
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
        ctx.strokeStyle = `rgba(${this.idleColor[0]}, ${this.idleColor[1]}, ${this.idleColor[2]}, ${progress})`
        ctx.strokeRect(this.x - this.bounce, this.y - this.bounce, this.width + (this.bounce * 2), this.height + (this.bounce * 2))
    }

    damage() {
        let _this = this

        let tweenObj = {
            val: 0
        }

        TweenMax.to(
            tweenObj, 
            0.90, 
            {   
                val: 1,
                onUpdate: function() {
                    _this.color = _this.setColors(_this.idleColor, _this.damageColor, this.ratio)
                },
                onComplete: () => {
                    this.expand()
                    this.colorProgress = 0
                }
            }
        )

        TweenMax.delayedCall(1.24, () => this.expand())
    }

    heal() {
        let _this = this

        let tweenObj = {
            val: 0
        }

        TweenMax.to(
            tweenObj, 
            0.5, 
            {   
                val: 1,
                onUpdate: function() {
                    _this.color = _this.setColors(_this.idleColor, _this.colorGreen, this.ratio)
                },
                onComplete: () => {
                    this.fadeInIdleHeal()
                    this.colorProgress = 0
                }
            }
        )
    }

    setColors(current, target, progress) {
        let r = current[0] + ((target[0] - current[0]) * progress)
        let g = current[1] + ((target[1] - current[1]) * progress)
        let b = current[2] + ((target[2] - current[2]) * progress)

        return [r, g, b]
    }

    fadeInIdleHeal() {
        let _this = this

        let tweenObj = {
            val: 0
        }

        TweenMax.to(
            tweenObj, 
            0.8, 
            {   
                val: 1,
                onUpdate: function() {
                    _this.drawIdleFadeIn(this.ratio, _this.ctx)
                },
                onComplete: () => {
                    this.color = this.idleColor
                }
            }
        )
    }

    expand() {
        let _this = this

        let tweenObj = {
            val: 0
        }

        TweenMax.to(
            tweenObj, 
            0.8, 
            {   
                val: 1,
                onUpdate: function() {
                    _this.drawAnim(this.ratio, _this.ctx)
                    _this.drawIdleFadeIn(this.ratio, _this.ctx)
                },
                onComplete: () => {
                    this.color = this.idleColor
                }
            }
        )
    }
}
