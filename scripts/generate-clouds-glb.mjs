import fs from "node:fs";
import path from "node:path";
import * as THREE from "three";

const cloud = new THREE.Group();
const puffs = [
  [0, 0.2, 0, 1.8],
  [1.4, 0.35, 0.3, 1.45],
  [-1.5, 0.15, 0.2, 1.4],
  [0.4, 0.95, -0.2, 1.2],
  [-0.6, 0.85, 0.4, 1.1],
  [2.2, 0.05, -0.35, 1.05],
  [-2.1, 0.0, -0.25, 1.0],
  [0.2, -0.15, 0.9, 1.15],
  [-0.3, -0.1, -0.85, 1.05],
];

for (const [x, y, z, r] of puffs) {
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(r, 16, 12));
  mesh.position.set(x, y, z);
  mesh.scale.set(1.15, 0.72, 1.05);
  cloud.add(mesh);
}

const merged = new THREE.BufferGeometry();
const geometries = [];
cloud.updateMatrixWorld(true);
cloud.traverse((child) => {
  if (child instanceof THREE.Mesh) {
    const geo = child.geometry.clone();
    geo.applyMatrix4(child.matrixWorld);
    geometries.push(geo);
  }
});

const combined = geometries[0].clone();
for (let i = 1; i < geometries.length; i += 1) {
  combined.setAttribute(
    "position",
    mergeAttribute(combined, geometries[i], "position"),
  );
  combined.setAttribute("normal", mergeAttribute(combined, geometries[i], "normal"));
  combined.setIndex(mergeIndex(combined, geometries[i]));
}

function mergeAttribute(a, b, name) {
  const aAttr = a.getAttribute(name);
  const bAttr = b.getAttribute(name);
  const array = new Float32Array(aAttr.array.length + bAttr.array.length);
  array.set(aAttr.array, 0);
  array.set(bAttr.array, aAttr.array.length);
  return new THREE.BufferAttribute(array, aAttr.itemSize);
}

function mergeIndex(a, b) {
  const aIndex = a.index;
  const bIndex = b.index;
  const aCount = a.getAttribute("position").count;
  const array = new Uint32Array(aIndex.count + bIndex.count);
  array.set(aIndex.array, 0);
  for (let i = 0; i < bIndex.count; i += 1) {
    array[aIndex.count + i] = bIndex.array[i] + aCount;
  }
  return new THREE.BufferAttribute(array, 1);
}

combined.computeVertexNormals();
combined.computeBoundingBox();

const positions = combined.getAttribute("position").array;
const normals = combined.getAttribute("normal").array;
const indices = combined.index.array;

const posBytes = new Uint8Array(positions.buffer, positions.byteOffset, positions.byteLength);
const norBytes = new Uint8Array(normals.buffer, normals.byteOffset, normals.byteLength);
const idxBytes = new Uint8Array(indices.buffer, indices.byteOffset, indices.byteLength);

const pad4 = (n) => (4 - (n % 4)) % 4;
const binParts = [posBytes, norBytes, idxBytes];
const offsets = [];
let cursor = 0;
for (const part of binParts) {
  offsets.push(cursor);
  cursor += part.byteLength + pad4(part.byteLength);
}
const bin = new Uint8Array(cursor);
cursor = 0;
for (const part of binParts) {
  bin.set(part, cursor);
  cursor += part.byteLength + pad4(part.byteLength);
}

const json = {
  asset: { version: "2.0", generator: "raheel-roaa-cloud" },
  scene: 0,
  scenes: [{ nodes: [0] }],
  nodes: [{ mesh: 0, name: "cloud_cluster" }],
  meshes: [
    {
      name: "cloud_cluster",
      primitives: [
        {
          attributes: { POSITION: 0, NORMAL: 1 },
          indices: 2,
          material: 0,
        },
      ],
    },
  ],
  materials: [
    {
      name: "cloud",
      pbrMetallicRoughness: {
        baseColorFactor: [0.97, 0.98, 1, 1],
        metallicFactor: 0,
        roughnessFactor: 0.92,
      },
    },
  ],
  accessors: [
    {
      bufferView: 0,
      componentType: 5126,
      count: positions.length / 3,
      type: "VEC3",
      min: combined.boundingBox.min.toArray(),
      max: combined.boundingBox.max.toArray(),
    },
    {
      bufferView: 1,
      componentType: 5126,
      count: normals.length / 3,
      type: "VEC3",
    },
    {
      bufferView: 2,
      componentType: 5125,
      count: indices.length,
      type: "SCALAR",
    },
  ],
  bufferViews: [
    { buffer: 0, byteOffset: offsets[0], byteLength: posBytes.byteLength, target: 34962 },
    { buffer: 0, byteOffset: offsets[1], byteLength: norBytes.byteLength, target: 34962 },
    { buffer: 0, byteOffset: offsets[2], byteLength: idxBytes.byteLength, target: 34963 },
  ],
  buffers: [{ byteLength: bin.byteLength }],
};

let jsonText = JSON.stringify(json);
const jsonPad = pad4(jsonText.length);
jsonText += " ".repeat(jsonPad);
const jsonBytes = Buffer.from(jsonText, "utf8");
const binPad = pad4(bin.byteLength);
const total = 12 + 8 + jsonBytes.length + 8 + bin.byteLength + binPad;
const glb = Buffer.alloc(total);

glb.writeUInt32LE(0x46546c67, 0);
glb.writeUInt32LE(2, 4);
glb.writeUInt32LE(total, 8);
glb.writeUInt32LE(jsonBytes.length, 12);
glb.writeUInt32LE(0x4e4f534a, 16);
jsonBytes.copy(glb, 20);

const binChunkStart = 20 + jsonBytes.length;
glb.writeUInt32LE(bin.byteLength + binPad, binChunkStart);
glb.writeUInt32LE(0x004e4942, binChunkStart + 4);
Buffer.from(bin).copy(glb, binChunkStart + 8);

const out = path.resolve("public/clouds.glb");
fs.writeFileSync(out, glb);
console.log("Wrote", out, glb.length, "bytes");
