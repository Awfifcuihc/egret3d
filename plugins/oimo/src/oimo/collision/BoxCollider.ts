namespace egret3d.oimo {
    /**
     * 立方体碰撞组件。
     */
    @paper.requireComponent(Rigidbody)
    export class BoxCollider extends BaseCollider implements IBoxCollider {
        public readonly colliderType: ColliderType = ColliderType.Box;

        @paper.editor.property(paper.editor.EditType.NESTED)
        @paper.serializedField
        public readonly box: Box = Box.create();

        protected _createShape() {
            const config = this._updateConfig();
            config.position = this.box.center as any;
            config.geometry = new OIMO.BoxGeometry(Vector3.create().copy(this.box.size).multiplyScalar(0.5).release() as any);

            const shape = new OIMO.Shape(config);
            shape.userData = this;

            return shape;
        }

        public initialize() {
            super.initialize();

            this.box.copy(Box.ONE);
        }
    }
}
