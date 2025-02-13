// = 04 ======================================================================
// three.js にはたくさんの組み込みジオメトリがあります。
// これまでのサンプルでは一貫してボックスばかり使っていましたが、代表的なその他
// のジオメトリについてもここで試してみましょう。
// 引数がそれぞれどういった意味を持っているのか疑問に思ったときは、公式のドキュ
// メント等を参考にしましょう。
// three.js docs - https://threejs.org/docs/index.html
//
// ちなみに、ここでは「マテリアルについては同じものを使いまわしている」という点
// も地味に重要です。個別に色や質感を変えたい場合は、もちろん別々のマテリアルを
// 使っても問題はありませんが、同じ質感であればマテリアルは再利用することで無駄
// なくプログラムを組むことができますし、メモリなども節約できます。
// ※逆に質感を変えたい場合はマテリアルは使い回すのではなく複数用意します
// ============================================================================

import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default class Sketch {
    static get CAMERA_PARAM() {
        return {
            fovy: 60,
            aspect: window.innerWidth / window.innerHeight,
            near: 0.1,
            far: 10.0,
            x: 0.0,
            y: 2.0,
            z: 5.0,
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

        // 各種メッシュは少しずつ動かしておく
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