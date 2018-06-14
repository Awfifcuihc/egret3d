namespace egret3d.ammo {
    /**
     * 
     */
    export class FixedConstraint extends TypedConstraint {

        protected _createConstraint() {
            const rigidbody = this.gameObject.getComponent(Rigidbody);
            if (!rigidbody) {
                console.debug("Never.");
                return null;
            }

            if (!this._connectedBody) {
                console.error("The constraint need to config another rigid body.", this.gameObject.name, this.gameObject.hashCode);
                return null;
            }
            //
            const helpMatrixA = TypedConstraint._helpMatrixA;
            const helpMatrixB = TypedConstraint._helpMatrixB;
            this._createFrames(this._axisX, this._axisY, this._anchor, helpMatrixA, helpMatrixB)
            const helpVector3A = PhysicsSystem.helpVector3A;
            const helpQuaternionA = PhysicsSystem.helpQuaternionA;
            const helpTransformA = PhysicsSystem.helpTransformA;
            const helpTransformB = PhysicsSystem.helpTransformB;
            //
            const helpQA = Matrix.getQuaternion(helpMatrixA, TypedConstraint._helpQuaternionA);
            helpVector3A.setValue(helpMatrixA.rawData[8], helpMatrixA.rawData[9], helpMatrixA.rawData[10]);
            helpQuaternionA.setValue(helpQA.x, helpQA.y, helpQA.z, helpQA.w);
            helpTransformA.setIdentity();
            helpTransformA.setOrigin(helpVector3A);
            helpTransformA.setRotation(helpQuaternionA);
            //
            const helpQB = Matrix.getQuaternion(helpMatrixB, TypedConstraint._helpQuaternionA);
            helpVector3A.setValue(helpMatrixB.rawData[8], helpMatrixB.rawData[9], helpMatrixB.rawData[10]);
            helpQuaternionA.setValue(helpQB.x, helpQB.y, helpQB.z, helpQB.w);
            helpTransformB.setIdentity();
            helpTransformB.setOrigin(helpVector3A);
            helpTransformB.setRotation(helpQuaternionA);
            //
            const btConstraint = new Ammo.btFixedConstraint(
                rigidbody.btRigidbody, this._connectedBody.btRigidbody,
                helpTransformA, helpTransformB
            );
            btConstraint.setBreakingImpulseThreshold(this._breakingImpulseThreshold);
            // btConstraint.setOverrideNumSolverIterations(this._overrideNumSolverIterations);

            return btConstraint;
        }
    }
}