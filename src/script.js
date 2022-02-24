import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import { MorphSVGPlugin } from './gsap/MorphSVGPlugin.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DoubleSide } from 'three'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import $ from "jquery";
import * as dat from 'lil-gui'

const params = {
  backgroundColor: 'ffffff',
  floorColor: 'ffffff',
  starterMat: '0xffffff',
}

// Debug
// const gui = new dat.GUI()
 
const LOADER = document.getElementById('js-loader');

const TRAY = document.getElementById('js-tray-slide');
var loaded = false;
const DRAG_NOTICE = document.getElementById('js-drag-notice');

var activeOption = 'sidemirrors';
const colors = [
  {
    color: 'f94144'
  },
  {
    color: 'f3722c'
  },
  {
    color: 'f9844a'
  },
  {
    color: 'f9c74f'
  },
  {
    color: '90be6d'
  },
  {
    color: '4d908e'
  },
  {
    color: 'f72585'
  },
  {
    color: 'b5179e'
  },
  {
    color: '560bad'
  },
  {
    color: '3f37c9'
  },
  {
    texture: '/textures/Abstract_Organic_005_basecolor.jpg',
    size: [2,2,2],
    shininess: 60
},
{
  texture: '/textures/Terrazo.jpg',
  size: [2,2,2],
  shininess: 60
},
{
  texture: '/textures/Sci-Fi_Wall_014_basecolor.jpg',
  size: [2,2,2],
  shininess: 60
},
{
  texture: '/textures/Skin_Lizard_002_normal.jpg',
  size: [2,2,2],
  shininess: 60
},
{
  texture: '/textures/Stylized_Bricks_002_basecolor.jpg',
  size: [2,2,2],
  shininess: 60
},
{
  texture: '/textures/pattern_.jpg',
  size: [2,2,2],
  shininess: 60
},
{
  color: '131417'  
},
{
  color: '374047'  
},
{
  color: '5f6e78'  
},
{
  color: '7f8a93'  
},
{
  color: '97a1a7'  
},
{
  color: 'acb4b9'  
},
{
  color: 'DF9998',
},
{
  color: '7C6862'
},
{
  color: 'A3AB84'
},
{
  color: 'D6CCB1'
},
{
  color: 'F8D5C4'
},
{
  color: 'A3AE99'
},
{
  color: 'EFF2F2'
},
{
  color: 'B0C5C1'
},
{
  color: '8B8C8C'
},
{
  color: '565F59'
},
{
  color: 'CB304A'
},
{
  color: 'FED7C8'
},
{
  color: 'C7BDBD'
},
{
  color: '3DCBBE'
},
{
  color: '264B4F'
},
{
  color: '389389'
},
{
  color: '85BEAE'
},
{
  color: 'F2DABA'
},
{
  color: 'F2A97F'
},
{
  color: 'D85F52'
},
{
  color: 'D92E37'
},
{
  color: 'FC9736'
},
{
  color: 'C9240E'
},
{
  color: 'EC4B17'
},
{
  color: '281A1C'
},
{
  color: '4F556F'
},
{
  color: '64739B'
},
{
  color: 'CDBAC7'
},
{
  color: '946F43'
},
{
  color: '66533C'
},
{
  color: '173A2F'
},
{
  color: '153944'
},
{
  color: '27548D'
},
{
  color: '438AAC'
}
  ]

var cameraFar = 5.5;

var theModel;
const MODEL_PATH =  "/model/car.glb";

const backgroundColor = 0x8fd3a9;

// Init the scene
const scene = new THREE.Scene();

// Set background
scene.background = new THREE.Color(backgroundColor );
scene.fog = new THREE.Fog( backgroundColor, 200, 1000 );

// gui.addColor(params, 'backgroundColor')
// .onChange(() =>
// {
//     scene.background.set(params.backgroundColor)
// })
// .name('Background Colour')

const canvas = document.querySelector('#c');

// /**
//  * Fonts
//  */
//  const textFont = `
//  CAR
//  PICKER
//  `;


