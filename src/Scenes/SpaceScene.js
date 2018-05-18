import AnimatedTiles from 'phaser-animated-tiles'
import ChunkManager from '../MapGeneration/ChunkManager'
import Player from '../Entities/Player/Player'
import Asteroid from '../Entities/ResourceNodes/Asteroid'
import Entity from '../Entities/Entity'
import SaveState from '../Utils/SaveState'
import Helpers from '../Utils/Helpers'

export default class SpaceScene extends Phaser.Scene {

  constructor() {
    super({ key: 'SpaceScene' })
  }

  preload() {
    this.load.image('ship', 'assets/images/ship.png')
    this.load.image('targeter', 'assets/images/crosshair.png')
    this.load.image('spacerock', 'assets/images/spacerock.png')
  }

  create() {
    console.log('Saved State: ', SaveState.state)
    this.state = SaveState.state
    this.isStopped = false;
    console.log(this.state.seed)
    this.CM = new ChunkManager({
      scene: this,
      state: {
        seed: this.state.seed
      }
    })

    this.Entities = this.add.group()

    this.Entities.add(
      new Player({
        scene:this,
        key: 'ship',
        x: 50,
        y: 50,
        state: this.state.Player,
        targeter: this.add.image(50, 50, 'targeter')
      })
    )
    this.Entities.add(
      new Asteroid({
        scene: this,
        key: 'spacerock',
        x: 300,
        y: 50,
        state: {}
      })
    )

    this.P = this.Entities.getChildren()[0]
    //this.physics.add.collider(this.P, this.Entities.getChildren()[1])
    this.input.mouse.capture = true

    this.setupCamera()
    this.setupKeys()
  }

  setupCamera(){
    this.cameras.main.startFollow(this.P)
  }

  setupKeys(){
    this.inputstate = {
      z: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z),
      x: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X)
    }
  }

  update(time, delta) {

    for(let gobj of this.Entities.getChildren()){
      gobj.update(time, delta)
    }
    for(let input in this.inputstate){
      if(this.inputstate[input].isDown){
        if(input == 'z'){
          this.cameras.main.zoom -=.01
        }
        else if(input == 'x'){
          this.cameras.main.zoom +=.01
        }
      }
    }
  }

}
