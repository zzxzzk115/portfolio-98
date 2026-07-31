// Fragment shader bodies for animated wallpapers & screensavers.
// All use u_time / u_resolution from glview's header.

export const PLASMA_FRAG = `
void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float t = u_time * 0.4;
  float v = sin(uv.x * 8.0 + t)
          + sin(uv.y * 6.0 - t * 1.3)
          + sin((uv.x + uv.y) * 7.0 + t * 0.7)
          + sin(length(uv - 0.5) * 14.0 - t * 2.0);
  v *= 0.25;
  vec3 col = vec3(
    0.5 + 0.5 * sin(3.14159 * v),
    0.5 + 0.5 * sin(3.14159 * v + 2.094),
    0.5 + 0.5 * sin(3.14159 * v + 4.188)
  );
  col *= 0.55; // keep it desktop-friendly, icons must stay readable
  gl_FragColor = vec4(col, 1.0);
}
`;

export const DRIFT_FRAG = `
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x),
             mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * vnoise(p); p *= 2.02; a *= 0.5; }
  return v;
}
void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv.x *= u_resolution.x / u_resolution.y;
  float t = u_time * 0.05;
  float n = fbm(uv * 2.0 + vec2(t * 2.0, -t));
  float m = fbm(uv * 3.5 - vec2(t, t * 1.5) + n);
  vec3 deep = vec3(0.0, 0.18, 0.22);
  vec3 mid  = vec3(0.0, 0.42, 0.45);
  vec3 glow = vec3(0.55, 0.75, 0.70);
  vec3 col = mix(deep, mid, n);
  col = mix(col, glow, smoothstep(0.55, 0.9, m) * 0.5);
  gl_FragColor = vec4(col, 1.0);
}
`;

export const RIPPLE_FRAG = `
void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = uv - 0.5;
  p.x *= u_resolution.x / u_resolution.y;
  float t = u_time;
  float d1 = length(p - vec2(0.25 * sin(t * 0.3), 0.2 * cos(t * 0.23)));
  float d2 = length(p + vec2(0.3 * cos(t * 0.17), 0.25 * sin(t * 0.27)));
  float w = sin(d1 * 40.0 - t * 2.2) + sin(d2 * 34.0 - t * 1.7);
  float shade = 0.5 + 0.25 * w;
  vec3 water = vec3(0.02, 0.25, 0.45) * shade + vec3(0.0, 0.05, 0.1);
  float spec = pow(max(0.0, w * 0.5), 6.0) * 0.25;
  gl_FragColor = vec4(water + spec, 1.0);
}
`;

export const STARFIELD_FRAG = `
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;
  vec3 col = vec3(0.0);
  for (int layer = 0; layer < 6; layer++) {
    float fl = float(layer);
    float speed = 0.05 + fl * 0.05;
    float scale = 18.0 + fl * 14.0;
    float z = fract(u_time * speed + fl * 0.37);
    vec2 grid = uv * scale / (0.2 + z);
    vec2 cell = floor(grid);
    vec2 f = fract(grid) - 0.5;
    float star = hash(cell + fl * 91.7);
    if (star > 0.96) {
      float b = (1.0 - length(f) * 2.0);
      b = max(0.0, b);
      b = pow(b, 6.0) * z * (0.4 + 0.6 * hash(cell * 1.3));
      col += vec3(b) * vec3(0.8 + 0.2 * star, 0.9, 1.0);
    }
  }
  gl_FragColor = vec4(col, 1.0);
}
`;

export const TUNNEL_FRAG = `
// Raymarched hex-ish tunnel — the "I write renderers for a living" screensaver.
float sdTunnel(vec3 p) {
  vec2 q = vec2(length(p.xy) - 1.6, p.z);
  float wobble = 0.15 * sin(p.z * 0.8 + u_time) * sin(atan(p.y, p.x) * 6.0);
  return -(length(p.xy) - (1.8 + wobble));
}
void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;
  vec3 ro = vec3(0.4 * sin(u_time * 0.5), 0.3 * cos(u_time * 0.4), u_time * 2.0);
  vec3 rd = normalize(vec3(uv, 1.0));
  float t = 0.0;
  float glow = 0.0;
  for (int i = 0; i < 48; i++) {
    vec3 p = ro + rd * t;
    float d = sdTunnel(p - vec3(0.0, 0.0, 0.0));
    if (d < 0.002 || t > 30.0) break;
    glow += 0.02 / (0.1 + abs(d));
    t += max(d * 0.6, 0.02);
  }
  vec3 p = ro + rd * t;
  float rings = 0.5 + 0.5 * sin(p.z * 3.0 - u_time * 2.0);
  float ang = atan(p.y - ro.y * 0.0, p.x) ;
  float stripes = smoothstep(0.4, 0.9, 0.5 + 0.5 * sin(ang * 6.0 + p.z));
  vec3 base = mix(vec3(0.0, 0.1, 0.2), vec3(0.0, 0.5, 0.6), rings);
  base += vec3(0.6, 0.2, 0.8) * stripes * 0.3;
  vec3 col = base * exp(-t * 0.12) + glow * 0.02 * vec3(0.2, 0.6, 0.8);
  gl_FragColor = vec4(col, 1.0);
}
`;
