"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { useRef, useMemo } from "react"
import * as THREE from "three"

function FloatingParticles({ count = 500 }) {
  const mesh = useRef<THREE.Points>(null)
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20
      
      // Green-ish accent colors
      colors[i * 3] = 0.3 + Math.random() * 0.2
      colors[i * 3 + 1] = 0.8 + Math.random() * 0.2
      colors[i * 3 + 2] = 0.4 + Math.random() * 0.2
    }
    
    return { positions, colors }
  }, [count])
  
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = state.clock.elapsedTime * 0.05
      mesh.current.rotation.x = state.clock.elapsedTime * 0.03
    }
  })
  
  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={particles.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  )
}

function FloatingOrb({ position, scale = 1, speed = 1 }: { position: [number, number, number], scale?: number, speed?: number }) {
  const mesh = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.5
      mesh.current.rotation.x = state.clock.elapsedTime * 0.5
      mesh.current.rotation.z = state.clock.elapsedTime * 0.3
    }
  })
  
  return (
    <mesh ref={mesh} position={position} scale={scale}>
      <icosahedronGeometry args={[1, 1]} />
      <meshStandardMaterial
        color="#4ade80"
        wireframe
        transparent
        opacity={0.6}
      />
    </mesh>
  )
}

function GlowingSphere() {
  const mesh = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.scale.setScalar(2 + Math.sin(state.clock.elapsedTime) * 0.1)
    }
  })
  
  return (
    <mesh ref={mesh} position={[0, 0, -5]}>
      <sphereGeometry args={[2, 32, 32]} />
      <meshStandardMaterial
        color="#22c55e"
        emissive="#22c55e"
        emissiveIntensity={0.3}
        transparent
        opacity={0.15}
      />
    </mesh>
  )
}

function GridFloor() {
  return (
    <gridHelper
      args={[40, 40, "#1a1a1a", "#1a1a1a"]}
      position={[0, -5, 0]}
      rotation={[0, 0, 0]}
    />
  )
}

export function HeroScene() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={["#0a0a0a"]} />
        <fog attach="fog" args={["#0a0a0a", 10, 30]} />
        
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#4ade80" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#22c55e" />
        
        <FloatingParticles count={300} />
        <GlowingSphere />
        <FloatingOrb position={[-4, 2, -2]} scale={0.8} speed={0.8} />
        <FloatingOrb position={[4, -1, -3]} scale={0.6} speed={1.2} />
        <FloatingOrb position={[2, 3, -4]} scale={0.5} speed={1} />
        <GridFloor />
      </Canvas>
    </div>
  )
}
