
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
            green: settings.colorGreen
        }

        this.animProgress = 0
        this.bounce = 0

        this.opacity = settings.opacity
        this.lineWidth = settings.lineWidth

        this.ctx = ctx
    }

    draw(ctx, bounce, opactity = 1) {
        this.bounce = bounce
        ctx.strokeStyle = `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, ${this.opacity})`
        ctx.lineWidth = this.lineWidth

        ctx.strokeRect(this.x - this.bounce, this.y - this.bounce, this.width + (this.bounce * 2), this.height + (this.bounce * 2))
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
        ctx.strokeStyle = `rgba(${this.colors.white[0]}, ${this.colors.white[1]}, ${this.colors.white[2]}, ${progress})`
        ctx.strokeRect(this.x - this.bounce, this.y - this.bounce, this.width + (this.bounce * 2), this.height + (this.bounce * 2))
    }

    setColors(current, target, progress) {
        let r = current[0] + ((target[0] - current[0]) * progress)
        let g = current[1] + ((target[1] - current[1]) * progress)
        let b = current[2] + ((target[2] - current[2]) * progress)

        return [r, g, b]
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
                    _this.color = _this.setColors(_this.colors.white, _this.colors.red, this.ratio)
                },
                onComplete: () => {
                    this.expand()
                    this.colorProgress = 0
                }
            }
        )

        TweenMax.delayedCall(1.24, () => this.expand())
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
                    _this.color = _this.setColors(_this.colors.red, _this.colors.white, this.ratio)

                },
                onComplete: () => {
                    this.color = this.colors.white
                }
            }
        )
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
                    _this.color = _this.setColors(_this.colors.white, _this.colors.green, this.ratio)
                },
                onComplete: () => {
                    this.fadeInIdleHeal()
                    this.colorProgress = 0
                }
            }
        )
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
                    _this.color = _this.setColors(_this.colors.green, _this.colors.white, this.ratio)
                }
            }
        )
    }
}
