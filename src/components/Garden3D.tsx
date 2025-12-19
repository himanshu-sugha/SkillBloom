"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, Stars, Sparkles, Text, Html } from "@react-three/drei";
import * as THREE from "three";

interface PlantProps {
    position: [number, number, number];
    level: "seed" | "sprout" | "growing" | "blooming" | "flourishing";
    name: string;
    progress: number;
}

// Beautiful stylized plant with better visuals
function StylizedPlant({ position, level, name, progress }: PlantProps) {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (groupRef.current) {
            // Gentle breathing animation
            const t = state.clock.elapsedTime;
            groupRef.current.rotation.y = Math.sin(t * 0.3 + position[0]) * 0.1;
            groupRef.current.position.y = position[1] + Math.sin(t * 0.5 + position[0]) * 0.02;
        }
    });

    const config = useMemo(() => {
        switch (level) {
            case "seed":
                return {
                    height: 0.3,
                    leafCount: 0,
                    hasFlower: false,
                    stemColor: "#4a3728",
                    leafColor: "#2d5a27",
                    flowerColor: "#ffffff",
                    glowColor: "#8B4513",
                    scale: 0.6
                };
            case "sprout":
                return {
                    height: 0.6,
                    leafCount: 2,
                    hasFlower: false,
                    stemColor: "#3d8c40",
                    leafColor: "#4ade80",
                    flowerColor: "#ffffff",
                    glowColor: "#22c55e",
                    scale: 0.8
                };
            case "growing":
                return {
                    height: 0.9,
                    leafCount: 4,
                    hasFlower: false,
                    stemColor: "#2d8a4e",
                    leafColor: "#22c55e",
                    flowerColor: "#ffffff",
                    glowColor: "#10b981",
                    scale: 0.9
                };
            case "blooming":
                return {
                    height: 1.2,
                    leafCount: 6,
                    hasFlower: true,
                    stemColor: "#1d6b3a",
                    leafColor: "#10b981",
                    flowerColor: "#f472b6",
                    glowColor: "#ec4899",
                    scale: 1.0
                };
            case "flourishing":
                return {
                    height: 1.5,
                    leafCount: 8,
                    hasFlower: true,
                    stemColor: "#166534",
                    leafColor: "#059669",
                    flowerColor: "#f472b6",
                    glowColor: "#d946ef",
                    scale: 1.1
                };
            default:
                return {
                    height: 0.3,
                    leafCount: 0,
                    hasFlower: false,
                    stemColor: "#4a3728",
                    leafColor: "#2d5a27",
                    flowerColor: "#ffffff",
                    glowColor: "#8B4513",
                    scale: 0.6
                };
        }
    }, [level]);

    return (
        <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.1}>
            <group ref={groupRef} position={position} scale={config.scale}>
                {/* Beautiful terracotta pot */}
                <mesh position={[0, 0.15, 0]} castShadow>
                    <cylinderGeometry args={[0.32, 0.25, 0.35, 24]} />
                    <meshStandardMaterial
                        color="#c4784d"
                        roughness={0.7}
                        metalness={0.1}
                    />
                </mesh>
                {/* Pot rim */}
                <mesh position={[0, 0.35, 0]}>
                    <torusGeometry args={[0.32, 0.03, 8, 24]} />
                    <meshStandardMaterial color="#b5654a" roughness={0.6} />
                </mesh>

                {/* Rich soil */}
                <mesh position={[0, 0.28, 0]}>
                    <cylinderGeometry args={[0.28, 0.28, 0.08, 24]} />
                    <meshStandardMaterial color="#2d1b0e" roughness={1} />
                </mesh>

                {/* Main stem - tapered and organic */}
                <mesh position={[0, 0.35 + config.height / 2, 0]} castShadow>
                    <cylinderGeometry args={[0.025, 0.045, config.height, 12]} />
                    <meshStandardMaterial
                        color={config.stemColor}
                        roughness={0.5}
                        metalness={0.1}
                    />
                </mesh>

                {/* Stylized leaves */}
                {config.leafCount > 0 && [...Array(config.leafCount)].map((_, i) => {
                    const angle = (i / config.leafCount) * Math.PI * 2;
                    const heightOffset = 0.4 + (i % 2) * 0.15 + (i / config.leafCount) * config.height * 0.5;
                    const leafAngle = (i % 2 === 0 ? 0.6 : -0.6);

                    return (
                        <group key={i} position={[0, heightOffset, 0]} rotation={[0, angle, leafAngle]}>
                            <mesh position={[0.12, 0, 0]} rotation={[0.3, 0, 0.2]}>
                                <sphereGeometry args={[0.08 + (i * 0.01), 8, 6, 0, Math.PI, 0, Math.PI]} />
                                <meshStandardMaterial
                                    color={config.leafColor}
                                    roughness={0.4}
                                    metalness={0.1}
                                    side={THREE.DoubleSide}
                                />
                            </mesh>
                        </group>
                    );
                })}

                {/* Beautiful flower for blooming/flourishing */}
                {config.hasFlower && (
                    <group position={[0, 0.4 + config.height, 0]}>
                        {/* Flower petals - arranged in layers */}
                        {[...Array(8)].map((_, i) => {
                            const angle = (i / 8) * Math.PI * 2;
                            const radius = 0.15;
                            return (
                                <mesh
                                    key={i}
                                    position={[
                                        Math.cos(angle) * radius,
                                        0,
                                        Math.sin(angle) * radius,
                                    ]}
                                    rotation={[0.4, angle, 0]}
                                >
                                    <sphereGeometry args={[0.08, 8, 8]} />
                                    <meshStandardMaterial
                                        color={config.flowerColor}
                                        roughness={0.2}
                                        metalness={0.3}
                                        emissive={config.flowerColor}
                                        emissiveIntensity={0.3}
                                    />
                                </mesh>
                            );
                        })}
                        {/* Inner petals */}
                        {[...Array(5)].map((_, i) => {
                            const angle = (i / 5) * Math.PI * 2 + 0.3;
                            const radius = 0.08;
                            return (
                                <mesh
                                    key={`inner-${i}`}
                                    position={[
                                        Math.cos(angle) * radius,
                                        0.05,
                                        Math.sin(angle) * radius,
                                    ]}
                                    rotation={[0.2, angle, 0]}
                                >
                                    <sphereGeometry args={[0.05, 8, 8]} />
                                    <meshStandardMaterial
                                        color="#fbbf24"
                                        roughness={0.2}
                                        emissive="#fbbf24"
                                        emissiveIntensity={0.4}
                                    />
                                </mesh>
                            );
                        })}
                        {/* Glowing center */}
                        <mesh position={[0, 0.08, 0]}>
                            <sphereGeometry args={[0.06, 16, 16]} />
                            <meshStandardMaterial
                                color="#fcd34d"
                                roughness={0.1}
                                emissive="#fbbf24"
                                emissiveIntensity={0.8}
                            />
                        </mesh>
                    </group>
                )}

                {/* Glowing progress ring */}
                <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[0.42, 0.46, 64, 1, 0, (progress / 100) * Math.PI * 2]} />
                    <meshBasicMaterial
                        color={config.glowColor}
                        side={THREE.DoubleSide}
                        transparent
                        opacity={0.8}
                    />
                </mesh>

                {/* Background ring */}
                <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[0.42, 0.46, 64]} />
                    <meshBasicMaterial
                        color="#1e293b"
                        side={THREE.DoubleSide}
                        transparent
                        opacity={0.5}
                    />
                </mesh>

                {/* Skill name label */}
                <Html
                    position={[0, -0.15, 0]}
                    center
                    style={{
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        background: 'rgba(0,0,0,0.6)',
                        padding: '4px 12px',
                        borderRadius: '12px',
                        whiteSpace: 'nowrap',
                        backdropFilter: 'blur(4px)',
                    }}
                >
                    {name}
                </Html>
            </group>
        </Float>
    );
}

