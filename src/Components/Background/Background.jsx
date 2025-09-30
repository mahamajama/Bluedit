import * as THREE from 'three';
import { useRef, useEffect, useState } from 'react';
import skyBox1 from '../../assets/skybox_partlyCloudy.png';

let scene, camera, renderer, cubeCamera;
let waterPlane, waterMaterial, groundPlane, light;
let positionAttribute, originalPosition, positionMatrix, originalCamRotation, width, height;
let queue = [];
let pointerHits = [];

const clickIntensity = 1;

initThree();

function initThree() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setAnimationLoop( animate );

    const r = 'src/assets/skybox_partlyCloudy/';
    const skyboxUrls = [
        r + 'px.png', r + 'nx.png',
        r + 'py.png', r + 'ny.png',
        r + 'pz.png', r + 'nz.png'
    ];
    const skyBox = new THREE.CubeTextureLoader().load(skyboxUrls);
	skyBox.mapping = THREE.CubeRefractionMapping;
    scene.background = skyBox;
    scene.environment = skyBox;

    const xScale = 30;  
    const yScale = 30;
    width = 100;  
    height = 100;

    const waterGeometry = new THREE.PlaneGeometry(
        xScale, yScale,
        width - 1, height - 1);
    positionAttribute = waterGeometry.getAttribute('position');
    positionAttribute.setUsage( THREE.DynamicDrawUsage );
    originalPosition = copyPosition(positionAttribute);
    positionMatrix = get2DArray(positionAttribute, width);

    let newPos = [];
    for (let i = 0; i < positionAttribute.count; i++) {
        const x = positionAttribute.getX( i );
        const y = positionAttribute.getY( i );
        const z = positionAttribute.getZ( i );

        newPos.push(x, y, z + 2);
    }

    waterMaterial = new THREE.MeshPhongMaterial({ 
                                color: 0xbee7ff, 
                                envMap: skyBox, 
                                refractionRatio: 0.7, 
                                reflectivity: 1, 
                                transparent: true, 
                                opacity: 0.3,
                                shininess: 100,
                                specular: 0xffc669,
                                flatShading: true,
                            });
    waterPlane = new THREE.Mesh( waterGeometry, waterMaterial );
    scene.add(waterPlane);

    const groundGeometry = new THREE.PlaneGeometry(
        xScale * 0.5, yScale * 0.5,
        2, 2);
    const groundTexture = new THREE.TextureLoader().load('src/assets/jess-vide.jpg');
    const groundMaterial = new THREE.MeshPhongMaterial( { map: groundTexture } );
    groundPlane = new THREE.Mesh( groundGeometry, groundMaterial );
    waterPlane.add(groundPlane);

    const skyColor = 0xb1ccff;  // light blue
    const groundColor = 0x56c7b4;
    const lightIntensity = 8;
    light = new THREE.HemisphereLight(skyColor, groundColor, lightIntensity);
    scene.add(light);

    const dirLight = new THREE.DirectionalLight(0xffc669, 3);
    dirLight.position.set(2, -6, -4);
    dirLight.target.position.set(-2, 6, 4);
    scene.add(dirLight);
    scene.add(dirLight.target);

    camera.position.y = -10;
    originalCamRotation = Math.PI / 2;
    camera.rotation.x = originalCamRotation;
    waterPlane.rotation.x = originalCamRotation;
    groundPlane.position.z = -10;
    //camera.lookAt( waterPlane.position );

    window.addEventListener( 'resize', onWindowResize, false );
    window.addEventListener( 'mousedown', onClickBackground );
    window.addEventListener('scroll', handleScroll, { passive: true });
}

function onWindowResize( event ) {
    camera.aspect = window.innerWidth / window.innerHeight;
    
    camera.updateProjectionMatrix();
    //camera.lookAt( waterPlane.position );

    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.render( scene, camera );
}

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function onClickBackground( event ) {
	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    raycaster.setFromCamera( pointer, camera );
    pointerHits = raycaster.intersectObject( waterPlane, true );
    if (pointerHits.length > 0) {
        setRipple(pointerHits[0].face.a)
    }
}

function animate(t) {
    const time = t / 1000;

    ripple(time);

    renderer.render( scene, camera );
}

