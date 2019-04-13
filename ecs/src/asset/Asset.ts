import UUID from "../uuid/UUID";

/**
    * 基础资源。
    * - 全部资源的基类。
    * - 资源不能直接静态初始化，需要等待引擎启动完毕后初始化。
    */
export abstract class Asset extends UUID {
    /**
        * TODO RES 需要有注册的功能，并拥有查询所有指定类型资源的功能。
        * Asset 类型需要引擎枚举，paper 空间还是引擎空间。
        * 空间结构
        * 引擎、res、ecs、2d、3d，其他
        * @internal
        */
    public static readonly _assets: { [key: string]: Asset } = {};

    public static readonly _disposed: Asset[] = [];
    /**
        * 将一个资源注册为全局可访问资源。
        * - 资源引用计数加 1 。
        */
    public static register(asset: Asset): boolean {
        const assetName = asset.name;

        if (!assetName) {
            console.warn("Unable to register an unnamed asset.");
            return false;
        }

        const assets = this._assets;

        if (assetName in assets) {
            const existingAsset = assets[assetName];
            if (existingAsset === asset) {
                return false;
            }

            console.warn("Replaces an existing asset.", assetName);
        }

        assets[assetName] = asset;

        return true;
    }
    /**
        * 通过资源名获取一个已注册的指定资源。
        */
    public static find<T extends Asset>(name: string): T | null {
        const assets = this._assets;

        if (name in assets) {
            return assets[name] as T;
        }

        // TODO:
        // return RES.getRes(name);
        return null;
    }
    /**
        * 资源名称。
        */
    public name: string = "";

    protected _referenceCount: int = -1;
    /**
        * 请使用 `T.create()` 创建实例。
        */
    protected constructor() {
        super();
    }
    /**
        * 该资源内部初始化。
        * - 重写此方法时，必须调用 `super.initialize();`。
        */
    public initialize(...args: any[]): void {
        this._referenceCount = 0;
    }
    /**
        * 该资源的引用计数加一。
        */
    public retain(): this {
        if (this._referenceCount === 0) {
            if (this.onReferenceCountChange) {
                const assets = Asset._disposed;
                const index = assets.indexOf(this);

                if (index >= 0) {
                    assets.splice(index, 1);
                }

                this.onReferenceCountChange(false);
            }
        }

        this._referenceCount++;

        return this;
    }
    /**
        * 该资源的引用计数减一。
        */
    public release(): this {
        if (this._referenceCount > 0) {
            this._referenceCount--;

            if (this._referenceCount === 0) {
                if (this.onReferenceCountChange) {
                    const assets = Asset._disposed;

                    if (assets.indexOf(this) < 0) {
                        assets.push(this);
                    }
                }
            }
        }

        return this;
    }
    /**
        * 释放该资源。
        * - 重写此方法时，必须调用 `super.dispose();`。
        * @returns 释放是否成功。（已经释放过的资源，无法再次释放）
        */
    public dispose(): boolean {
        if (this._referenceCount === -1) {
            return false;
        }
        //
        const assets = Asset._assets;
        if (this.name in assets) {
            delete assets[this.name];
        }
        //
        this._referenceCount = -1;

        this.onReferenceCountChange && this.onReferenceCountChange(true);

        return true;
    }
    /**
        * 
        * @param isZero 
        */
    public onReferenceCountChange?(isZero: boolean): boolean;
    /**
        * 该资源是否已经被释放。
        */
    public get isDisposed(): boolean {
        return this._referenceCount === -1;
    }
    /**
        * 该资源的引用计数。
        * - 当引用计数为 0 时，该资源将在本帧末尾被释放。
        */
    public get referenceCount(): uint {
        return this._referenceCount >= 0 ? this._referenceCount : 0;
    }
}