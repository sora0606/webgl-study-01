// = 02 ======================================================================
// まず最初に、描画結果を確認しやすくするために、マウスで描画結果に干渉できるよ
// うにしておきましょう。
// three.js には、カメラを操作するためのコントロールと呼ばれる補助機能が用意され
// ているので、それを読み込んで利用します。
// より具体的には、ここでは OrbitControls と名付けられたコントロールを使っていま
// す。three.js には他のコントロールもありますが、最も直感的な動作をしてくれるの
// がオービットコントロールだと思います。
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

        // - レンダラ
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setClearColor(new THREE.Color(Sketch.RENDERER_PARAM.clearColor));
        this.renderer.setSize(Sketch.RENDERER_PARAM.width, Sketch.RENDERER_PARAM.height);
        this.container.appendChild(this.renderer.domElement);

        // - シーン
        this.scene = new THREE.Scene();

        // - カメラ
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
        // - OrbitControls --------------------------------------------------------
        // オービット、とはいわゆる衛星などの軌道のことです。
        // 地球を中心にその周囲を飛び回る衛星と同じように、三次元空間のある一点を凝
        // 視しながらその周囲を回転するカメラコントロールを可能にします。
        // ------------------------------------------------------------------------
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        this.addObjects();
        this.render();
    }

    addObjects() {
        // - ジオメトリとマテリアル
        this.geometry = new THREE.BoxGeometry(1.0, 1.0, 1.0);
        this.material = new THREE.MeshBasicMaterial(Sketch.MATERIAL_PARAM);

        // - メッシュ
        this.box = new THREE.Mesh(this.geometry, this.material);
        this.scene.add(this.box);
    }

    render() {
        // 恒常ループの設定
        // 引数から受け取った関数を、スクリーンの更新のタイミングにあわせて呼び出してくれる
        // ディスプレイのリフレッシュレート（60fps）にあわせて呼び出す
        requestAnimationFrame(this.render.bind(this));

        // コントロールを更新
        this.controls.update();

        // - 描画フェーズ
        this.renderer.render(this.scene, this.camera);
    }
}

new Sketch({
    dom: document.getElementById("container")
});