function setRipple(originIndex) {
    let oX = originIndex % width;
    let oY = Math.floor(originIndex / width);

    const radius = 16;

    const top =  Math.ceil(oY - radius);
    const bottom = Math.floor(oY + radius);
    const left =  Math.ceil(oX - radius);
    const right = Math.floor(oX + radius);

    function getCircleDistance(currentX, currentY) {
        const dx = oX - currentX;
        const dy = oY - currentY;
        const distanceSquared = dx * dx + dy * dy;
        return Math.sqrt(distanceSquared);
    }

    for (let y = top; y <= bottom; y++) {
        for (let x = left; x <= right; x++) {
            if (positionMatrix[y] && positionMatrix[y][x]) {
                const dist = getCircleDistance(x, y);
                if (dist < radius) {
                    const distFactor = dist / radius;
                    const intensityModifier = (1 - distFactor) * 0.9;
                    const intensity = clickIntensity * intensityModifier;
                    const delay = distFactor * 1.2;
                    setTimeout(() => {
                        const rippleIndex = positionMatrix[y][x];
                        const toQueue = [rippleIndex, intensity, delay];
                        const rippling = isRippling(rippleIndex);
                        if (rippling) { // if its already animating, replace it in the queue
                            if (queue[rippling][1] < intensity) {
                                queue[rippling] = toQueue;
                            }
                        } else {
                            queue.push(toQueue);
                        }
                    }, delay * 1000);
                }
            }
        }
    }
}

function isRippling(index) {
    for (let i = 0; i < queue.length; i++) {
        if (queue[i][0] === index) {
            return i;
        }
    }
    return null;
}

function ripple(time) {
    const speed = 10;
    const damping = 0.003;
    let expired = [];
    // 0: index, 1: currentIntensity
    for (let i = 0; i < queue.length; i++) {
        const index = queue[i][0];
        let intensity = queue[i][1];

        deformVertex(index, intensity, queue[i][2]);

        let damper = damping;
        if (intensity < 0.3) {
            damper = damping * 0.1;
        } else if (intensity < 0.08) {
            damper = damping * 0.006;
        }
        const newIntensity = intensity - damper;
        if (newIntensity > 0) {
            queue[i][1] = newIntensity;
        } else {
            expired.push(index);
        }
    }

    positionAttribute.needsUpdate = true;
    //waterPlane.geometry.computeVertexNormals();

    expired.forEach(expiredIndex => {
        queue = queue.filter(ripple => ripple[0] !== expiredIndex);
    })

    function deformVertex(index, intensity, delay) {
        const vertex = new THREE.Vector3();
        const x = positionAttribute.getX(index);
        const y = positionAttribute.getY(index);
        const z = originalPosition[index].z;
        vertex.fromBufferAttribute(positionAttribute, index);
        vertex.set(x, y, z - Math.cos((time + delay) * speed) * intensity); // update vertex
        positionAttribute.setXYZ(index, vertex.x, vertex.y, vertex.z);
    }
}

function handleScroll(e) {
    const position = window.pageYOffset;
    camera.rotation.x = originalCamRotation + position * 0.0001;
}

function copyPosition(positionAttribute) {
    let arr = [];
    for (let i = 0; i < positionAttribute.count; i++) {
        const vertex = new THREE.Vector3();
        const x = positionAttribute.getX(i);
        const y = positionAttribute.getY(i);
        const z = positionAttribute.getZ(i);
        vertex.set(x, y, z);
        arr.push(vertex)
    }
    return arr;
}

function get2DArray(positions, width) {
    let arr = [];
    let seg = [];
    for (let i = 0; i < positions.count; i++) {
        seg.push(i);

        if ((i + 1) % width === 0) {
            arr.push(seg);
            seg = [];
        }
    }

    return arr;
}

export default function Background() {
    const container = useRef(null);
    const [canvasMounted, setCanvasMounted] = useState(false);
    useEffect(() => {
        if (container.current && !canvasMounted) {
            container.current.appendChild( renderer.domElement );
            setCanvasMounted(true);
        }
    }, [container])
    return (
        <div className="backgroundContainer" ref={container}></div>
    );
}