import * as THREE from 'three';
import { useRef, useEffect, useState } from 'react';
import { useLocation } from 'react-router';

import { getRandomInt, getRandomNumber, clamp } from '../../utils/helpers';

let scene, camera, renderer;
let waterPlane, waterMaterial, groundPlane, light;
let positionAttribute, originalPosition, positionMatrix, originalCamRotation, waterWidth, waterHeight;
let queue = [];
let pointerHits = [];
let targetScroll = 0;

const clickIntensity = 1;
const rippleSpeed = 10;
const rippleRadius = 16;

const daytimeColor = 0xa1e4ff;
const sunsetColor = 0xffc669;
const waterColor = 0xb7fff3;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    renderer = new THREE.WebGLRenderer();
    renderer.transmissionResolutionScale = 0.65;
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setAnimationLoop( animate );

    const textureLoader = new THREE.TextureLoader();

    // SKYBOX
    const r = '/skybox_partlyCloudy/';
    const skyboxUrls = [
        r + 'px.png', r + 'nx.png',
        r + 'py.png', r + 'ny.png',
        r + 'pz.png', r + 'nz.png'
    ];
    const skyBox = new THREE.CubeTextureLoader().load(skyboxUrls);
	skyBox.mapping = THREE.CubeRefractionMapping;
    scene.background = new THREE.Color(daytimeColor);
    scene.environment = skyBox;

    const xScale = 80;  
    const yScale = 45;
    waterWidth = 128;  
    waterHeight = 72;

    // FOG
    scene.fog = new THREE.Fog(daytimeColor, 16, 33);

    // WATER
    const waterGeometry = new THREE.PlaneGeometry(
        xScale, yScale,
        waterWidth - 1, waterHeight - 1);
    positionAttribute = waterGeometry.getAttribute('position');
    positionAttribute.setUsage( THREE.DynamicDrawUsage );
    originalPosition = copyPosition(positionAttribute);
    positionMatrix = get2DArray(positionAttribute, waterWidth);

    const waterPhysicalMaterial = new THREE.MeshPhysicalMaterial({ 
        color: waterColor, 
        envMap: skyBox,
        envMapIntensity: 4,
        refractionRatio: 0.1, 
        reflectivity: 1, 
        ior: 2.3,
        transmission: 1,
        roughness: 0,
        specular: sunsetColor,
        iridescence: 0.2,
        flatShading: true,
        thickness: 1,
    });
    waterMaterial = waterPhysicalMaterial;
    waterPlane = new THREE.Mesh( waterGeometry, waterMaterial );
    scene.add(waterPlane);
    
    // GROUND
    const groundGeometry = new THREE.PlaneGeometry(
        xScale * 1.5, yScale * 1.5,
        1, 1);
    function setRepeat(texture) {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.x = 8;
        texture.repeat.y = 4;
        texture.magFilter = THREE.NearestFilter;
    }
    const groundTexture = textureLoader.load('/RiverRocks/river_small_rocks_diff_sm.jpg', setRepeat);
    const groundNormal = textureLoader.load('/RiverRocks/river_small_rocks_nor_gl_2k.jpg', setRepeat);
    const groundAO = textureLoader.load('/RiverRocks/river_small_rocks_ao_sm.jpg', setRepeat);
    const groundDisplacement = textureLoader.load('/RiverRocks/river_small_rocks_disp_sm.jpg', setRepeat);
    const groundRoughness = textureLoader.load('/RiverRocks/river_small_rocks_rough_sm.jpg', setRepeat);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xb3977f,
        map: groundTexture,
        normalMap: groundNormal,
        aoMap: groundAO,
        displacementScale: 1.3,
        displacementMap: groundDisplacement,
        roughness: 0.3,
        roughnessMap: groundRoughness,
    });
    groundPlane = new THREE.Mesh( groundGeometry, groundMaterial );
    waterPlane.add(groundPlane);
    
    // LIGHTS
    const skyColor = sunsetColor;  // light blue
    const groundColor = 0x56c7b4;
    const lightIntensity = 2;
    light = new THREE.HemisphereLight(skyColor, groundColor, lightIntensity);
    scene.add(light);

    const dirLight = new THREE.DirectionalLight(0xffffff, 3);
    dirLight.position.set(-2, 6, -3);
    dirLight.target.position.set(2, -3, 3);
    scene.add(dirLight);
    scene.add(dirLight.target);
    
    // POSITIONING
    camera.position.y = 12;
    originalCamRotation = -(Math.PI / 2);
    targetScroll = originalCamRotation;
    camera.rotation.x = originalCamRotation;

    waterPlane.rotation.x = originalCamRotation;
    waterPlane.position.z = -12;

    groundPlane.position.z = -5;

    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener('mousedown', onClickBackground);
}

