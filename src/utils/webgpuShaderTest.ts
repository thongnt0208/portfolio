export interface ShaderTestResult {
  passed: boolean;
  error?: string;
}

const COMPUTE_SHADER = `
@group(0) @binding(0) var<storage, read> a : array<f32>;
@group(0) @binding(1) var<storage, read> b : array<f32>;
@group(0) @binding(2) var<storage, read_write> result : array<f32>;

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) gid : vec3u) {
  let i = gid.x;
  if (i < arrayLength(&a)) {
    result[i] = a[i] * b[i] + a[i];
  }
}
`;

const ELEMENTS = 256;
const BYTE_LENGTH = ELEMENTS * 4;
const TIMEOUT_MS = 5000;

/**
 * Runs a minimal WebGPU compute shader to verify the GPU can actually compile
 * and execute compute work, catching shader/driver failures before downloading
 * a large model. Completes in <1 second on capable hardware.
 */
export async function runWebGPUShaderTest(): Promise<ShaderTestResult> {
  if (!('gpu' in navigator) || !navigator.gpu) {
    return { passed: false, error: 'navigator.gpu unavailable' };
  }

  const gpu = navigator.gpu as any;
  let device: any = null;

  try {
    const adapter = await gpu.requestAdapter();
    if (!adapter) return { passed: false, error: 'No WebGPU adapter' };

    device = await adapter.requestDevice();

    const shaderModule = device.createShaderModule({ code: COMPUTE_SHADER });
    const compilationInfo = await shaderModule.getCompilationInfo();
    const hasError = compilationInfo.messages.some((m: any) => m.type === 'error');
    if (hasError) {
      const msg = compilationInfo.messages.map((m: any) => m.message).join('; ');
      return { passed: false, error: `Shader compilation failed: ${msg}` };
    }

    const pipeline = device.createComputePipeline({
      layout: 'auto',
      compute: { module: shaderModule, entryPoint: 'main' },
    });

    const inputA = new Float32Array(ELEMENTS).fill(2);
    const inputB = new Float32Array(ELEMENTS).fill(3);

    const STORAGE = 0x80; // GPUBufferUsage.STORAGE
    const COPY_SRC = 0x04; // GPUBufferUsage.COPY_SRC
    const MAP_READ = 0x01; // GPUBufferUsage.MAP_READ
    const COPY_DST = 0x08; // GPUBufferUsage.COPY_DST

    const createBuffer = (data: Float32Array, usage: number) => {
      const buf = device.createBuffer({ size: data.byteLength, usage, mappedAtCreation: true });
      new Float32Array(buf.getMappedRange()).set(data);
      buf.unmap();
      return buf;
    };

    const bufA = createBuffer(inputA, STORAGE);
    const bufB = createBuffer(inputB, STORAGE);
    const bufResult = device.createBuffer({ size: BYTE_LENGTH, usage: STORAGE | COPY_SRC });
    const bufReadback = device.createBuffer({ size: BYTE_LENGTH, usage: MAP_READ | COPY_DST });

    const bindGroup = device.createBindGroup({
      layout: pipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: bufA } },
        { binding: 1, resource: { buffer: bufB } },
        { binding: 2, resource: { buffer: bufResult } },
      ],
    });

    const encoder = device.createCommandEncoder();
    const pass = encoder.beginComputePass();
    pass.setPipeline(pipeline);
    pass.setBindGroup(0, bindGroup);
    pass.dispatchWorkgroups(Math.ceil(ELEMENTS / 64));
    pass.end();
    encoder.copyBufferToBuffer(bufResult, 0, bufReadback, 0, BYTE_LENGTH);
    device.queue.submit([encoder.finish()]);

    await Promise.race([
      bufReadback.mapAsync(MAP_READ),
      new Promise((_, reject) => setTimeout(() => reject(new Error('GPU readback timed out')), TIMEOUT_MS)),
    ]);

    const output = new Float32Array(bufReadback.getMappedRange());
    // a[i]*b[i]+a[i] = 2*3+2 = 8
    const valid = output[0] === 8 && output[ELEMENTS - 1] === 8;
    bufReadback.unmap();

    [bufA, bufB, bufResult, bufReadback].forEach((b: any) => b.destroy());

    return valid ? { passed: true } : { passed: false, error: 'Compute result mismatch' };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { passed: false, error: message };
  } finally {
    try { device?.destroy(); } catch { /* device may already be lost */ }
  }
}
