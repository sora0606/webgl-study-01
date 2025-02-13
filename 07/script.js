// = 07 ======================================================================
// これまでのサンプルでは、メッシュは「１つのジオメトリから１つ」ずつ生成してい
// ましたが、実際の案件では、同じジオメトリを再利用しながら「複数のメッシュ」を
// 生成する場面のほうが多いかもしれません。
// このとき、3D シーンに複数のオブジェクトを追加する際にやってしまいがちな間違い
// として「ジオメトリやマテリアルも複数回生成してしまう」というものがあります。
// メモリ効率よく複数のオブジェクトをシーンに追加する方法をしっかりおさえておき
// ましょう。
// ============================================================================

import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default class Sketch {
    static get CAMERA_PARAM() {
        return {
            fovy: 60,
            aspect: window.innerWidth / window.innerHeight,
            near: 0.1,
            far: 20.0,
            x: 0.0,
            y: 2.0,
            z: 10.0,
            lookAt: new THREE.Vector3(0.0, 0.0, 0.0),
        };
    }

    static get RENDERER_PARAM() {
        return {
            clearColor: 0x666666,
            width: window.innerWidth,
            height: window.innerHeight,
        };
    }

    static get MATERIAL_PARAM() {
        return {
            color: 0x3399ff,
        };
    }

    constructor(opstions) {
        this.container = opstions.dom;
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;

        // レンダラ
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setClearColor(new THREE.Color(Sketch.RENDERER_PARAM.clearColor));
        this.renderer.setSize(Sketch.RENDERER_PARAM.width, Sketch.RENDERER_PARAM.height);
        this.container.appendChild(this.renderer.domElement);

        // シーン
        this.scene = new THREE.Scene();

        // カメラ
        this.camera = new THREE.PerspectiveCamera(
            Sketch.CAMERA_PARAM.fovy,
            Sketch.CAMERA_PARAM.aspect,
            Sketch.CAMERA_PARAM.near,
            Sketch.CAMERA_PARAM.far,
        );
        this.camera.position.set(
            Sketch.CAMERA_PARAM.x,
            Sketch.CAMERA_PARAM.y,
            Sketch.CAMERA_PARAM.z,
        );
        this.camera.lookAt(Sketch.CAMERA_PARAM.lookAt);

        // コントロール
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        // ヘルパー
        const axesBarLength = 5.0;
        this.axesHelper = new THREE.AxesHelper(axesBarLength);
        this.scene.add(this.axesHelper);

        this.addObjects();
        this.render();

        // リサイズイベント
        window.addEventListener('resize', () => {
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
        }, false);
    }

    addObjects() {
        this.material = new THREE.MeshBasicMaterial(Sketch.MATERIAL_PARAM);

        // 共通のジオメトリ、マテリアルから、複数のメッシュインスタンスを作成する
        const TORUS_COUNT = 10;
        const TRANSFORM_SCALE = 5.0;
        this.torusGeometry = new THREE.TorusGeometry(0.5, 0.2, 8, 16);
        this.torusArray = [];
        for (let i = 0; i < TORUS_COUNT; ++i) {
            // トーラスメッシュのインスタンスを生成
            const torus = new THREE.Mesh(this.torusGeometry, this.material);
            // 座標をランダムに散らす
            torus.position.x = (Math.random() * 2.0 - 1.0) * TRANSFORM_SCALE;
            torus.position.y = (Math.random() * 2.0 - 1.0) * TRANSFORM_SCALE;
            torus.position.z = (Math.random() * 2.0 - 1.0) * TRANSFORM_SCALE;
            // シーンに追加する
            this.scene.add(torus);
            // 配列に入れておく
            this.torusArray.push(torus);
        }
    }

    render() {
        // 恒常ループ
        requestAnimationFrame(this.render.bind(this));

        // コントロールを更新
        this.controls.update();

        // 描画フェーズ
        this.renderer.render(this.scene, this.camera);
    }
}

new Sketch({
    dom: document.getElementById("container")
});