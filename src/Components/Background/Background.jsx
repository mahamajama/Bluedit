import * as THREE from 'three';
import { useRef, useEffect, useState } from 'react';
import { useLocation } from 'react-router';

let scene, camera, renderer;
let waterPlane, waterMaterial, groundPlane, light;
let positionAttribute, originalPosition, positionMatrix, originalCamRotation, width, height;
let queue = [];
let pointerHits = [];
let targetScroll = 0;

const initIntensity = 1;
const rippleSpeed = 7;
const rippleRadius = 16;

const daytimeColor = 0xa1e4ff;
const sunsetColor = 0xffc669;
const waterColor = 0xccd1ff;

initThree();

function initThree() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    renderer = new THREE.WebGLRenderer();
    renderer.transmissionResolutionScale = 0.65;
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setAnimationLoop( animate );

    const textureLoader = new THREE.TextureLoader();

    // SKYBOX
    const r = 'src/assets/skybox_partlyCloudy/';
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
    width = 128;  
    height = 72;

    // FOG
    scene.fog = new THREE.Fog(daytimeColor, 16, 33);

    // WATER
    const waterGeometry = new THREE.PlaneGeometry(
        xScale, yScale,
        width - 1, height - 1);
    positionAttribute = waterGeometry.getAttribute('position');
    positionAttribute.setUsage( THREE.DynamicDrawUsage );
    originalPosition = copyPosition(positionAttribute);
    positionMatrix = get2DArray(positionAttribute, width);

    const waterPhysicalMaterial = new THREE.MeshPhysicalMaterial({ 
        color: waterColor, 
        envMap: skyBox,
        envMapIntensity: 2.5,
        refractionRatio: 0.2, 
        reflectivity: 1, 
        ior: 2.3,
        transmission: 1,
        roughness: 0,
        specular: daytimeColor,
        iridescence: 0.3,
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
        texture.repeat.x = 4;
        texture.repeat.y = 4;
    }
    const groundTexture = textureLoader.load('src/assets/Rock057/Rock057_color.jpg', setRepeat);
    const groundNormal = textureLoader.load('src/assets/Rock057/Rock057_normalGl.jpg', setRepeat);
    const groundAO = textureLoader.load('src/assets/Rock057/Rock057_ao.jpg', setRepeat);
    const groundDisplacement = textureLoader.load('src/assets/Rock057/Rock057_displacement.jpg', setRepeat);
    const groundRoughness = textureLoader.load('src/assets/Rock057/Rock057_roughness.jpg', setRepeat);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
        map: groundTexture,
        normalMap: groundNormal,
        aoMap: groundAO,
        displacementMap: groundDisplacement,
        roughness: 0.3,
        roughnessMap: groundRoughness,
    });
    groundPlane = new THREE.Mesh( groundGeometry, groundMaterial );
    waterPlane.add(groundPlane);
    
    // LIGHTS
    const skyColor = daytimeColor;  // light blue
    const groundColor = 0x56c7b4;
    const lightIntensity = 2;
    light = new THREE.HemisphereLight(skyColor, groundColor, lightIntensity);
    scene.add(light);

    const dirLight = new THREE.DirectionalLight(daytimeColor, 3);
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
        setRipple(pointerHits[0].face.a)
    }
}

function setRipple(originIndex) {
    let oX = originIndex % width;
    let oY = Math.floor(originIndex / width);

    const top =  Math.ceil(oY - rippleRadius);
    const bottom = Math.floor(oY + rippleRadius);
    const left =  Math.ceil(oX - rippleRadius);
    const right = Math.floor(oX + rippleRadius);

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
                if (dist < rippleRadius) {
                    let distFactor = dist / rippleRadius;
                    distFactor *= distFactor;
                    const intensityModifier = 1 - distFactor;
                    const intensity = initIntensity * intensityModifier;
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

        deformVertex(index, intensity, queue[i][2]);

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

    queue = queue.filter(animation => animation[1] > 0);

    function deformVertex(index, intensity, delay) {
        const vertex = new THREE.Vector3();
        const x = positionAttribute.getX(index);
        const y = positionAttribute.getY(index);
        const z = originalPosition[index].z;
        vertex.fromBufferAttribute(positionAttribute, index);
        vertex.set(x, y, z - Math.cos((time + delay) * rippleSpeed) * intensity); // update vertex
        positionAttribute.setXYZ(index, vertex.x, vertex.y, vertex.z);
    }
}

function handleScroll(e) {
    const position = e.target.scrollTop;
    targetScroll = originalCamRotation + position * 0.00015;
}

function lerpScroll() {
    camera.rotation.x = THREE.MathUtils.lerp(camera.rotation.x, targetScroll, 0.1);
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

function handleResetScroll(time) {
    const currentRotation = camera.rotation.x;
    //const t = interpolators[cubic](elapsed / duration);
    if (currentRotation === originalCamRotation) {
        scrollResetting = false;
    } else {
        camera.rotation.x = THREE.MathUtils.lerp(currentRotation, originalCamRotation, 0.0001);
    }
}

export default function Background() {
    const container = useRef(null);
    const [canvasMounted, setCanvasMounted] = useState(false);

    useEffect(() => {
        if (container.current && !canvasMounted) {
            container.current.appendChild( renderer.domElement );
            setCanvasMounted(true);

            document.getElementById("contentContainer").addEventListener('scroll', handleScroll, { passive: true });
        }
    }, [container]);

    return (
        <div className="backgroundContainer" ref={container}></div>
    );
}