//  const fontLoader = new FontLoader()
//  fontLoader.load(
//   '/fonts/helvetiker_regular.typeface.json',
//   (font) =>
//   {
//       const textGeometry = new TextGeometry(
//           textFont,
//           {
//               font: font,
//               size: 1.2,
//               height: 0.4,
//               curveSegments: 12,
//               bevelEnabled: true,
//               bevelThickness: 0.1,
//               bevelSize: 0.05,
//               bevelSegments: 5
//           }
//       )
//       const textMaterial = new THREE.MeshNormalMaterial()
//       const text = new THREE.Mesh(textGeometry, textMaterial)
//       scene.add(text)
//       text.translateZ(-4);
//       text.translateY(5);
//       text.translateX(-9)
//       text.rotateY(Math.PI / 10);

//   }
// )

const renderer = new THREE.WebGL1Renderer({canvas, antialias: true});

renderer.shadowMap.enabled = true;
renderer.setPixelRatio(window.devicePixelRatio); 
renderer.outputEncoding = THREE.sRGBEncoding;

document.body.appendChild(renderer.domElement);

// Add a camera
var camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = cameraFar;

// Initial material
const INITIAL_MTL = new THREE.MeshPhongMaterial( { color: params.starterMat, shininess: 10 } );
INITIAL_MTL.flipY = false;
INITIAL_MTL.side = DoubleSide;
// If texture is used for color information, set colorspace.
INITIAL_MTL.encoding = THREE.sRGBEncoding;

// gui.addColor(params, 'starterMat')
// .onChange(() =>
// {
//     INITIAL_MTL.color.set(params.starterMat);
// })
// .name('Car colour')


const INITIAL_MAP = [
  {childID: "CarShell", mtl: INITIAL_MTL}, //car shell
  {childID: "CarShell_1", mtl: INITIAL_MTL}, //windows
  {childID: "Backlightback", mtl: INITIAL_MTL}, //inner backlight
  {childID: "Backlightback_1", mtl: INITIAL_MTL}, //main backlight
  {childID: "Wheels", mtl: INITIAL_MTL}, //inner wheel spokes
  {childID: "Bumper", mtl: INITIAL_MTL},
  {childID: "Wheels_1", mtl: INITIAL_MTL}, //wheels
  {childID: "Wheels_2", mtl: INITIAL_MTL}, //inner wheel trims
  {childID: "Car_handles", mtl: INITIAL_MTL},
  {childID: "Car_trim", mtl: INITIAL_MTL},
  {childID: "frontbumper", mtl: INITIAL_MTL},
  {childID: "Headlight", mtl: INITIAL_MTL},
  {childID: "sidemirrors", mtl: INITIAL_MTL},
  {childID: "sidemirrors_1", mtl: INITIAL_MTL}, //inner side mirror thing
  {childID: "windows", mtl: INITIAL_MTL}, //window trims
  {childID: "frontgrillinner_1", mtl: INITIAL_MTL},
  {childID: "frontgrillinner", mtl: INITIAL_MTL},

];

// Init the object loader
var loader = new GLTFLoader();

loader.load(MODEL_PATH, function(gltf) {
  theModel = gltf.scene;

  theModel.traverse((o) => {
    if (o.isMesh) {
      console.log(o.name);
      o.castShadow = true;
   }
  });

// Set the models initial scale   
setCarSize(window.innerWidth <= 600);

const mediaQuery = window.matchMedia('(max-width: 600px)')

function setCarSize(isMobile) {
  // Check if the media query is true
  if (isMobile) {
    // Then log the following message to the console
    theModel.scale.set(1,1,1);
    theModel.position.x = -0.3;
  } else {
    theModel.scale.set(1.4, 1.4, 1.4);
  }
}

function handleTabletChange(e) {
  setCarSize(e.matches);
}

// Register event listener
mediaQuery.addListener(handleTabletChange)

// Initial check
handleTabletChange(mediaQuery)

  // Offset the y position a bit
  theModel.position.y = -1.02;
  theModel.rotation.y = Math.PI / 6;


    // Set initial textures
    for (let object of INITIAL_MAP) {
      initColor(theModel, object.childID, object.mtl);
    }

  // Add the model to the scene
  scene.add(theModel);
 
  // Remove the loader
  LOADER.remove();
  document.body.classList.add('loaded');

}, undefined, function(error) {
  console.error(error)
});

