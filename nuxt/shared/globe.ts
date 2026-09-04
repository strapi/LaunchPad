/**
 * The LaunchPad globe.
 *
 * Uses three-globe with the same country polygons, arc set and material
 * settings as the Next frontend, so all four frontends render the same
 * Earth. three-globe is a plain THREE.Object3D, so the only React-specific
 * part of the original was its react-three-fiber wrapper.
 *
 * Country polygons are fetched from /data/globe.json rather than imported,
 * to keep 550KB of GeoJSON out of the client bundle.
 */

const GLOBE_CONFIG = {
  globeColor: '#09090b',
  emissive: '#062056',
  emissiveIntensity: 0.1,
  shininess: 0.9,
  atmosphereColor: '#e2e8f0',
  atmosphereAltitude: 0.1,
  polygonColor: 'rgba(255,255,255,0.7)',
  ambientLight: '#38bdf8',
  arcTime: 1000,
  arcLength: 0.9,
  autoRotateSpeed: 0.5,
};

const ARCS = [
  {
    order: 1,
    startLat: -19.885592,
    startLng: -43.951191,
    endLat: -22.9068,
    endLng: -43.1729,
    arcAlt: 0.1,
    color: '#d4d4d4',
  },
  {
    order: 1,
    startLat: 28.6139,
    startLng: 77.209,
    endLat: 3.139,
    endLng: 101.6869,
    arcAlt: 0.2,
    color: '#d4d4d4',
  },
  {
    order: 1,
    startLat: -19.885592,
    startLng: -43.951191,
    endLat: -1.303396,
    endLng: 36.852443,
    arcAlt: 0.5,
    color: '#d4d4d4',
  },
  {
    order: 2,
    startLat: 1.3521,
    startLng: 103.8198,
    endLat: 35.6762,
    endLng: 139.6503,
    arcAlt: 0.2,
    color: '#d4d4d4',
  },
  {
    order: 2,
    startLat: 51.5072,
    startLng: -0.1276,
    endLat: 3.139,
    endLng: 101.6869,
    arcAlt: 0.3,
    color: '#d4d4d4',
  },
  {
    order: 2,
    startLat: -15.785493,
    startLng: -47.909029,
    endLat: 36.162809,
    endLng: -115.119411,
    arcAlt: 0.3,
    color: '#d4d4d4',
  },
  {
    order: 3,
    startLat: -33.8688,
    startLng: 151.2093,
    endLat: 22.3193,
    endLng: 114.1694,
    arcAlt: 0.3,
    color: '#d4d4d4',
  },
  {
    order: 3,
    startLat: 21.3099,
    startLng: -157.8581,
    endLat: 40.7128,
    endLng: -74.006,
    arcAlt: 0.3,
    color: '#d4d4d4',
  },
  {
    order: 3,
    startLat: -6.2088,
    startLng: 106.8456,
    endLat: 51.5072,
    endLng: -0.1276,
    arcAlt: 0.3,
    color: '#d4d4d4',
  },
  {
    order: 4,
    startLat: 11.986597,
    startLng: 8.571831,
    endLat: -15.595412,
    endLng: -56.05918,
    arcAlt: 0.5,
    color: '#d4d4d4',
  },
  {
    order: 4,
    startLat: -34.6037,
    startLng: -58.3816,
    endLat: 22.3193,
    endLng: 114.1694,
    arcAlt: 0.7,
    color: '#d4d4d4',
  },
  {
    order: 4,
    startLat: 51.5072,
    startLng: -0.1276,
    endLat: 48.8566,
    endLng: -2.3522,
    arcAlt: 0.1,
    color: '#d4d4d4',
  },
  {
    order: 5,
    startLat: 14.5995,
    startLng: 120.9842,
    endLat: 51.5072,
    endLng: -0.1276,
    arcAlt: 0.3,
    color: '#d4d4d4',
  },
  {
    order: 5,
    startLat: 1.3521,
    startLng: 103.8198,
    endLat: -33.8688,
    endLng: 151.2093,
    arcAlt: 0.2,
    color: '#d4d4d4',
  },
  {
    order: 5,
    startLat: 34.0522,
    startLng: -118.2437,
    endLat: 48.8566,
    endLng: -2.3522,
    arcAlt: 0.2,
    color: '#d4d4d4',
  },
  {
    order: 6,
    startLat: -15.432563,
    startLng: 28.315853,
    endLat: 1.094136,
    endLng: -63.34546,
    arcAlt: 0.7,
    color: '#d4d4d4',
  },
  {
    order: 6,
    startLat: 37.5665,
    startLng: 126.978,
    endLat: 35.6762,
    endLng: 139.6503,
    arcAlt: 0.1,
    color: '#d4d4d4',
  },
  {
    order: 6,
    startLat: 22.3193,
    startLng: 114.1694,
    endLat: 51.5072,
    endLng: -0.1276,
    arcAlt: 0.3,
    color: '#d4d4d4',
  },
  {
    order: 7,
    startLat: -19.885592,
    startLng: -43.951191,
    endLat: -15.595412,
    endLng: -56.05918,
    arcAlt: 0.1,
    color: '#d4d4d4',
  },
  {
    order: 7,
    startLat: 48.8566,
    startLng: -2.3522,
    endLat: 52.52,
    endLng: 13.405,
    arcAlt: 0.1,
    color: '#d4d4d4',
  },
  {
    order: 7,
    startLat: 52.52,
    startLng: 13.405,
    endLat: 34.0522,
    endLng: -118.2437,
    arcAlt: 0.2,
    color: '#d4d4d4',
  },
  {
    order: 8,
    startLat: -8.833221,
    startLng: 13.264837,
    endLat: -33.936138,
    endLng: 18.436529,
    arcAlt: 0.2,
    color: '#d4d4d4',
  },
  {
    order: 8,
    startLat: 49.2827,
    startLng: -123.1207,
    endLat: 52.3676,
    endLng: 4.9041,
    arcAlt: 0.2,
    color: '#d4d4d4',
  },
  {
    order: 8,
    startLat: 1.3521,
    startLng: 103.8198,
    endLat: 40.7128,
    endLng: -74.006,
    arcAlt: 0.5,
    color: '#d4d4d4',
  },
  {
    order: 9,
    startLat: 51.5072,
    startLng: -0.1276,
    endLat: 34.0522,
    endLng: -118.2437,
    arcAlt: 0.2,
    color: '#d4d4d4',
  },
  {
    order: 9,
    startLat: 22.3193,
    startLng: 114.1694,
    endLat: -22.9068,
    endLng: -43.1729,
    arcAlt: 0.7,
    color: '#d4d4d4',
  },
  {
    order: 9,
    startLat: 1.3521,
    startLng: 103.8198,
    endLat: -34.6037,
    endLng: -58.3816,
    arcAlt: 0.5,
    color: '#d4d4d4',
  },
  {
    order: 10,
    startLat: -22.9068,
    startLng: -43.1729,
    endLat: 28.6139,
    endLng: 77.209,
    arcAlt: 0.7,
    color: '#d4d4d4',
  },
  {
    order: 10,
    startLat: 34.0522,
    startLng: -118.2437,
    endLat: 31.2304,
    endLng: 121.4737,
    arcAlt: 0.3,
    color: '#d4d4d4',
  },
  {
    order: 10,
    startLat: -6.2088,
    startLng: 106.8456,
    endLat: 52.3676,
    endLng: 4.9041,
    arcAlt: 0.3,
    color: '#d4d4d4',
  },
  {
    order: 11,
    startLat: 41.9028,
    startLng: 12.4964,
    endLat: 34.0522,
    endLng: -118.2437,
    arcAlt: 0.2,
    color: '#d4d4d4',
  },
  {
    order: 11,
    startLat: -6.2088,
    startLng: 106.8456,
    endLat: 31.2304,
    endLng: 121.4737,
    arcAlt: 0.2,
    color: '#d4d4d4',
  },
  {
    order: 11,
    startLat: 22.3193,
    startLng: 114.1694,
    endLat: 1.3521,
    endLng: 103.8198,
    arcAlt: 0.2,
    color: '#d4d4d4',
  },
  {
    order: 12,
    startLat: 34.0522,
    startLng: -118.2437,
    endLat: 37.7749,
    endLng: -122.4194,
    arcAlt: 0.1,
    color: '#d4d4d4',
  },
  {
    order: 12,
    startLat: 35.6762,
    startLng: 139.6503,
    endLat: 22.3193,
    endLng: 114.1694,
    arcAlt: 0.2,
    color: '#d4d4d4',
  },
  {
    order: 12,
    startLat: 22.3193,
    startLng: 114.1694,
    endLat: 34.0522,
    endLng: -118.2437,
    arcAlt: 0.3,
    color: '#d4d4d4',
  },
  {
    order: 13,
    startLat: 52.52,
    startLng: 13.405,
    endLat: 22.3193,
    endLng: 114.1694,
    arcAlt: 0.3,
    color: '#d4d4d4',
  },
  {
    order: 13,
    startLat: 11.986597,
    startLng: 8.571831,
    endLat: 35.6762,
    endLng: 139.6503,
    arcAlt: 0.3,
    color: '#d4d4d4',
  },
  {
    order: 13,
    startLat: -22.9068,
    startLng: -43.1729,
    endLat: -34.6037,
    endLng: -58.3816,
    arcAlt: 0.1,
    color: '#d4d4d4',
  },
  {
    order: 14,
    startLat: -33.936138,
    startLng: 18.436529,
    endLat: 21.395643,
    endLng: 39.883798,
    arcAlt: 0.3,
    color: '#d4d4d4',
  },
];

