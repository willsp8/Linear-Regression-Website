import { useEffect, useState, useRef, useMemo  } from 'react'

import '../App.css'
import axios from 'axios'
import Select from 'react-select'

import { NavBar } from '../NavBar'

import * as THREE from "three"
import { Canvas, extend, useFrame, useLoader } from "@react-three/fiber"
import { Clouds, Cloud, CameraControls, Sky as SkyImpl, StatsGl, Html } from "@react-three/drei"
import { Effects } from '@react-three/drei'
import { FilmPass, WaterPass, UnrealBloomPass, LUTPass, LUTCubeLoader } from 'three-stdlib'

extend({ WaterPass, UnrealBloomPass, FilmPass, LUTPass })



function About() {
    return (
      <div>
        <NavBar></NavBar>
        <div style={{ width: "100vw", height: "100vh" }}> 
            
            <Canvas linear flat legacy dpr={1} camera={{ fov: 100, position: [0, 0, 30] }}>
                <ambientLight intensity={0.01} />
                <pointLight distance={60} intensity={4} color="lightblue" />
                <spotLight intensity={0.0} position={[0, 0, 2000]} penumbra={1} color="blue" />
                
                <Swarm count={2} />
                <Swarm2></Swarm2>
                <Postpro />
                
                            
                <Html fullscreen>
                    
                </Html>
            </Canvas>
        </div>
    </div>
    )
}

function Swarm({ count, dummy = new THREE.Object3D() }) {
    const mesh = useRef()
    const light = useRef()
    const particles = useMemo(() => {
      const temp = []
      for (let i = 0; i < count; i++) {
        const t = Math.random() * 100
        const factor = 20 + Math.random() * 100
        const speed = 0.01 + Math.random() / 200
        const xFactor = -50 + Math.random() * 100
        const yFactor = -50 + Math.random() * 100
        const zFactor = -50 + Math.random() * 100
        temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 })
      }
      return temp
    }, [count])
    useFrame((state) => {
     // light.current.position.set((-state.mouse.x * state.viewport.width) / 5, (-state.mouse.y * state.viewport.height) / 5, 0)
      light.current.rotation.y += 0.02
      light.current.rotation.y += 0.01
      
      if(light.current.position.y > -20){
        light.current.position.y -= 0.2
      console.log(light.current.position.y)
      }else{
        light.current.position.y += 0.2
      }
      mesh.current.instanceMatrix.needsUpdate = true
    })
    return (
      <>
        <pointLight ref={light} distance={40} intensity={8} color="lightblue">
          <mesh scale={[1, 1, 1]} position={[5, 0, 1]}>
            <dodecahedronGeometry args={[1, 0]} />
          </mesh>
          <mesh scale={[1, 10, 1]} position={[0, 10, 1]}>
            <dodecahedronGeometry args={[1, 0]} />
          </mesh>
          
          <mesh scale={[1, 1, 1]} position={[20, 20, 1]}>
            <dodecahedronGeometry args={[1, 0]} />
          </mesh>


        </pointLight>
        <instancedMesh ref={mesh} args={[null, null, count]}>
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#020000" roughness={0.5} />
        </instancedMesh>
      </>
    )
}

function Swarm2({ count, dummy = new THREE.Object3D() }) {
    const mesh = useRef()
    const light = useRef()
    const particles = useMemo(() => {
      const temp = []
      for (let i = 0; i < count; i++) {
        const t = Math.random() * 100
        const factor = 20 + Math.random() * 100
        const speed = 0.01 + Math.random() / 200
        const xFactor = -50 + Math.random() * 100
        const yFactor = -50 + Math.random() * 100
        const zFactor = -50 + Math.random() * 100
        temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 })
      }
      return temp
    }, [count])
    useFrame((state) => {
     // light.current.position.set((-state.mouse.x * state.viewport.width) / 5, (-state.mouse.y * state.viewport.height) / 5, 0)
      //light.current.rotation.y += 0.2
      light.current.rotation.z -= 0.01
      mesh.current.instanceMatrix.needsUpdate = true
    })
    return (
      <>
        <pointLight ref={light} distance={40} intensity={8} color="lightblue">
          {/* <mesh scale={[1, 1, 6]} position={[5, 0, 1]}>
            <dodecahedronGeometry args={[1, 0]} />
          </mesh>
          <mesh scale={[1, 1, 6]} position={[0, 10, 1]}>
            <dodecahedronGeometry args={[1, 0]} />
          </mesh>
          <mesh scale={[1, 1, 6]} position={[10, -10, 1]}>
            <dodecahedronGeometry args={[1, 0]} />
          </mesh>
          <mesh scale={[1, 1, 6]} position={[15, -20, 1]}>
            <dodecahedronGeometry args={[1, 0]} />
          </mesh> */}
        </pointLight>
        <instancedMesh ref={mesh} args={[null, null, count]}>
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#020000" roughness={0.5} />
        </instancedMesh>
      </>
    )
}
  
function Postpro() {
    const water = useRef()
    const data = useLoader(LUTCubeLoader, '/cubicle.CUBE')
    useFrame((state) => (water.current.time = state.clock.elapsedTime * 4))
    return (
      <Effects disableGamma>
        <waterPass ref={water} factor={1} />
        <unrealBloomPass args={[undefined, 1.25, 1, 0]} />
        <filmPass args={[0.2, 0.5, 1500, false]} />
        <lUTPass lut={data.texture} intensity={0.75} />
      </Effects>
    )
}

export default About