// Function - Add the textures to the models
function initColor(parent, type, mtl) {
  parent.traverse((o) => {
   if (o.isMesh) {
     if (o.name.includes(type)) {
          o.material = mtl;
          o.nameID = type; // Set a new property to identify this object
       }
   }
 });
}

// Add lights
var ambientLight = new THREE.AmbientLight( 0xffffff, 0.2 );
scene.add( ambientLight );

var dirLight = new THREE.DirectionalLight( 0xffffff, 0.8 );
dirLight.position.set( -8, 12, 8 );
dirLight.castShadow = true;
dirLight.shadow.radius = 4;

scene.add( dirLight );


// Floor
var floorGeometry = new THREE.PlaneGeometry(5000, 5000, 1, 1);
var floorMaterial = new THREE.MeshPhongMaterial({
  color: 0x56d27f,
  shininess: 0
});


// gui.addColor(params, 'floorColor')
// .onChange(() =>
// {
//     floorMaterial.color.set(params.floorColor);

// })
// .name('Floor Colour')



var floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -0.5 * Math.PI;
floor.receiveShadow = true;
floor.position.y = -1;
scene.add(floor);

// Add controls
var controls = new OrbitControls( camera, renderer.domElement );
controls.maxPolarAngle = Math.PI / 2;
controls.minPolarAngle = Math.PI / 3;
controls.enableDamping = true;
controls.enablePan = false;
controls.dampingFactor = 0.1;
controls.autoRotate = false; // Toggle this if you'd like the chair to automatically rotate
controls.autoRotateSpeed = 0.2; // 30


function animate() {

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
  
  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }
  
  if (theModel != null && loaded == false) {
    initialRotation();
    DRAG_NOTICE.classList.add('start');
  }
}

animate();

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    var width = window.innerWidth;
    var height = window.innerHeight;
    var canvasPixelWidth = canvas.width / window.devicePixelRatio;
    var canvasPixelHeight = canvas.height / window.devicePixelRatio;
  
    const needResize = canvasPixelWidth !== width || canvasPixelHeight !== height;
    if (needResize) {
      
      renderer.setSize(width, height, false);
    }
    return needResize;
  }
  
  // Function - Build Colors
function buildColors(colors) {
  for (let [i, color] of colors.entries()) {
    let swatch = document.createElement('div');
    swatch.classList.add('tray__swatch');

      
    if (color.texture)
    {
      swatch.style.backgroundImage = "url(" + color.texture + ")"; 
  
    } else
    {
      swatch.style.background = "#" + color.color;
    }


    swatch.setAttribute('data-key', i);
    TRAY.append(swatch);
  }
}

buildColors(colors);

// Select Option
const options = document.querySelectorAll(".option");

for (const option of options) {
  option.addEventListener('click',selectOption);
}

function selectOption(e) {
  let option = e.target;
  activeOption = e.target.dataset.option;
  for (const otherOption of options) {
    otherOption.classList.remove('--is-active');
  }
  option.classList.add('--is-active');
}

// Swatches
function selectSwatch(e) {
  let color = colors[parseInt(e.target.dataset.key)];
  let new_mtl;

 if (color.texture) {
   
   let txt = new THREE.TextureLoader().load(color.texture);
   
   txt.repeat.set( color.size[0], color.size[1], color.size[2]);
   txt.wrapS = THREE.RepeatWrapping;
   txt.wrapT = THREE.RepeatWrapping;
   
   new_mtl = new THREE.MeshPhongMaterial( {
     map: txt,
     shininess: color.shininess ? color.shininess : 10
   });    
 } 
 else
 {
   new_mtl = new THREE.MeshPhongMaterial({
       color: parseInt('0x' + color.color),
       shininess: color.shininess ? color.shininess : 10
       
     });
 }

 new_mtl.side = DoubleSide;
 
 setMaterial(theModel, activeOption, new_mtl);
}

function setMaterial(parent, type, mtl) {
  parent.traverse((o) => {
   if (o.isMesh && o.nameID != null) {
     if (o.nameID == type) {
          o.material = mtl;
       }
   }
 });
}

const swatches = document.querySelectorAll(".tray__swatch");

for (const swatch of swatches) {
  swatch.addEventListener('click', selectSwatch);
}

// Function - Opening rotate
let initRotate = 0;

