// Modèles 3D partagés : la gourde et le carnet.
// Utilisés par Gourde3D.astro, Carnet3D.astro et l'animation du Hero.
import * as THREE from "three";
import { DecalGeometry } from "three/addons/geometries/DecalGeometry.js";

/* ---------- Gourde ---------- */

const COLOR = 0xe9e2d6; // beige mat de la gourde

// Décalage horizontal selon la hauteur : donne la silhouette en S, légèrement déhanchée
const sway = (y: number) => 0.1 * Math.sin(y * 1.9 - 0.6);

// Profil de la gourde (rayon, hauteur), de la base au goulot
const profile: [number, number][] = [
    [0, 0], [0.5, 0], [0.62, 0.05], [0.7, 0.2], [0.74, 0.45], [0.72, 0.7],
    [0.64, 0.95], [0.52, 1.18], [0.45, 1.38], [0.47, 1.55], [0.56, 1.75],
    [0.62, 1.95], [0.61, 2.15], [0.54, 2.35], [0.42, 2.52], [0.3, 2.64],
    [0.27, 2.72], [0.27, 2.78],
];

// Logo « vitra. » dessiné dans une texture transparente
function buildLogoTexture() {
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 160;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#8a857d";
    ctx.font = "500 96px Futura, 'Century Gothic', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("vitra.", 256, 84);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    return tex;
}

// Colle le logo sur la face avant, comme un marquage
function addLogo(group: THREE.Group, bodyMesh: THREE.Mesh) {
    const LOGO_Y = 0.32; // hauteur du logo sur la gourde
    bodyMesh.updateMatrixWorld();
    const hit = new THREE.Raycaster(
        new THREE.Vector3(0, LOGO_Y, 5),
        new THREE.Vector3(0, 0, -1),
    ).intersectObject(bodyMesh)[0];
    if (!hit) return;

    const decal = new THREE.Mesh(
        new DecalGeometry(
            bodyMesh,
            hit.point,
            new THREE.Euler(0, 0, 0),
            new THREE.Vector3(0.42, 0.13, 0.5),
        ),
        new THREE.MeshStandardMaterial({
            map: buildLogoTexture(),
            transparent: true,
            roughness: 0.85,
            depthWrite: false,
            polygonOffset: true,
            polygonOffsetFactor: -4,
        }),
    );
    group.add(decal);
}

export function buildGourde() {
    const group = new THREE.Group();
    const material = new THREE.MeshStandardMaterial({ color: COLOR, roughness: 0.85, metalness: 0 });

    // Corps : profil lissé puis tourné autour de l'axe
    const curve = new THREE.SplineCurve(profile.map(([r, y]) => new THREE.Vector2(r, y)));
    const body = new THREE.LatheGeometry(curve.getPoints(80), 96, Math.PI);
    const pos = body.attributes.position;
    for (let i = 0; i < pos.count; i++) pos.setX(i, pos.getX(i) + sway(pos.getY(i)));
    body.computeVertexNormals();
    const bodyMesh = new THREE.Mesh(body, material);
    bodyMesh.castShadow = true;
    group.add(bodyMesh);
    addLogo(group, bodyMesh);

    // Bouchon
    const capTop = 2.78;
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.31, 0.31, 0.3, 64), material);
    cap.position.set(sway(capTop + 0.17), capTop + 0.17, 0);
    cap.castShadow = true;
    group.add(cap);

    // Fine bague sombre entre le corps et le bouchon
    const ring = new THREE.Mesh(
        new THREE.CylinderGeometry(0.285, 0.285, 0.04, 64),
        new THREE.MeshStandardMaterial({ color: 0x3a3632, roughness: 0.6 }),
    );
    ring.position.set(sway(capTop), capTop + 0.01, 0);
    group.add(ring);

    // Anse : anneau épais sur le côté de l'épaule
    const handle = new THREE.Mesh(new THREE.TorusGeometry(0.27, 0.13, 32, 64), material);
    handle.scale.set(1, 1.3, 1);
    handle.position.set(0.62 + sway(2.1), 2.1, 0);
    handle.castShadow = true;
    group.add(handle);

    group.position.y = -1.5; // centre la gourde
    return group;
}

/* ---------- Carnet ---------- */

// Dimensions du carnet (unités 3D)
const W = 2;
const H = 2.15;
const COVER = 0.05; // épaisseur d'une couverture
const PAGES = 0.2; // épaisseur du bloc de pages
const RINGS_Y = [0.82, 0.62, -0.62, -0.82]; // position des anneaux (2 en haut, 2 en bas)

const COLORS = {
    cover: "#c8c6c1", // carton gris clair
    texture: "#8e8c87", // relief minéral
    paper: 0xf2efe9,
    metal: 0xb9b7b2,
};

// Générateur pseudo-aléatoire fixe : la texture est identique à chaque chargement
let seed = 7;
const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

// Limite irrégulière entre la partie texturée et la partie lisse
function edgeY(x: number, size: number) {
    const t = x / size;
    const base = 0.95 - 0.55 * t; // descend de gauche à droite (en coordonnées image)
    const wobble = 0.035 * Math.sin(t * 9 + 0.5) + 0.02 * Math.sin(t * 27 + 1) + 0.008 * Math.sin(t * 73);
    return (base + wobble) * size;
}

function textureRegion(ctx: CanvasRenderingContext2D, size: number) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(size, 0);
    for (let x = size; x >= 0; x -= 4) ctx.lineTo(x, edgeY(x, size));
    ctx.closePath();
}

