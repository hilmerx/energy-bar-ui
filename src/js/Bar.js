import Stroke from './Stroke'
import InnerBar from './InnerBar'

export default class Bar {
  constructor(settings, ctx) {
    this.x = settings.x
    this.y = settings.y
    this.width = settings.width
    this.height = settings.height
    this.lineWidth = settings.lineWidth

    this.ctx = ctx

    this.innerBar = undefined
    this.stroke = undefined

    this.init()
  }

  init() {
    let _this = this

    let strokeSettings = {
      width: this.width,
      height: this.height,
      colorWhite: [251, 254, 236],
      colorRed: [213, 93, 69],
      colorDarkRed: [171, 55, 40],
      colorGreen: [116, 180, 101],
      opacity: 1,
      lineWidth: this.lineWidth,
      x: this.x,
      y: this.y
    }

    let barSettings = {
      width: this.width - (this.lineWidth/2),
      height: this.height - (this.lineWidth/2),
      colorGreen: [116, 180, 101],
      colorLightGreen: [202, 233, 155],
      colorWhite: [251, 254, 236],
      colorRed: [213, 93, 69],
      colorDarkRed: [171, 55, 40],
      opacity: 1,
      strokeOpacity: 1,
      get x() {return _this.x + (_this.width - this.width) },
      get y() {return _this.y + (_this.height - this.height) }
    }

    this.innerBar = new InnerBar(barSettings, this.ctx)
    this.stroke = new Stroke(strokeSettings, this.ctx)
  }

  damage(energy) {
    if (this.innerBar.energy === 0) {
      return
    } else if (this.innerBar.energy < energy + 0.001) {
      this.innerBar.energy = 0

      this.innerBar.die()
      this.stroke.die()

    } else {
      this.stroke.damage()
      this.innerBar.damage(energy)
    }
  }

  heal(energy) {
    if (1 - this.innerBar.energy < energy) {
      energy = 1 - this.innerBar.energy
      
      if (energy < 0.000001) {
        return
      }
    } else {
      this.stroke.heal()
      this.innerBar.heal(energy)
    }
  }

  setInitialEnergy(energy) {
    this.innerBar.setInitialEnergy(energy)
  }

  draw(ctx) {
    this.innerBar.draw(ctx)
    this.stroke.draw(ctx, this.innerBar.bounceAnim)
  }

  dispose() {
    this.ctx = undefined
    this.innerBar.dispose()
    this.stroke.dispose()
  }
}