function initialRotation() {
  initRotate++;
if (initRotate <= 120) {
    theModel.rotation.y += Math.PI / 60;
  } else {
    loaded = true;
  }
}

var slider = document.getElementById('js-tray'), sliderItems = document.getElementById('js-tray-slide'), difference;

function slide(wrapper, items) {
  var posX1 = 0,
      posX2 = 0,
      posInitial,
      threshold = 20,
      posFinal,
      slides = items.getElementsByClassName('tray__swatch');
  
  // Mouse events
  items.onmousedown = dragStart;
  
  // Touch events
  items.addEventListener('touchstart', dragStart);
  items.addEventListener('touchend', dragEnd);
  items.addEventListener('touchmove', dragAction);


  function dragStart (e) {
    e = e || window.event;
     posInitial = items.offsetLeft;
     difference = sliderItems.offsetWidth - slider.offsetWidth;
     difference = difference * -1;
    
    if (e.type == 'touchstart') {
      posX1 = e.touches[0].clientX;
    } else {
      posX1 = e.clientX;
      document.onmouseup = dragEnd;
      document.onmousemove = dragAction;
    }
  }

  function dragAction (e) {
    e = e || window.event;
    
    if (e.type == 'touchmove') {
      posX2 = posX1 - e.touches[0].clientX;
      posX1 = e.touches[0].clientX;
    } else {
      posX2 = posX1 - e.clientX;
      posX1 = e.clientX;
    }
    
    if (items.offsetLeft - posX2 <= 0 && items.offsetLeft - posX2 >= difference) {
        items.style.left = (items.offsetLeft - posX2) + "px";
    }
  }
  
  function dragEnd (e) {
    posFinal = items.offsetLeft;
    if (posFinal - posInitial < -threshold) { } else if (posFinal - posInitial > threshold) {

    } else {
      items.style.left = (posInitial) + "px";
    }

    document.onmouseup = null;
    document.onmousemove = null;
  }

}

slide(slider, sliderItems);


// Select Option
$( ".options-trigger" ).on('click', function() {
 var target = '.' + $(this).data('key');

  if ($(target).hasClass('show-active')) {
    $(target).removeClass('show-active');
    $('.options-trigger.show-active').removeClass('show-active');
    $(this).removeClass('show-active');
  } else {
    $('.option-parents.show-active').removeClass('show-active');
    $('.options-trigger.show-active').removeClass('show-active');
    $(target).addClass('show-active');
    $(this).addClass('show-active');
  }
});

gsap.registerPlugin(MorphSVGPlugin)

//set the initial position and transform-origin#
function popUp() {
  var tl = gsap.timeline();
  //fade and scale up
  tl.fromTo(".rect", 0.4, {opacity:0.5, scale:0}, {opacity:1, scale:1, ease:'Power2.easeIn'})
    //morph to the bowed shape
    .to(".rect", 0.2, {morphSVG:".bowedRect"}, "-=0.1")
    //morph back to the original, but with elastic easing to give it a fun effect.
    .to(".rect", 1, {morphSVG:".rect", ease:'Elastic.easeOut'});

      return tl;
}

  function popDown() {
    var tl = gsap.timeline();

    tl.to(".rect", 0.2, {morphSVG:".bowedRect"})
    .to(".rect", 0.2, {morphSVG:".rect"})
      .fromTo(".rect", 0.2, {opacity:1, scale:1}, {opacity:0, scale:0, ease:'Power2.easeOut'})
      .to(".rect", 0.1, {morphSVG:".rect", ease:'Elastic.easeOut'});
  
      return tl;

  }

//fade and scale up

var tl = gsap.timeline();
gsap.set('.rect', {scale: 0});

$( ".spanner-trigger" ).on('click', function() {
  if ($(this).hasClass('active')) {
    gsap.to($(this), {rotation:-325, duration: 1});
    tl.add(popDown());
    $(this).removeClass('active');
   $('.options-container.open').removeClass('open');
   $('.option-parents.show-active').removeClass('show-active');
} else {
    gsap.to($(this), {rotation:585, duration: 1});
    tl.add(popUp());
    $(this).addClass('active');
    $('.options-container').addClass('open');
    $('.options-trigger:first-child, .option-parents:first').addClass('show-active');
}
});