function onWindowResize( event ) {
    camera.aspect = window.innerWidth / window.innerHeight;
    
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.render( scene, camera );
}

function animate(t) {
    const time = t / 1000;

    ripple(time);

    if (Math.abs(camera.rotation.x - targetScroll) > 0.001) {
        lerpScroll(t);
    }

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
        setRipple(pointerHits[0].face.a, clickIntensity);
    }
}

function setRipple(originIndex, strength) {
    const radius = Math.floor(strength * rippleRadius);

    let oX = originIndex % waterWidth;
    let oY = Math.floor(originIndex / waterWidth);

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
                    let distFactor = dist / radius;
                    distFactor *= distFactor;
                    const intensityModifier = 1 - distFactor;
                    const intensity = strength * intensityModifier;
                    const delay = distFactor * 3;
                    
                    setTimeout(() => {
                        executeRipple(positionMatrix[y][x], intensity, delay);
                    }, delay * 1000);
                }
            }
        }
    }
}

function executeRipple(index, intensity, delay) {
    const toQueue = [index, intensity, delay];
    const rippling = isRippling(index);
    if (rippling) { // if its already animating, replace it in the queue
        if (queue[rippling][1] < intensity) { // only if its stronger than the original
            queue[rippling] = toQueue;
        }
    } else {
        queue.push(toQueue);
    }
}

function isRippling(index) {
    const i = queue.findIndex(animation => animation[0] === index);
    return i > -1 ? i : null;
}

function ripple(time) {
    const damping = 0.004;
    // 0: index, 1: currentIntensity, 2: delay
    for (let i = 0; i < queue.length; i++) {
        const index = queue[i][0];
        const intensity = queue[i][1];
        const delay = queue[i][2] + time;

        deformVertex(index, intensity, delay);

        let damper = damping;
        if (intensity < 0.01) {
            damper = damping * 0.005;
        } else if (intensity < 0.1) {
            damper = damping * 0.05;
        } else if (intensity < 0.3) {
            damper = damping * 0.3;
        }
        let newIntensity = intensity - damper;
        if (newIntensity < 0) newIntensity = 0;
        queue[i][1] = newIntensity;
    }

    positionAttribute.needsUpdate = true;
    //waterPlane.geometry.computeVertexNormals(); // needed if flat shading is off

    arrayShiftFilter();
    //queue = queue.filter(animation => animation[1] > 0);
}

function arrayShiftFilter () {
    let newQueue = [];

    for (let i = 0; i < queue.length; i++) {
        if (queue[i][1] > 0) {
            newQueue.push(queue[i]);
        }
    }

    queue = newQueue;
}
Array.prototype.shiftFilter = function aarrayShiftFilter (predicate) {
    let i, j;

    for (i = 0, j = 0; i < this.length; ++i) {
        if (predicate(this[i])) {
            this[j] = this[i];
            ++j;
        }
    }

    while (j < this.length) {
        this.pop();
    }
}

function deformVertex(index, intensity, delay) {
    const vertex = new THREE.Vector3();
    const x = positionAttribute.getX(index);
    const y = positionAttribute.getY(index);
    const z = originalPosition[index].z;
    vertex.fromBufferAttribute(positionAttribute, index);
    vertex.set(x, y, z - Math.cos(delay * rippleSpeed) * intensity); // update vertex
    positionAttribute.setXYZ(index, vertex.x, vertex.y, vertex.z);
}

function setRippleTrail(x, y, width, height) {
    const n = 6;
    const delay = 0.15 * 1000;
    const xMax = clamp(x + width, x, waterWidth);
    const yMax = clamp(y + height, y, waterHeight);
    for (let i = 0; i < n; i++) {
        setTimeout(() => {
            const index = positionMatrix[getRandomInt(y, yMax)][getRandomInt(x, xMax)];
            const intensity = getRandomNumber(0.1, 0.5);
            setRipple(index, intensity);
        }, delay * i);
    }
}

function handleScroll(e) {
    const position = e.target.scrollTop;
    targetScroll = originalCamRotation + position * 0.00015;
}

function lerpScroll() {
    camera.rotation.x = THREE.MathUtils.lerp(camera.rotation.x, targetScroll, 0.075);
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

export default function Background({ initiated }) {
    let location = useLocation();
    const container = useRef(null);
    const [canvasMounted, setCanvasMounted] = useState(false);

    useEffect(() => {
        if (initiated && container.current && !canvasMounted) {
            init();
            container.current.appendChild( renderer.domElement );
            setCanvasMounted(true);

            document.getElementById("contentContainer").addEventListener('scroll', handleScroll, { passive: true });
        }
    }, [container, initiated]);

    useEffect(() => {
        if (canvasMounted) {
            setRippleTrail(40, 30, 40, 40);
        }
    }, [location])

    return (
        <div className="backgroundContainer" ref={container}></div>
    );
}