// Couverture avant : couleur + carte de relief + carte métal
function buildCoverTextures() {
    const size = 1024;
    const make = () => {
        const c = document.createElement("canvas");
        c.width = c.height = size;
        return [c, c.getContext("2d")!] as const;
    };
    const [colorC, color] = make();
    const [bumpC, bump] = make();
    const [metalC, metal] = make();

    // Fonds
    color.fillStyle = COLORS.cover;
    color.fillRect(0, 0, size, size);
    bump.fillStyle = "#808080";
    bump.fillRect(0, 0, size, size);
    metal.fillStyle = "#000";
    metal.fillRect(0, 0, size, size);

    // Zone texturée
    for (const [ctx, fill] of [[color, COLORS.texture], [bump, "#9a9a9a"], [metal, "#777"]] as const) {
        textureRegion(ctx, size);
        ctx.fillStyle = fill;
        ctx.fill();
    }

    // Relief : grains et craquelures, limités à la zone texturée
    for (const ctx of [color, bump]) {
        ctx.save();
        textureRegion(ctx, size);
        ctx.clip();
    }
    seed = 7;
    for (let i = 0; i < 9000; i++) {
        const x = rand() * size;
        const y = rand() * size;
        const r = 1 + rand() * 3.5;
        const light = rand() > 0.5;
        color.fillStyle = light ? "rgba(225,223,218,0.55)" : "rgba(70,68,64,0.35)";
        bump.fillStyle = light ? "#e6e6e6" : "#5a5a5a";
        for (const ctx of [color, bump]) {
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    for (let i = 0; i < 60; i++) {
        let x = rand() * size;
        let y = rand() * size;
        let angle = rand() * Math.PI * 2;
        const steps = 8 + Math.floor(rand() * 18);
        color.strokeStyle = "rgba(205,203,198,0.8)";
        bump.strokeStyle = "#ffffff";
        for (const ctx of [color, bump]) {
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(x, y);
        }
        for (let s = 0; s < steps; s++) {
            angle += (rand() - 0.5) * 1.1;
            x += Math.cos(angle) * 22;
            y += Math.sin(angle) * 22;
            color.lineTo(x, y);
            bump.lineTo(x, y);
        }
        color.stroke();
        bump.stroke();
    }
    color.restore();
    bump.restore();

    // Bord en relief le long de la limite
    bump.strokeStyle = "#d0d0d0";
    bump.lineWidth = 6;
    bump.beginPath();
    for (let x = 0; x <= size; x += 4) bump.lineTo(x, edgeY(x, size));
    bump.stroke();

    // Œillets des anneaux
    for (const ry of RINGS_Y) {
        const py = (0.5 - ry / H) * size;
        color.fillStyle = "#3a3835";
        color.beginPath();
        color.arc(0.045 * size, py, 11, 0, Math.PI * 2);
        color.fill();
    }

    // Logo
    color.fillStyle = "#151515";
    color.font = "bold 64px Futura, 'Century Gothic', sans-serif";
    color.textAlign = "right";
    color.fillText("vitra.", size * 0.9, size * 0.88);

    const map = new THREE.CanvasTexture(colorC);
    map.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = 8;
    return {
        map,
        bumpMap: new THREE.CanvasTexture(bumpC),
        metalnessMap: new THREE.CanvasTexture(metalC),
    };
}

// Tranches des pages : fines lignes de papier
function buildPaperEdge() {
    const c = document.createElement("canvas");
    c.width = 64;
    c.height = 256;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#f2efe9";
    ctx.fillRect(0, 0, 64, 256);
    for (let x = 0; x < 64; x += 2) {
        ctx.fillStyle = x % 6 === 0 ? "#ddd8cf" : "#e9e5dd";
        ctx.fillRect(x, 0, 1, 256);
    }
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
}

export function buildCarnet() {
    const group = new THREE.Group();
    const half = (PAGES + COVER) / 2;

    // Couverture avant (texturée sur la face visible uniquement)
    const plain = new THREE.MeshStandardMaterial({ color: COLORS.cover, roughness: 0.95 });
    const t = buildCoverTextures();
    const front = new THREE.MeshStandardMaterial({
        map: t.map,
        bumpMap: t.bumpMap,
        bumpScale: 3,
        metalnessMap: t.metalnessMap,
        metalness: 0.6,
        roughness: 0.75,
    });
    const coverGeo = new THREE.BoxGeometry(W, H, COVER);
    const frontCover = new THREE.Mesh(coverGeo, [plain, plain, plain, plain, front, plain]);
    frontCover.position.z = half;
    const backCover = new THREE.Mesh(coverGeo, plain);
    backCover.position.z = -half;

    // Bloc de pages, légèrement en retrait
    const edge = buildPaperEdge();
    const paperSide = new THREE.MeshStandardMaterial({ map: edge, roughness: 1 });
    const paperFlat = new THREE.MeshStandardMaterial({ color: COLORS.paper, roughness: 1 });
    const pages = new THREE.Mesh(
        new THREE.BoxGeometry(W - 0.06, H - 0.06, PAGES),
        [paperSide, paperSide, paperSide, paperSide, paperFlat, paperFlat],
    );
    pages.position.x = 0.02;

    for (const m of [frontCover, backCover, pages]) {
        m.castShadow = true;
        group.add(m);
    }

    // Anneaux métalliques qui traversent le bord gauche
    const metal = new THREE.MeshStandardMaterial({ color: COLORS.metal, metalness: 1, roughness: 0.3 });
    const ringGeo = new THREE.TorusGeometry(0.2, 0.02, 16, 48);
    for (const y of RINGS_Y) {
        const ring = new THREE.Mesh(ringGeo, metal);
        ring.rotation.x = Math.PI / 2;
        ring.position.set(-W / 2 + 0.09 - 0.12, y, 0);
        ring.castShadow = true;
        group.add(ring);
    }

    // Légère inclinaison, comme un carnet posé en présentoir
    group.rotation.x = -0.12;
    return group;
}