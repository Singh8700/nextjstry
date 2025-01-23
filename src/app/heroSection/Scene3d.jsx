'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const SHAPES = [
  (scale) => new THREE.TorusGeometry(0.8 * scale, 0.2 * scale, 64, 64),
  (scale) => new THREE.TorusKnotGeometry(0.5 * scale, 0.15 * scale, 100, 16),
  (scale) => new THREE.OctahedronGeometry(0.7 * scale, 0),
  (scale) => new THREE.IcosahedronGeometry(0.7 * scale, 0),
];

const COLORS = [
  0xff1493, // Deep Pink
  0x4169e1, // Royal Blue
  0x32cd32, // Lime Green
  0xffa500, // Orange
  0x9400d3, // Violet
  0x00ced1, // Dark Turquoise
];

// Function to ensure objects don't overlap
const calculateNonOverlappingPosition = (existingObjects, scale) => {
  const minDistance = scale * 3; // Minimum distance between objects
  let attempts = 0;
  const maxAttempts = 100;
  
  while (attempts < maxAttempts) {
    // Calculate position based on screen sections
    const section = attempts % 3; // Divide screen into 3 sections
    const baseX = ((section - 1) * 6); // Spread across screen width
    const x = baseX + (Math.random() - 0.5) * 2; // Add some randomness within section
    const y = (Math.random() - 0.5) * 2; // Keep vertical position limited
    const z = -3;

    // Check distance from all existing objects
    let isValidPosition = true;
    for (const obj of existingObjects) {
      const distance = Math.sqrt(
        Math.pow(x - obj.position.x, 2) + 
        Math.pow(y - obj.position.y, 2)
      );
      if (distance < minDistance) {
        isValidPosition = false;
        break;
      }
    }

    if (isValidPosition) {
      return { x, y, z };
    }
    attempts++;
  }

  // Fallback position if no valid position found
  return { x: 0, y: 0, z: -3 };
};

const calculateRandomPosition = () => {
  // Get viewport dimensions
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  // Calculate random position within viewport
  const x = (Math.random() - 0.5) * (viewportWidth / 50); // Scale based on viewport
  const y = (Math.random() - 0.5) * (viewportHeight / 50);
  const z = Math.random() * -5 - 2; // Random depth between -2 and -7
  
  return { x, y, z };
};

const calculateObjectScale = () => {
  const viewportWidth = window.innerWidth;
  // Base scale increases with viewport width
  const baseScale = Math.max(1, viewportWidth / 1920); // 1920 is reference width
  return baseScale * (Math.random() * 0.5 + 0.75); // Random between 75% and 125% of base scale
};

export default function Scene3d() {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const objectsRef = useRef([]);
  const mousePosition = useRef({ x: 0, y: 0 });
  const scrollPosition = useRef(0);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 8;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);

    // Create floating objects
    const numObjects = Math.min(5, Math.max(3, Math.floor(window.innerWidth / 400))); // 3-5 objects based on screen size
    const objects = [];

    for (let i = 0; i < numObjects; i++) {
      const objectScale = calculateObjectScale();
      const geometry = SHAPES[i % SHAPES.length](objectScale);
      const color = COLORS[i % COLORS.length];
      
      const material = new THREE.MeshPhongMaterial({ 
        color: color,
        wireframe: true,
        emissive: new THREE.Color(color).multiplyScalar(0.2),
        shininess: 100,
        specular: new THREE.Color(color).multiplyScalar(0.5),
        transparent: true,
        opacity: 0.3
      });

      const mesh = new THREE.Mesh(geometry, material);
      const position = calculateRandomPosition();
      
      mesh.position.set(position.x, position.y, position.z);
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );

      // Add floating animation parameters
      mesh.userData = {
        basePosition: { ...position },
        floatOffset: Math.random() * Math.PI * 2, // Random start phase
        floatSpeed: 0.001 + Math.random() * 0.002, // Random speed
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.002,
          y: (Math.random() - 0.5) * 0.002,
          z: (Math.random() - 0.5) * 0.002
        },
        scale: objectScale,
        originalColor: color
      };

      scene.add(mesh);
      objectsRef.current.push(mesh);
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(0, 0, 5);
    scene.add(directionalLight);

    // Event handlers
    const handleMouseMove = (event) => {
      const rect = containerRef.current.getBoundingClientRect();
      mousePosition.current = {
        x: ((event.clientX - rect.left) / rect.width) * 2 - 1,
        y: -((event.clientY - rect.top) / rect.height) * 2 + 1
      };
    };

    const handleScroll = () => {
      scrollPosition.current = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    };

    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    // Animation with floating effect
    let time = 0;
    const animate = () => {
      const frameId = requestAnimationFrame(animate);
      time += 0.003;

      objectsRef.current.forEach((object, index) => {
        if (!object) return;

        // Floating motion
        const floatY = Math.sin(time + object.userData.floatOffset) * 0.5;
        const floatX = Math.cos(time + object.userData.floatOffset) * 0.3;
        
        // Combine floating with base position and mouse influence
        const mouseInfluence = 0.3;
        const targetX = object.userData.basePosition.x + floatX + mousePosition.current.x * mouseInfluence;
        const targetY = object.userData.basePosition.y + floatY + mousePosition.current.y * mouseInfluence;

        object.position.x += (targetX - object.position.x) * 0.01;
        object.position.y += (targetY - object.position.y) * 0.01;

        // Gentle rotation
        object.rotation.x += object.userData.rotationSpeed.x;
        object.rotation.y += object.userData.rotationSpeed.y;
        object.rotation.z += object.userData.rotationSpeed.z;

        // Scale animation based on scroll and viewport
        const viewportScale = calculateObjectScale();
        const scrollScale = 1 + scrollPosition.current * 0.2;
        const targetScale = object.userData.scale * scrollScale * viewportScale;
        object.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.01);

        // Color animation
        if (object.material) {
          const hue = (time * 0.1 + index * 0.3) % 1;
          const color = new THREE.Color().setHSL(hue, 0.6, 0.5);
          object.material.color.lerp(color, 0.01);
          object.material.emissive.copy(color).multiplyScalar(0.2);
        }
      });

      renderer.render(scene, camera);
      return frameId;
    };

    const frameId = animate();

    // Event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    containerRef.current.addEventListener('mousemove', handleMouseMove);
    containerRef.current.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        handleMouseMove(e.touches[0]);
      }
    });

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      if (containerRef.current) {
        containerRef.current.removeEventListener('mousemove', handleMouseMove);
        containerRef.current.removeEventListener('touchmove', handleMouseMove);
        containerRef.current.removeChild(renderer.domElement);
      }
      cancelAnimationFrame(frameId);
      objectsRef.current.forEach(object => {
        object.geometry.dispose();
        object.material.dispose();
      });
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full fixed top-0 left-0 -z-10"
      style={{ 
        background: 'transparent',
        pointerEvents: 'none'
      }}
    />
  );
}
