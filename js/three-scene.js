/**
 * Deepak Kumar Yadav Portfolio - 3D WebGL Background Scene
 * Built with Three.js
 */

// Global 3D Manager Namespace
const Portfolio3D = {
    // Three.js Core objects
    scene: null,
    camera: null,
    renderer: null,
    
    // Elements
    particles: null,
    floatingObjects: [],
    
    // State
    particleCount: 1500,
    targetMode: 'idle', // 'idle', 'programming', 'audio', 'modeling', 'security', 'music', 'gaming'
    currentColor: new THREE.Color('#00f2fe'),
    targetColor: new THREE.Color('#00f2fe'),
    
    // Interactions
    mouseX: 0,
    mouseY: 0,
    targetMouseX: 0,
    targetMouseY: 0,
    scrollY: 0,
    targetScrollY: 0,
    
    // Init
    init() {
        const canvas = document.querySelector('#webgl');
        if (!canvas) return;
        
        // Scene setup
        this.scene = new THREE.Scene();
        
        // Camera setup
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
        this.camera.position.z = 12;
        
        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // Add Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.15);
        this.scene.add(ambientLight);
        
        const dirLight1 = new THREE.DirectionalLight(0x00f2fe, 1.5);
        dirLight1.position.set(5, 5, 5);
        this.scene.add(dirLight1);
        
        const dirLight2 = new THREE.DirectionalLight(0xff007f, 1.2);
        dirLight2.position.set(-5, -5, 5);
        this.scene.add(dirLight2);
        
        // Create 3D Assets
        this.createParticles();
        this.createFloatingMeshes();
        
        // Events
        window.addEventListener('resize', () => this.onWindowResize());
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
        window.addEventListener('scroll', () => this.onScroll());
        
        // Start animation loop
        this.animate();
    },
    
    // Custom gradient circle particle texture
    createParticleTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');
        const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
        grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
        grad.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
        grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 32, 32);
        return new THREE.CanvasTexture(canvas);
    },
    
    // Setup interactive background particles
    createParticles() {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.particleCount * 3);
        const originalPositions = new Float32Array(this.particleCount * 3);
        
        // Distribute points in a spherical shell
        for (let i = 0; i < this.particleCount; i++) {
            const index = i * 3;
            
            // Sphere placement coordinates
            const u = Math.random();
            const v = Math.random();
            const theta = u * 2.0 * Math.PI;
            const phi = Math.acos(2.0 * v - 1.0);
            
            const r = 4.0 + Math.random() * 0.8; // Radius
            
            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.sin(phi) * Math.sin(theta);
            const z = r * Math.cos(phi);
            
            positions[index] = x;
            positions[index + 1] = y;
            positions[index + 2] = z;
            
            originalPositions[index] = x;
            originalPositions[index + 1] = y;
            originalPositions[index + 2] = z;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('originalPosition', new THREE.BufferAttribute(originalPositions, 3));
        
        // Glow Material
        const material = new THREE.PointsMaterial({
            size: 0.16,
            map: this.createParticleTexture(),
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            color: this.currentColor
        });
        
        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    },
    
    // Create modern floating wireframe shapes
    createFloatingMeshes() {
        // Materials
        const createWireMaterial = (color) => {
            return new THREE.MeshPhysicalMaterial({
                color: color,
                wireframe: true,
                transparent: true,
                opacity: 0.35,
                roughness: 0.2,
                metalness: 0.8,
                emissive: color,
                emissiveIntensity: 0.4
            });
        };
        
        const blueMat = createWireMaterial(0x00f2fe);
        const pinkMat = createWireMaterial(0xff007f);
        
        // Icosahedron
        const icoGeom = new THREE.IcosahedronGeometry(1.5, 1);
        const icoMesh = new THREE.Mesh(icoGeom, blueMat);
        icoMesh.position.set(-6, -4, -2);
        this.scene.add(icoMesh);
        this.floatingObjects.push({ mesh: icoMesh, rx: 0.003, ry: 0.005, basePosition: new THREE.Vector3(-6, -4, -2) });
        
        // Torus Knot
        const torusGeom = new THREE.TorusKnotGeometry(1.0, 0.3, 64, 8);
        const torusMesh = new THREE.Mesh(torusGeom, pinkMat);
        torusMesh.position.set(6, -8, -3);
        this.scene.add(torusMesh);
        this.floatingObjects.push({ mesh: torusMesh, rx: 0.002, ry: 0.004, basePosition: new THREE.Vector3(6, -8, -3) });
        
        // Octahedron (Shield Center)
        const octGeom = new THREE.OctahedronGeometry(1.2, 0);
        const octMesh = new THREE.Mesh(octGeom, blueMat);
        octMesh.position.set(-4, -14, -1);
        this.scene.add(octMesh);
        this.floatingObjects.push({ mesh: octMesh, rx: 0.004, ry: 0.002, basePosition: new THREE.Vector3(-4, -14, -1) });
    },
    
    // Handle Window Resizing
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    },
    
    // Capture mouse moves
    onMouseMove(e) {
        this.targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
        this.targetMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    },
    
    // Capture page scrolling
    onScroll() {
        // Map scroll height to coordinate change
        this.targetScrollY = window.scrollY;
    },
    
    // Set 3D visual mode based on interaction
    setMode(mode) {
        this.targetMode = mode;
        
        // Select custom target theme colors
        switch (mode) {
            case 'programming': // blue glow
                this.targetColor.set('#00f2fe');
                break;
            case 'audio': // purple glow
                this.targetColor.set('#9b51e0');
                break;
            case 'modeling': // cyan
                this.targetColor.set('#00ffd2');
                break;
            case 'security': // red
                this.targetColor.set('#ff3366');
                break;
            case 'music': // yellow
                this.targetColor.set('#ffcc00');
                break;
            case 'gaming': // green
                this.targetColor.set('#39ff14');
                break;
            case 'idle':
            default:
                this.targetColor.set('#00f2fe');
                break;
        }
    },
    
    // Main animation and rendering loop
    animate() {
        requestAnimationFrame(() => this.animate());
        
        const time = Date.now() * 0.001;
        
        // Easing interpolation for mouse movements
        this.mouseX += (this.targetMouseX - this.mouseX) * 0.08;
        this.mouseY += (this.targetMouseY - this.mouseY) * 0.08;
        
        // Easing interpolation for scroll Parallax
        this.scrollY += (this.targetScrollY - this.scrollY) * 0.08;
        
        // Camera parallax based on scroll & mouse moves
        this.camera.position.x = this.mouseX * 1.5;
        this.camera.position.y = -this.scrollY * 0.012 + (this.mouseY * 1.2);
        this.camera.lookAt(0, -this.scrollY * 0.012, -2);
        
        // Interpolate point cloud colors
        this.currentColor.lerp(this.targetColor, 0.05);
        this.particles.material.color = this.currentColor;
        
        // Animate particles based on current active state mode
        const posAttr = this.particles.geometry.attributes.position;
        const origAttr = this.particles.geometry.attributes.originalPosition;
        
        for (let i = 0; i < this.particleCount; i++) {
            const index = i * 3;
            
            const ox = origAttr.array[index];
            const oy = origAttr.array[index + 1];
            const oz = origAttr.array[index + 2];
            
            // Distance from center
            const r = Math.sqrt(ox*ox + oy*oy + oz*oz);
            
            // Target coordinates we will animate towards
            let tx = ox;
            let ty = oy;
            let tz = oz;
            
            switch (this.targetMode) {
                case 'programming':
                    // Grid shape morph
                    const gridIndexX = i % 40;
                    const gridIndexY = Math.floor(i / 40) % 40;
                    tx = (gridIndexX - 20) * 0.3;
                    ty = (gridIndexY - 20) * 0.3 - (this.scrollY * 0.01);
                    tz = Math.sin(time + gridIndexX * 0.2 + gridIndexY * 0.2) * 0.5 - 2;
                    break;
                    
                case 'audio':
                    // Sine-wave frequency shape
                    tx = ox * 1.5;
                    ty = Math.sin(ox * 1.5 + time * 6) * 1.5 - (this.scrollY * 0.01) + Math.cos(oz + time) * 0.3;
                    tz = oz * 0.8;
                    break;
                    
                case 'modeling':
                    // Highly structured concentrated grid
                    const factor = 1.0 + Math.sin(time * 2.5 + r) * 0.15;
                    tx = ox * 0.8 * factor;
                    ty = oy * 0.8 * factor;
                    tz = oz * 0.8 * factor;
                    break;
                    
                case 'security':
                    // Orbiting Shield Ring shape
                    const angle = (i / this.particleCount) * Math.PI * 2;
                    const ringRadius = 5.0 + Math.sin(time * 3 + angle * 5) * 0.25;
                    tx = Math.cos(angle * 3) * ringRadius;
                    ty = Math.sin(angle * 3) * ringRadius;
                    tz = (i % 10) * 0.1 - 0.5;
                    break;
                    
                case 'music':
                    // Acoustic vibrational pattern
                    const vib = Math.sin(time * 15 + ox * 3) * 0.18;
                    tx = ox + vib;
                    ty = oy + vib;
                    tz = oz + vib;
                    break;
                    
                case 'gaming':
                    // Spiral vortex particle acceleration
                    const helixAngle = (i * 0.02) + time * 3.5;
                    const hRadius = 1.5 + (i * 0.003);
                    tx = Math.cos(helixAngle) * hRadius;
                    ty = Math.sin(helixAngle) * hRadius;
                    tz = ((i - this.particleCount / 2) * 0.015);
                    break;
                    
                case 'idle':
                default:
                    // Soft organic breathing sphere
                    const pulse = Math.sin(time * 1.5 + r * 2.0) * 0.08;
                    tx = ox * (1 + pulse);
                    ty = oy * (1 + pulse);
                    tz = oz * (1 + pulse);
                    
                    // Add light rotation
                    const sinT = Math.sin(0.0005);
                    const cosT = Math.cos(0.0005);
                    origAttr.array[index] = ox * cosT - oz * sinT;
                    origAttr.array[index + 2] = ox * sinT + oz * cosT;
                    break;
            }
            
            // Linear interpolation to animate points smoothly
            posAttr.array[index] += (tx - posAttr.array[index]) * 0.06;
            posAttr.array[index + 1] += (ty - posAttr.array[index + 1]) * 0.06;
            posAttr.array[index + 2] += (tz - posAttr.array[index + 2]) * 0.06;
        }
        posAttr.needsUpdate = true;
        
        // Spin the global particle system slightly
        this.particles.rotation.y += 0.001;
        this.particles.rotation.x += 0.0005;
        
        // Rotate and float background objects
        this.floatingObjects.forEach((obj) => {
            obj.mesh.rotation.x += obj.rx;
            obj.mesh.rotation.y += obj.ry;
            
            // Floating micro-animation
            const floatOffset = Math.sin(time * 1.5 + obj.basePosition.x) * 0.35;
            obj.mesh.position.y = obj.basePosition.y + floatOffset;
            
            // Slight horizontal movement based on mouse
            obj.mesh.position.x = obj.basePosition.x + (this.mouseX * 0.5);
        });
        
        this.renderer.render(this.scene, this.camera);
    }
};