export async function mountGlobe(container: HTMLElement): Promise<() => void> {
  const [THREE, ThreeGlobeMod] = await Promise.all([
    import('three'),
    import('three-globe'),
  ]);
  const ThreeGlobe = (ThreeGlobeMod as any).default ?? ThreeGlobeMod;

  let countries: any;
  try {
    countries = await fetch('/data/globe.json').then((r) => r.json());
  } catch {
    countries = { features: [] };
  }

  const width = container.clientWidth || 400;
  const height = container.clientHeight || 400;

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xffffff, 400, 2000);

  const camera = new THREE.PerspectiveCamera(50, width / height, 180, 1800);
  camera.position.z = 300;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height);
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  scene.add(
    new THREE.AmbientLight(new THREE.Color(GLOBE_CONFIG.ambientLight), 0.6)
  );
  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(-400, 100, 400);
  scene.add(dirLight);
  const topLight = new THREE.DirectionalLight(0xffffff, 1);
  topLight.position.set(-200, 500, 200);
  scene.add(topLight);
  const pointLight = new THREE.PointLight(0xffffff, 0.8);
  pointLight.position.set(-200, 500, 200);
  scene.add(pointLight);

  const globe = new ThreeGlobe()
    .hexPolygonsData(countries.features ?? [])
    .hexPolygonResolution(3)
    .hexPolygonMargin(0.7)
    .showAtmosphere(true)
    .atmosphereColor(GLOBE_CONFIG.atmosphereColor)
    .atmosphereAltitude(GLOBE_CONFIG.atmosphereAltitude)
    .hexPolygonColor(() => GLOBE_CONFIG.polygonColor);

  const material = globe.globeMaterial() as any;
  material.color = new THREE.Color(GLOBE_CONFIG.globeColor);
  material.emissive = new THREE.Color(GLOBE_CONFIG.emissive);
  material.emissiveIntensity = GLOBE_CONFIG.emissiveIntensity;
  material.shininess = GLOBE_CONFIG.shininess;

  globe
    .arcsData(ARCS)
    .arcStartLat((d: any) => d.startLat)
    .arcStartLng((d: any) => d.startLng)
    .arcEndLat((d: any) => d.endLat)
    .arcEndLng((d: any) => d.endLng)
    .arcColor((d: any) => d.color)
    .arcAltitude((d: any) => d.arcAlt)
    .arcStroke(() => [0.32, 0.28, 0.3][Math.round(Math.random() * 2)])
    .arcDashLength(GLOBE_CONFIG.arcLength)
    .arcDashInitialGap((d: any) => d.order)
    .arcDashGap(15)
    .arcDashAnimateTime(() => GLOBE_CONFIG.arcTime);

  scene.add(globe);

  let frame = 0;
  const animate = () => {
    globe.rotation.y += GLOBE_CONFIG.autoRotateSpeed * 0.002;
    renderer.render(scene, camera);
    frame = requestAnimationFrame(animate);
  };
  animate();

  const onResize = () => {
    const w = container.clientWidth || width;
    const h = container.clientHeight || height;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };
  window.addEventListener('resize', onResize);

  return () => {
    cancelAnimationFrame(frame);
    window.removeEventListener('resize', onResize);
    renderer.dispose();
    if (renderer.domElement.parentNode === container) {
      container.removeChild(renderer.domElement);
    }
  };
}
