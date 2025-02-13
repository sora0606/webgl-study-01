// = 01 ======================================================================
// three.js サンプルの雛形。
// これは基本となる雛形サンプルなので他のサンプルよりもコメント多めになってます。
// ============================================================================

import * as THREE from 'three';

export default class Sketch {
    /**
    * カメラ定義のための定数
    */
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

    /**
     * レンダラー定義のための定数
     */
    static get RENDERER_PARAM() {
        return {
            clearColor: 0x666666, // クリアする色
            width: window.innerWidth, // 幅はウィンドウ全体の幅
            height: window.innerHeight, // 高さはウィンドウの全体の高さ
        };
    }

    /**
     * マテリアル定義のための定数
     */
    static get MATERIAL_PARAM() {
        return {
            color: 0x3399ff, // マテリアルの基本色
        };
    }

    constructor(opstions) {
        this.container = opstions.dom;
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;

        // - レンダラの初期化 -----------------------------------------------------
        // レンダラ、という言葉はフロントエンドではあまり見聞きしない言葉です。わか
        // りやすく言うなら、レンダラとは「現像する人」です。カメラが撮影したフィル
        // ムを、現像してスクリーンに映してくれる役割を担います。
        // ------------------------------------------------------------------------
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setClearColor(new THREE.Color(Sketch.RENDERER_PARAM.clearColor));
        this.renderer.setSize(Sketch.RENDERER_PARAM.width, Sketch.RENDERER_PARAM.height);
        this.container.appendChild(this.renderer.domElement);

        // - シーンの初期化 -------------------------------------------------------
        // Scene とは、その名のとおり 3D シーンを管理するためのものです。
        // たとえばこのシーンにはどんなオブジェクトを使うのか、あるいはどんなカメラ
        // を使って撮影を行うのかなど、描画する 3D 空間全体の情報をまとめて持ってい
        // るのが Scene オブジェクトです。
        // 3D の専門用語では、いわゆるシーングラフ（Scene Graph）と呼ばれているもの
        // で、three.js ではこれを Scene オブジェクトによって実現します。
        // ------------------------------------------------------------------------
        this.scene = new THREE.Scene();

        // - カメラの初期化 -------------------------------------------------------
        // three.js におけるカメラは、現実世界のカメラと同じように空間を撮影するため
        // に使います。
        // 現実のカメラがそうであるように、カメラの性能や、あるいは性質によって最終
        // 的に描かれる世界はまったく違ったものになります。
        // ------------------------------------------------------------------------
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

        this.addObjects();
        this.render();
    }

    addObjects() {
        // - ジオメトリとマテリアルの初期化 ---------------------------------------
        // ジオメトリとは、3D シーン上にオブジェクトを描くために使う「頂点」の集合体
        // です。もっと言うと、ジオメトリとは「単なる形状を定義したもの」であり、言
        // うなれば設計図、あるいは骨組みのようなものです。
        // ジオメトリはあくまでも設計図にすぎないので、これをどのように 3D 空間に配
        // 置するのかや、どのような色を塗るのかは、別の概念によって決まります。
        // three.js では、どのような色を塗るのかなど質感に関する設定はマテリアルとい
        // うオブジェクトがそれを保持するようになっています。
        // ------------------------------------------------------------------------
        this.geometry = new THREE.BoxGeometry(1.0, 1.0, 1.0);
        this.material = new THREE.MeshBasicMaterial(Sketch.MATERIAL_PARAM);

        // - メッシュの初期化 -----------------------------------------------------
        // three.js では、ジオメトリとマテリアルを別々に生成し組み合わせることで 3D
        // 空間に配置することができるメッシュを定義できます。
        // 定義したメッシュは、シーンに追加することではじめて描画の対象になります。
        // ------------------------------------------------------------------------
        this.box = new THREE.Mesh(this.geometry, this.material);
        this.scene.add(this.box);
    }

    /**
     * 描画処理
     */
    render() {
        // - 描画フェーズ ---------------------------------------------------------
        // シーンに必要なオブジェクトを追加できたら、いよいよ描画です。
        // 描画を行うためには対象のシーンをレンダラでスクリーンに描画します。このと
        // き、どのカメラで描画するかを同時に指定します。
        // ------------------------------------------------------------------------

        // requestAnimationFrame(this.render.bind(this));
        this.renderer.render(this.scene, this.camera);
    }
}

new Sketch({
    dom: document.getElementById("container")
});