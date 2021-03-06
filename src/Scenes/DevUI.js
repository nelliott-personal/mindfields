export default class DevUI extends Phaser.Scene {
    constructor(gameScene) {
        super({
            key: 'DevUI',
            active: false
        })
    }

    create() {
        this.gameScene = this.sys.settings.data.gameScene
        this.gameScene.sys.events.on('addEntity', this.onAddEntity, this)
        this.gameScene.sys.events.on('removeEntity', this.onRemoveEntity, this)
        this.gameScene.sys.events.on('gameOver', this.onGameOver, this) 
        this.fps = this.add.text(10, 10, 'FPS: 0', { font: '12px Arial', fill: '#FFFFFF' }).setScrollFactor(1, 1)
        this.EntityUI = this.add.group(this)
    }

    update(time, delta) {
        this.cameras.main.zoom = this.gameScene.cameras.main.zoom + -this.gameScene.cameras.main.zoom + 1
        let scrollFactor = new Phaser.Math.Vector2(this.gameScene.cameras.main.scrollX, this.gameScene.cameras.main.scrollY)
        this.fps.setText('FPS: ' + Math.round(game.loop.actualFps))
        for (let gobj of this.EntityUI.getChildren()) {
            gobj.update(time, delta)
        }
    }

    onAddEntity(entity) {
        if (entity.state.maxHealth) {
            let newHP
            this.EntityUI.add(
                newHP = this.add.text(0, 0, 'Health: 0', { fontFamily: 'Arial', size: 12, fill: '#FFFFFF', align: 'center' }).setOrigin(0.5, 0.5).setStroke('#000000', 4).setScrollFactor(1, 1)
            )
            newHP.entity = entity
            newHP.update = function () {
                if (entity.active) {
                    let scrollFactor = new Phaser.Math.Vector2(entity.scene.cameras.main.scrollX /** entity.scene.cameras.main.zoom*/, entity.scene.cameras.main.scrollY /** entity.scene.cameras.main.zoom*/)
                    this.setText('Health: ' + entity.health.currentHealth)
                    this.setPosition(entity.x + (-scrollFactor.x), entity.y + (-scrollFactor.y) - Phaser.Math.Clamp(48 * entity.scene.cameras.main.zoom, 0, 64))
                    this.setFontSize(Phaser.Math.Clamp(12 * entity.scene.cameras.main.zoom, 6, 16))
                }
            }
        }
        if (entity.state.maxEnergy) {
            let newEN
            this.EntityUI.add(
                newEN = this.add.text(0, 0, 'Energy: 0', { fontFamily: 'Arial', size: 12, fill: '#FFFFFF', align: 'center' }).setOrigin(0.5, 0.5).setStroke('#000000', 4).setScrollFactor(1, 1)
            )
            newEN.entity = entity
            newEN.update = function () {
                if (entity.active) {
                    let scrollFactor = new Phaser.Math.Vector2(entity.scene.cameras.main.scrollX /** entity.scene.cameras.main.zoom*/, entity.scene.cameras.main.scrollY /** entity.scene.cameras.main.zoom*/)
                    this.setText('Energy: ' + entity.energy.currentEnergy)
                    this.setPosition(entity.x + (-scrollFactor.x), entity.y + (-scrollFactor.y) - Phaser.Math.Clamp(36 * entity.scene.cameras.main.zoom, 0, 64))
                    this.setFontSize(Phaser.Math.Clamp(12 * entity.scene.cameras.main.zoom, 6, 16))
                }
            }
        }
    }

    onRemoveEntity(entity) {
        var UIs = this.EntityUI.getChildren().filter(function (e) {
            return e.entity == entity
        })

        for (let o of UIs) {
            this.EntityUI.killAndHide(o)//, true, true)
        }
    }

    onGameOver(e) {
        this.EntityUI.clear(true, true)
    }
}
