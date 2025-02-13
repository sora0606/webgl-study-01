
// = 05 ======================================================================
// このサンプルの実行結果の見た目は、ほとんど 04 と同じです。
// コードにコメントを大量に追記していますので、各種パラメータのそれぞれが、どう
// いったことに影響を及ぼすのか、あるいはどういった意味合いを持つのか、しっかり
// とここで再確認しておきましょう。
// 講義スライドのなかにある図式も一緒に眺めながら理解を深めるといいでしょう。
// ============================================================================


import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default class Sketch {
    static get CAMERA_PARAM() {
        return {
            // fovy は Field of View Y のことで、縦方向の視野角を意味する
            fovy: 60,
            // 描画する空間のアスペクト比（縦横比）
            aspect: window.innerWidth / window.innerHeight,
            // 描画する空間のニアクリップ面（最近面）
            near: 0.1,
            // 描画する空間のファークリップ面（最遠面）
            far: 10.0,
            // カメラの位置
            x: 0.0,
            y: 2.0,
            z: 5.0,
            // カメラの中止点
            lookAt: new THREE.Vector3(0.0, 0.0, 0.0),
        };
    }

    static get RENDERER_PARAM() {
        return {
            // レンダラーが背景をリセットする際に使われる背景色
            clearColor: 0x666666,
            // レンダラーが描画する領域の横幅
            width: window.innerWidth,
            // レンダラーが描画する領域の縦幅
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
    }

    addObjects() {
        this.material = new THREE.MeshBasicMaterial(Sketch.MATERIAL_PARAM);

        // 各種ジオメトリからメッシュを生成する
        this.boxGeometry = new THREE.BoxGeometry(1.0, 1.0, 1.0);
        this.box = new THREE.Mesh(this.boxGeometry, this.material);
        this.scene.add(this.box);
        this.sphereGeometry = new THREE.SphereGeometry(0.5, 16, 16);
        this.sphere = new THREE.Mesh(this.sphereGeometry, this.material);
        this.scene.add(this.sphere);
        this.torusGeometry = new THREE.TorusGeometry(0.5, 0.2, 8, 16);
        this.torus = new THREE.Mesh(this.torusGeometry, this.material);
        this.scene.add(this.torus);
        this.coneGeometry = new THREE.ConeGeometry(0.5, 1.0, 16);
        this.cone = new THREE.Mesh(this.coneGeometry, this.material);
        this.scene.add(this.cone);

        // 各種メッシュは少しずつ動かしておく @@@
        this.box.position.set(-1.0, 1.0, 0.0);
        this.sphere.position.set(1.0, 1.0, 0.0);
        this.torus.position.set(-1.0, -1.0, 0.0);
        this.cone.position.set(1.0, -1.0, 0.0);
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