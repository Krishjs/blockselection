var depot = {};
depot.block = depot.block || {};

depot.block.design = (function () {
    var self = this;
    this.group = null;
    this.scene = null;
    this.init = function (frame, data) {
        var width = data.width;
        var height = data.height;
        this.frame = document.getElementById(frame);

        //scene
        this.scene = new THREE.Scene();

        //camera
        this.camera = new THREE.PerspectiveCamera(data.camera.angle, width / height, data.camera.nearclip, data.camera.farclip);
        this.camera.position.set(data.camera.positionX, data.camera.positionY, data.camera.positionZ);
        this.scene.add(this.camera);

        //renderer
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(width, height);
        this.frame.appendChild(this.renderer.domElement);

        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.maxPolarAngle = Math.PI * 0.5;
        this.controls.minDistance = 1000;
        this.controls.maxDistance = 7500;

        this.raycaster = new THREE.Raycaster();

        //Block
        var containerGeo = new THREE.CubeGeometry(100, 50, 200);
        var containerMaterial = new THREE.MeshBasicMaterial({
            color: 0xff2222,
            transparent: false,
            opacity: 0,
            wireframe: true
        });



        var rowindex = 1;
        var columnindex = 1;
        var stackindex = 1;
        var columnSize = 200,
            rowSize = 400,
            stackSize = 100;
        var totalWidth = data.columns * columnSize;
        var totalHeight = data.rows * rowSize;
        var totalDepth = data.stack * stackSize;
        for (; stackindex <= data.stack;) {
            for (; rowindex <= data.rows;) {
                for (; columnindex <= data.columns;) {
                    containerGeo.addEventListener('clicked', function () {
                        console.log(this);
                    });
                    var geo = new THREE.WireframeGeometry( containerGeo );
                    var mesh = new THREE.Mesh(containerGeo, containerMaterial);
                    mesh.position.x = (totalWidth / 2) - ((columnindex - 1) * columnSize);
                    mesh.position.y = -125 + ((stackindex - 1) * stackSize);
                    mesh.position.z = (totalHeight / 2) - ((rowindex - 1) * rowSize);

                    this.scene.add(mesh);

                    // var cube = new THREE.BoxHelper();
                    // cube.material.color.setRGB(1, 0, 0);
                    // cube.scale.set((totalWidth / 2) - ((columnindex - 1) * columnSize), -125 + ((stackindex - 1) * stackSize), 
                    // (totalHeight / 2) - ((rowindex - 1) * rowSize));                    
                    // this.scene.add(cube);
                    
                    columnindex++;
                }
                columnindex = 1;
                size = 0;
                rowindex++;
            }
            rowindex = 1;
            stackindex++;
        }
        //Activate
        this.resizer = data.resizer;
        this.registerEvents();
        this.animate(this);

    };
    this.mousePosition = new THREE.Vector2();
    this.intersected = null;
    this.registerEvents = function () {
        var scope = this;
        window.addEventListener('resize', function () {
            scope.OnResize();
        }, false);
        window.addEventListener('mousemove', function () {
            scope.onmousemove();
        }, false);
    };
    this.loadGroud = function (group, data) {
        var rowindex = 1;
        var columnindex = 1;
        var stackindex = 1;
        for (; stackindex <= data.stack;) {
            var div = document.createElement('div');
            div.className = 'layer';
            for (; rowindex <= data.rows;) {
                var rowgap = document.createElement('img');
                rowgap.style.height = '10%';
                rowgap.style.width = '100%';
                div.appendChild(rowgap);

                for (; columnindex <= data.columns;) {
                    var height = ((100 - ((data.rows + 1) * 5)) / data.rows) + '%';

                    var gap = document.createElement('img');
                    gap.style.height = height;
                    gap.style.width = '2%';
                    div.appendChild(gap);

                    var img = document.createElement('img');
                    img.src = 'css/images/grey.png';
                    img.className = 'cell';
                    img.style.height = height;
                    img.style.width = ((100 - ((data.columns + 1) * 2)) / data.columns) + '%';
                    img.style.zIndex = stackindex * 100;
                    img.onclick = function () {
                        this.className = this.className + ' selected';
                    }
                    div.appendChild(img);

                    columnindex++;
                }
                columnindex = 1;
                rowindex++;
            }
            rowindex = 1;
            stackindex++;
            var object = new THREE.CSS3DObject(div);
            object.rotation.x = -Math.PI / 2;
            object.position.y = -350 + (stackindex * 200);
            group.add(object);
        }
    };
    this.OnResize = function () {
        var dimension = this.resizer();
        var width = dimension.width;
        var height = dimension.height;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    };
    this.onmousemove = function () {
        event.preventDefault();
        this.mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }
    this.animate = function (scope) {
        requestAnimationFrame(function () {
            scope.animate(scope);
        });
        scope.controls.update();
        // this.raycaster.setFromCamera(scope.mousePosition, scope.camera);
        // var intersects = this.raycaster.intersectObjects(scope.scene.children);
        // if (intersects.length > 0) {
        //     if (this.intersected != intersects[0].object) {
        //         if (this.intersected) this.intersected.material.transparent = this.intersected.transparent;
        //         this.intersected = intersects[0].object;
        //         this.intersected.transparent = this.intersected.material.transparent;
        //         this.intersected.material.transparent = true;
        //     }
        // } else {
        //     if (this.intersected) this.intersected.material.transparent = this.intersected.transparent;
        //     this.intersected = null;
        // }
        scope.renderer.render(scope.scene, scope.camera);
    };
});
var block = new depot.block.design();
block.init('container', {
    width: window.innerWidth,
    height: window.innerHeight,
    rows: 1,
    columns: 1,
    stack: 1,
    resizer: function () {
        return {
            width: window.innerWidth,
            height: window.innerHeight
        }
    },
    camera: {
        angle: 30,
        nearclip: 1,
        farclip: 10000,
        positionX: 1760,
        positionY: 26,
        positionZ: 1715,
    }
});
//1755.4818086820571, y: 25.691395877588107, z: 1713.6971687846}