// Beautiful ground with gradient
function BeautifulGround() {
    return (
        <group>
            {/* Main ground */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
                <circleGeometry args={[8, 64]} />
                <meshStandardMaterial
                    color="#134e4a"
                    roughness={0.9}
                    metalness={0.1}
                />
            </mesh>
            {/* Outer glow ring */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.03, 0]}>
                <ringGeometry args={[7.5, 8, 64]} />
                <meshBasicMaterial color="#22c55e" transparent opacity={0.3} />
            </mesh>
        </group>
    );
}

// Fireflies effect
function Fireflies() {
    const count = 50;
    const meshRef = useRef<THREE.InstancedMesh>(null);

    const positions = useMemo(() => {
        const pos = [];
        for (let i = 0; i < count; i++) {
            pos.push({
                x: (Math.random() - 0.5) * 12,
                y: Math.random() * 4 + 0.5,
                z: (Math.random() - 0.5) * 12,
                speed: 0.5 + Math.random() * 1.5,
                offset: Math.random() * Math.PI * 2,
            });
        }
        return pos;
    }, []);

    useFrame((state) => {
        if (meshRef.current) {
            const t = state.clock.elapsedTime;
            positions.forEach((p, i) => {
                const matrix = new THREE.Matrix4();
                matrix.setPosition(
                    p.x + Math.sin(t * p.speed + p.offset) * 0.5,
                    p.y + Math.sin(t * p.speed * 0.5 + p.offset) * 0.3,
                    p.z + Math.cos(t * p.speed + p.offset) * 0.5
                );
                meshRef.current!.setMatrixAt(i, matrix);
            });
            meshRef.current.instanceMatrix.needsUpdate = true;
        }
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshBasicMaterial color="#fbbf24" transparent opacity={0.8} />
        </instancedMesh>
    );
}

interface Skill {
    id: string;
    name: string;
    progress: number;
    level: "seed" | "sprout" | "growing" | "blooming" | "flourishing";
}

interface Garden3DProps {
    skills: Skill[];
}

export default function Garden3D({ skills }: Garden3DProps) {
    const getPlantPosition = (index: number, total: number): [number, number, number] => {
        if (total === 1) return [0, 0, 0];
        if (total === 2) return index === 0 ? [-1.2, 0, 0] : [1.2, 0, 0];
        const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
        const radius = total <= 4 ? 2 : 2.5;
        return [Math.cos(angle) * radius, 0, Math.sin(angle) * radius];
    };

    return (
        <div className="w-full h-[450px] rounded-2xl overflow-hidden relative">
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a] via-[#0f172a] to-[#134e4a] pointer-events-none z-0" />

            <Canvas
                camera={{ position: [0, 3.5, 5.5], fov: 45 }}
                shadows
                className="relative z-10"
            >
                {/* Lighting */}
                <ambientLight intensity={0.3} />
                <directionalLight
                    position={[5, 8, 5]}
                    intensity={0.8}
                    castShadow
                    shadow-mapSize={[1024, 1024]}
                />
                <pointLight position={[-4, 4, -4]} intensity={0.4} color="#22c55e" />
                <pointLight position={[4, 4, 4]} intensity={0.4} color="#a855f7" />
                <pointLight position={[0, 6, 0]} intensity={0.3} color="#fbbf24" />

                {/* Environment */}
                <fog attach="fog" args={["#0f172a", 6, 18]} />
                <Stars radius={50} depth={50} count={1500} factor={4} fade speed={0.5} />

                {/* Add sparkles */}
                <Sparkles
                    count={100}
                    size={2}
                    speed={0.3}
                    opacity={0.5}
                    scale={10}
                    color="#22c55e"
                />

                {/* Ground */}
                <BeautifulGround />

                {/* Plants */}
                {skills.map((skill, index) => (
                    <StylizedPlant
                        key={skill.id}
                        position={getPlantPosition(index, skills.length)}
                        level={skill.level}
                        name={skill.name}
                        progress={skill.progress}
                    />
                ))}

                {/* Fireflies */}
                <Fireflies />

                {/* Controls */}
                <OrbitControls
                    enablePan={false}
                    enableZoom={true}
                    minPolarAngle={Math.PI / 6}
                    maxPolarAngle={Math.PI / 2.2}
                    minDistance={3}
                    maxDistance={12}
                    autoRotate
                    autoRotateSpeed={0.3}
                />
            </Canvas>
        </div>
    );
}
