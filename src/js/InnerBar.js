
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

        this.energy = 0.5

        this.lowerColor = this.colors.green
        this.lowerEnergy = 0.5

        this.higherColor = this.colors.green
        this.higherEnergy = 0.5

        this.opacity = 1

        this.damageAnimationDone = 0
        this.healAnimationDone = 0
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

    damage(energyChange) {
        if (this.damageAnimationDone === 0) {
            this.lowerEnergy = this.energy
            this.higherEnergy = this.energy
        }

        this.damageAnimationDone++
        TweenMax.delayedCall(1, () => {
            this.damageAnimationDone--
        })


        this.energy -= energyChange

        let _this = this


        TweenMax.to(this, 0.4, {lowerEnergy: this.energy, 
            onUpdate: function() {
                _this.higherColor = _this.setColor(_this.colors.green, _this.colors.darkRed, this.ratio)
                _this.lowerColor = _this.setColor(_this.colors.green, _this.colors.red, this.ratio)
            },
            onComplete: () => {
                TweenMax.delayedCall(0.30, () => this.damageFadeBackToNormal())
            }
        })
    }

    squeezeAnim() {
        let _this = this

        let tweenObj = {
            val: -0.7
        }

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
    }

    damageFadeBackToNormal() {
        this.squeezeAnim()

        let _this = this

        let tweenObj = {
            val: 0
        }
        if (this.higherColor[0] === this.colors.darkRed[0]) {
            TweenMax.to(tweenObj, 0.8, {val: 1, 
                onUpdate: function() {
                    _this.higherColor = _this.setColor(_this.colors.darkRed, _this.colors.white, this.ratio *1.6)
                    _this.lowerColor = _this.setColor(_this.colors.red, _this.colors.green, this.ratio)
                }
            })
        }
    }

    heal(energyChange) {
        if (this.healAnimationDone === 0) {
            this.higherEnergy = this.energy
            this.lowerEnergy = this.energy
        }

        this.healAnimationDone++
        TweenMax.delayedCall(1, () => {
            this.healAnimationDone--
        })


        this.energy += energyChange

        let _this = this


        TweenMax.to(this, 0.4, {higherEnergy: this.energy, 
            onUpdate: function() {
                _this.higherColor = _this.setColor(_this.colors.green, _this.colors.green, this.ratio)
                _this.lowerColor = _this.setColor(_this.colors.green, _this.colors.lightGreen, this.ratio)
            },
            onComplete: () => {
                TweenMax.delayedCall(0.45, () => this.healFadeBackToNormal())
            }
        })
    }

    healFadeBackToNormal() {
        let _this = this

        let tweenObj = {
            val: 0
        }

        if (this.lowerColor[0] === this.colors.lightGreen[0]) {
            TweenMax.to(tweenObj, 0.8, {val: 1, 
                onUpdate: function() {
                    _this.higherColor = _this.setColor(_this.colors.green, _this.colors.green, this.ratio * 2)
                    _this.lowerColor = _this.setColor(_this.colors.lightGreen, _this.colors.green, this.ratio)
                }
            })
        }
    }

    draw(ctx) {
        //background bar
        ctx.fillStyle= `rgba(${this.colors.white[0]}, ${this.colors.white[1]}, ${this.colors.white[2]}, ${this.opacity})` 
        ctx.fillRect(this.x - this.bounceAnim, this.y - this.bounceAnim, this.width + (this.bounceAnim * 2), this.height + (this.bounceAnim * 2));

        //higher bar
        ctx.fillStyle= `rgba(${this.higherColor[0]}, ${this.higherColor[1]}, ${this.higherColor[2]}, ${this.opacity})` 
        const stickingWidth = this.width * this.higherEnergy
        ctx.fillRect(this.x - this.bounceAnim, this.y - this.bounceAnim, stickingWidth + (this.bounceAnim), this.height + (this.bounceAnim * 2));

        //lower bar
        ctx.fillStyle= `rgba(${this.lowerColor[0]}, ${this.lowerColor[1]}, ${this.lowerColor[2]}, ${this.opacity})` 
        const activeWidth = this.width * this.lowerEnergy
        ctx.fillRect(this.x - this.bounceAnim, this.y - this.bounceAnim, activeWidth + (this.bounceAnim), this.height + (this.bounceAnim * 2));
    }
}
