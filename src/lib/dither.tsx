"use client";

// Ordered-dithered image via WebGL: Bayer 8x8 threshold + per-channel
// quantization. Falls back to the plain <img> if WebGL is unavailable.

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";

const VERT = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  v_uv.y = 1.0 - v_uv.y;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

const FRAG = `
precision mediump float;
varying vec2 v_uv;
uniform sampler2D u_tex;

float bayer2(vec2 a) {
  a = floor(a);
  return fract(a.x / 2.0 + a.y * a.y * 0.75);
}

void main() {
  vec2 px = gl_FragCoord.xy;
  // Recursive Bayer: 2 -> 4 -> 8
  float b = bayer2(px / 4.0) * 0.25 * 0.25
          + bayer2(px / 2.0) * 0.25
          + bayer2(px);
  b /= 1.3125; // normalize to ~[0,1)
  vec3 c = texture2D(u_tex, v_uv).rgb;
  float levels = 6.0; // 7 steps per channel — visible grain, not a poster
  vec3 q = floor(c * levels + b) / levels;
  // Keep it subtle: mostly quantized, softened by the original.
  gl_FragColor = vec4(mix(c, q, 0.65), 1.0);
}
`;

export function DitheredImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl");
    if (!gl) {
      setFailed(true);
      return;
    }

    const img = new Image();
    img.src = src;
    img.onload = () => {
      // Render at the *displayed* size so the dither pattern is 1:1 on
      // screen — downscaling a full-res dither just turns into mush.
      const w = canvas.clientWidth || img.naturalWidth;
      const h = canvas.clientHeight || img.naturalHeight;
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);

      const compile = (type: number, code: string) => {
        const s = gl.createShader(type)!;
        gl.shaderSource(s, code);
        gl.compileShader(s);
        return s;
      };
      const prog = gl.createProgram()!;
      gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        setFailed(true);
        return;
      }
      gl.useProgram(prog);

      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 3, -1, -1, 3]),
        gl.STATIC_DRAW
      );
      const loc = gl.getAttribLocation(prog, "a_pos");
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    img.onerror = () => setFailed(true);
  }, [src]);

  if (failed) {
    return <img src={src} alt={alt} className={className} />;
  }
  return (
    <canvas ref={canvasRef} className={className} role="img" aria-label={alt} />
  );
}
