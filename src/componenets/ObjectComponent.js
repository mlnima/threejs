import React, {useEffect, useState, useContext, useRef} from 'react';
import * as THREE from 'three'
import OrbitControls from 'three-orbitcontrols';
import './ObjectComponent.scss'
import WoodenBox from '../objects/woodenBox/Crate1.obj'
import boxTexture from '../objects/download.jpg'


const ObjectComponent = props => {
    const ObjectComponentElement = useRef(null)
    let raycaster = new THREE.Raycaster();
    let mouse = new THREE.Vector2();
    let quaternion = new THREE.Quaternion();

    const [state, setState] = useState({
            currentUp: 0,
            currentRight: 0,
            currentDown: 0,
            currentLeft: 0,
            selectedObjectPosition: {}
        }
    )


    const [currentObject, setCurrentObject] = useState({
        x: 0,
        y: 0,
        z: 0
    })

    const [objects, setObjects] = useState([])


    let camera
    let scene
    let renderer
    let mesh
    let mesh2
    let geometry
    let geometry2
    let material
    let controls
    let color


    const addObject = async (position) => {
        console.log(position)
        let object = new THREE.BoxGeometry(2, 1, 1);
        const texture = new THREE.TextureLoader().load(boxTexture)
        let material = new THREE.MeshBasicMaterial({map: texture})
        // material = new THREE.MeshBasicMaterial({ color: props.frameColor,});
        let mesh = new THREE.Mesh(object, material);





        setObjects([
            ...objects,
            {mesh, position}
        ])
        setCurrentObject({
            ...currentObject,
            ...position
        })



    }

    useEffect(() => {
        init()
        animate()
        window.addEventListener('mousemove', onMouseMove, false)
        window.addEventListener('click', render, false)
        window.addEventListener('contextmenu', onContextMenuHandler, false)
        window.requestAnimationFrame(animate);
    }, [objects]);

    useEffect(() => {
        addObject({x:0,y:0,z:0})

    }, []);

    const init = () => {
        ObjectComponentElement.current.querySelectorAll('*').forEach(n => n.remove());
        scene = new THREE.Scene()
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerWidth, 0.1, 1000)
        renderer = new THREE.WebGL1Renderer()
        renderer.setSize(window.innerWidth, window.innerHeight)

        camera.position.x = currentObject.x
        camera.position.z =  currentObject.z === 0 ? currentObject.z+10:currentObject.z
        camera.position.y =  currentObject.y
        //control the Camera
        controls = new OrbitControls(camera, renderer.domElement);

        //render meshes
        if (objects.length > 0) {
            objects.forEach(object => {
                let meshToRender = object.mesh
                meshToRender.position.x = object.position.x
                meshToRender.position.y = object.position.y
                meshToRender.position.z = object.position.z
                scene.add(meshToRender);
            })
        }
        ObjectComponentElement.current.appendChild(renderer.domElement)

    }


    const animate = () => {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }


    const onMouseMove = (e) => {
        // e.preventDefault();
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    }


    const render = () => {
        raycaster.setFromCamera(mouse, camera);
        let intersects = raycaster.intersectObjects(scene.children);

        intersects.forEach(child => {
            intersects[intersects.indexOf(child)].object.material.color.set("green");
            const position = JSON.parse(JSON.stringify(intersects[intersects.indexOf(child)].object.position))
            // console.log(position)
            // intersects.forEach(childToRemoveColor=>{
            //     if (intersects.indexOf(childToRemoveColor) !== intersects.indexOf(child)){
            //         const texture = new THREE.TextureLoader().load(boxTexture)
            //         intersects[intersects.indexOf(childToRemoveColor)].object.material = new THREE.MeshBasicMaterial({map: texture})
            //     }
            //
            // })
            setCurrentObject({
                ...currentObject,
                ...position
            })
        })

        renderer.render(scene, camera);
    }


    useEffect(() => {
        console.log(currentObject)
    }, [currentObject]);

    const onContextMenuHandler = () => {

        raycaster.setFromCamera(mouse, camera);
        let intersects = raycaster.intersectObjects(scene.children);

        intersects.forEach(child => {
            const texture = new THREE.TextureLoader().load(boxTexture)
            intersects[intersects.indexOf(child)].object.material = new THREE.MeshBasicMaterial({map: texture})

        })

        renderer.render(scene, camera);

    }

    // useEffect(() => {
    //     console.log(currentObject.x)
    //    // Quaternion example = Quaternion.currentObjec vt.x
    // }, [currentObject]);
const onDeleteHandler = ()=>{
       const newDataToSet =  objects.filter(object=>JSON.stringify(object.position) !== JSON.stringify(currentObject))
       setObjects(newDataToSet)
}




    return (
        <>
            <div className='control'>
                <button onClick={() => addObject({...currentObject,y : currentObject.y + 1})}>up
                </button>
                <button onClick={() => addObject({...currentObject,x : currentObject.x + 2})}>right
                </button>
                <button onClick={() => addObject({...currentObject,y : currentObject.y - 1})}>down
                </button>
                <button onClick={() => addObject({...currentObject,x : currentObject.x - 2})}>left
                </button>
                <button onClick={()=>onDeleteHandler()}>Delete</button>
                <textarea className='showState' value={JSON.stringify(currentObject)}/>
                {/*<button onClick={()=>setCurrentObject({...currentObject,'x':20})}>test</button>*/}
            </div>

            <div ref={ObjectComponentElement} id='ObjectComponentElement'
                // onClick={e=>{onClickHandler(e)}}
            >
            </div>
        </>
    );

};
export default ObjectComponent;
//
// useEffect(() => {
//     init()
//     animate()
// }, [props]);
//
// let camera
// let scene
// let renderer
// let mesh
// let geometry
// let material
// let controls
// let color
// let loader = new THREE.ObjectLoader();
// loader.load(
//     '../models/happy-buddha-webgl-sub-surface-scattering.json',
//     // onLoad callback
//     // Here the loaded data is assumed to be an object
//     function ( obj ) {
//         // Add the loaded object to the scene
//         scene.add( WoodenBox );
//     },
//
//     // onProgress callback
//     function ( xhr ) {
//         console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
//     },
//
//     // onError callback
//     function ( err ) {
//         console.error( 'An error happened' );
//     }
// );
//
// const init = () => {
//     ObjectComponentElement.current.querySelectorAll('*').forEach(n => n.remove());
//     camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.01, 10);
//     camera.position.z = 1;
//     scene = new THREE.Scene();
//     // geometry = new THREE.SphereGeometry(0.2, 0.2, 0.2);
//     geometry = new THREE.SphereGeometry(0.2, 0.2, 0.2);
//     color = new THREE.Color("white");
//     material = new THREE.MeshBasicMaterial({
//         color: props.frameColor,
//
//     });
//     mesh = new THREE.Mesh(geometry, material);
//     scene.add(mesh);
//     renderer = new THREE.WebGLRenderer({antialias: true});
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     controls = new OrbitControls(camera, renderer.domElement);
//     ObjectComponentElement.current.appendChild(renderer.domElement)
// }
//
// const animate = () => {
//     requestAnimationFrame(animate);
//     controls.update();
//     renderer.render(scene, camera);
//
// }