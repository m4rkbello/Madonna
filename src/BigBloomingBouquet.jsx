import React, { useState, useEffect } from 'react';

/* =============================================================================
   Ultra-detailed rose petal geometry
============================================================================= */

function petalPath(len, wid) {
  const w = wid / 2;
  return `M0,0
    C ${-w},${-len * 0.32} ${-w * 0.92},${-len * 0.8} ${-w * 0.18},${-len}
    C ${-w * 0.06},${-len * 1.03} ${w * 0.06},${-len * 1.03} ${w * 0.18},${-len}
    C ${w * 0.92},${-len * 0.8} ${w},${-len * 0.32} 0,0 Z`;
}

function rand(seed) {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

const LAYER_PRESETS = {
  large: [
    { count: 3, len: 10, wid: 6.5, gradient: 'roseHeart',   rotate: 0,  tilt: 1,    stroke: '#ffb3c1' },
    { count: 5, len: 16, wid: 10,  gradient: 'roseHeart',   rotate: 18, tilt: 0.98, stroke: '#ffb3c1' },
    { count: 6, len: 22, wid: 13,  gradient: 'roseBlush',   rotate: 30, tilt: 0.94, stroke: '#ff8fa3' },
    { count: 7, len: 29, wid: 17,  gradient: 'roseBlush',   rotate: 6,  tilt: 0.89, stroke: '#ff8fa3', shadow: true },
    { count: 8, len: 37, wid: 21,  gradient: 'roseScarlet', rotate: 14, tilt: 0.84, stroke: '#e63950', shadow: true, veins: true },
    { count: 9, len: 46, wid: 26,  gradient: 'roseCrimson', rotate: 2,  tilt: 0.79, stroke: '#c9184a', shadow: true, veins: true },
    { count: 8, len: 54, wid: 30,  gradient: 'roseVelvet',  rotate: 20, tilt: 0.74, stroke: '#8b0a2e', shadow: true, veins: true, curl: true },
  ],
  medium: [
    { count: 3, len: 8,  wid: 5.5, gradient: 'roseHeart',  rotate: 0,  tilt: 1,    stroke: '#ffb3c1' },
    { count: 5, len: 13, wid: 8,   gradient: 'roseBlush',  rotate: 20, tilt: 0.96, stroke: '#ff8fa3' },
    { count: 6, len: 19, wid: 11,  gradient: 'roseScarlet',rotate: 10, tilt: 0.9,  stroke: '#e63950', shadow: true },
    { count: 7, len: 25, wid: 15,  gradient: 'roseBlush',  rotate: 4,  tilt: 0.84, stroke: '#ff758f', shadow: true, veins: true },
    { count: 7, len: 32, wid: 18,  gradient: 'roseCrimson',rotate: 16, tilt: 0.78, stroke: '#c9184a', shadow: true, veins: true, curl: true },
  ],
  small: [
    { count: 3, len: 6,  wid: 4.5, gradient: 'roseHeart',   rotate: 0,  tilt: 1,    stroke: '#ffb3c1' },
    { count: 5, len: 10, wid: 7,   gradient: 'roseScarlet', rotate: 18, tilt: 0.93, stroke: '#e63950' },
    { count: 6, len: 15, wid: 9.5, gradient: 'roseCrimson', rotate: 6,  tilt: 0.85, stroke: '#c9184a', shadow: true, veins: true },
    { count: 6, len: 19, wid: 12,  gradient: 'roseVelvet',  rotate: 14, tilt: 0.78, stroke: '#8b0a2e', shadow: true, curl: true },
  ],
  accent: [
    { count: 3, len: 5, wid: 4, gradient: 'roseBlush', rotate: 0,  tilt: 1,    stroke: '#ffb3c1' },
    { count: 4, len: 8, wid: 6, gradient: 'roseGold',  rotate: 20, tilt: 0.9, stroke: '#d4ac0d' },
  ],
};

function sepalPath(len, wid) {
  const w = wid / 2;
  return `M0,0 C ${-w},${len * 0.35} ${-w * 0.6},${len * 0.85} 0,${len} C ${w * 0.6},${len * 0.85} ${w},${len * 0.35} 0,0 Z`;
}

function Calyx({ radius = 30, count = 5, seed = 0 }) {
  return (
    <g opacity="0.95">
      {Array.from({ length: count }).map((_, i) => {
        const angle = (360 / count) * i + rand(seed + i) * 10;
        return (
          <g key={i} transform={`rotate(${angle}) translate(0, ${radius * 0.55})`}>
            <path d={sepalPath(radius * 0.7, radius * 0.28)} fill="url(#leafGreen2)" stroke="#1b4332" strokeWidth="0.4" opacity="0.9" />
          </g>
        );
      })}
    </g>
  );
}

function RoseBloom({ cx, cy, scale = 1, rotate = 0, size = 'large', seed = 0 }) {
  const layers = LAYER_PRESETS[size];
  const outerLen = layers[layers.length - 1].len;

  return (
    <g transform={`translate(${cx},${cy}) rotate(${rotate}) scale(${scale})`}>
      {size !== 'accent' && <Calyx radius={outerLen} seed={seed} />}
      <ellipse rx={outerLen * 0.95} ry={outerLen * 0.8} fill="url(#roseCrimson)" opacity="0.3" filter="url(#softGlow)" />

      {layers.map((layer, li) => (
        <g key={li}>
          {Array.from({ length: layer.count }).map((_, i) => {
            const petalSeed = seed * 31 + li * 7 + i;
            const baseAngle = (360 / layer.count) * i + layer.rotate;
            const wob = (rand(petalSeed) - 0.5) * 8; 
            const sizeJitter = 0.92 + rand(petalSeed + 3) * 0.16;
            const opacityJitter = 0.88 + rand(petalSeed + 6) * 0.12;
            const angle = baseAngle + wob;

            return (
              <g key={i} transform={`rotate(${angle})`}>
                <g transform={`scale(${sizeJitter}, ${layer.tilt * sizeJitter})`}>
                  <path
                    d={petalPath(layer.len, layer.wid)}
                    fill={`url(#${layer.gradient})`}
                    stroke={layer.stroke}
                    strokeWidth="0.5"
                    opacity={opacityJitter}
                    filter={layer.shadow ? 'url(#petalShadow)' : undefined}
                  />
                  {layer.veins && (
                    <g opacity="0.35" stroke={layer.stroke} strokeWidth="0.5" fill="none">
                      <path d={`M0,0 Q0,${-layer.len * 0.5} 0,${-layer.len * 0.94}`} />
                      <path d={`M0,0 Q${-layer.wid * 0.28},${-layer.len * 0.45} ${-layer.wid * 0.18},${-layer.len * 0.85}`} />
                      <path d={`M0,0 Q${layer.wid * 0.28},${-layer.len * 0.45} ${layer.wid * 0.18},${-layer.len * 0.85}`} />
                    </g>
                  )}
                  <path
                    d={petalPath(layer.len * 0.55, layer.wid * 0.26)}
                    fill="#ffffff"
                    opacity="0.16"
                    transform={`translate(0, ${-layer.len * 0.1})`}
                  />
                  {layer.curl && (
                    <path
                      d={`M${-layer.wid * 0.16},${-layer.len * 0.86} Q0,${-layer.len * 1.05} ${layer.wid * 0.16},${-layer.len * 0.86} Q0,${-layer.len * 0.94} ${-layer.wid * 0.16},${-layer.len * 0.86} Z`}
                      fill={layer.stroke}
                      opacity="0.4"
                    />
                  )}
                </g>
              </g>
            );
          })}
        </g>
      ))}
      {size !== 'accent' && (
        <g>
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (Math.PI * 2 * i) / 8 + rand(seed + i) * 0.3;
            const r = 2 + rand(seed + i + 1) * 0.8;
            return (
              <circle key={i} cx={Math.cos(a) * r} cy={Math.sin(a) * r} r={0.7 + rand(seed + i + 2) * 0.4} fill="#f4d03f" />
            );
          })}
          <circle r="1.5" fill="#fff8d6" />
        </g>
      )}
    </g>
  );
}

const RoseBouquet = () => {
  const [stage, setStage] = useState('idle');
  const [showName, setShowName] = useState(false);

  const handleBloom = () => {
    if (stage !== 'idle') return;
    setStage('blooming');
    setShowName(false);

    setTimeout(() => {
      setStage('bloomed');
      setTimeout(() => setShowName(true), 300);
    }, 2800);
  };

  const handleReset = () => {
    window.location.reload(); 
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleBloom();
    }, 800);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const bloomClass = () =>
    `origin-center transition-all duration-[1400ms] ease-out ${
      stage === 'idle' ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
    }`;

  const Thorn = ({ x, y, angle = 0 }) => (
    <path d="M0,0 L4,2 L0,4 Z" fill="#2d6a4f" transform={`translate(${x},${y}) rotate(${angle})`} />
  );

  return (
    /* ===== THE BACKGROUND IMAGE CONTAINER ===== */
    <div 
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden font-serif selection:bg-rose-600 selection:text-white bg-cover bg-center bg-fixed py-10"
      style={{ backgroundImage: `url('https://i.ibb.co/cSnW0gLQ/800448598-1006721439053349-1745937785963211926-n.jpg')` }}
    >
      {/* Dark overlay to make sure the bouquet and text pop */}
      <div className="absolute inset-0 bg-black/60 pointer-events-none" />

      {/* ===== FLOATING HEARTS ===== */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(25)].map((_, i) => {
          const size = Math.random() * 20 + 15; // Sizes between 15px and 35px
          return (
            <svg
              key={i}
              className="heart absolute drop-shadow-md"
              viewBox="0 0 24 24"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${Math.random() * 100}%`,
                bottom: `-50px`, // Start below the screen
                animationDuration: `${Math.random() * 12 + 8}s`, // Between 8s and 20s
                animationDelay: `${Math.random() * 10}s`,
                '--target-opacity': Math.random() * 0.4 + 0.4, // Opacity between 0.4 and 0.8
              }}
            >
              {/* Beautiful SVG Heart Path */}
              <path 
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
                fill="#ff4d6d" 
                opacity="0.85" 
              />
            </svg>
          );
        })}
      </div>

      {/* Center glowing orb behind bouquet */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[600px] h-[600px] rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />

      {/* ===== FOREGROUND CONTENT ===== */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-4xl px-4 mt-8 md:mt-0">
        
        {/* Bouquet SVG - Made responsive using max-w-[280px] for mobile up to max-w-lg for desktop */}
        <div className="relative w-full max-w-[280px] sm:max-w-sm md:max-w-md lg:max-w-lg aspect-square flex items-center justify-center">
          <svg viewBox="0 0 500 500" className={`w-full h-full transition-all duration-1000 ease-out ${stage === 'idle' ? 'scale-90 opacity-70' : 'scale-100 opacity-100'}`}>
            <defs>
              <radialGradient id="roseCrimson" cx="45%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#ff8fa3" />
                <stop offset="25%" stopColor="#ff4d6d" />
                <stop offset="55%" stopColor="#c9184a" />
                <stop offset="80%" stopColor="#8b0a2e" />
                <stop offset="100%" stopColor="#4a0015" />
              </radialGradient>
              <radialGradient id="roseScarlet" cx="50%" cy="45%" r="55%">
                <stop offset="0%" stopColor="#ffb3c1" />
                <stop offset="30%" stopColor="#ff5c7a" />
                <stop offset="65%" stopColor="#d90429" />
                <stop offset="100%" stopColor="#6b001a" />
              </radialGradient>
              <radialGradient id="roseBlush" cx="50%" cy="45%" r="55%">
                <stop offset="0%" stopColor="#ffe0e6" />
                <stop offset="35%" stopColor="#ffb3c1" />
                <stop offset="70%" stopColor="#ff4d6d" />
                <stop offset="100%" stopColor="#a4133c" />
              </radialGradient>
              <radialGradient id="roseVelvet" cx="50%" cy="50%" r="55%">
                <stop offset="0%" stopColor="#ff758f" />
                <stop offset="45%" stopColor="#c9184a" />
                <stop offset="100%" stopColor="#590d22" />
              </radialGradient>
              <radialGradient id="roseHeart" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fff5f7" />
                <stop offset="30%" stopColor="#ffe0e6" />
                <stop offset="70%" stopColor="#ffb3c1" />
                <stop offset="100%" stopColor="#ff4d6d" />
              </radialGradient>
              <radialGradient id="roseGold" cx="50%" cy="45%" r="55%">
                <stop offset="0%" stopColor="#fff4d6" />
                <stop offset="40%" stopColor="#f4d03f" />
                <stop offset="80%" stopColor="#d4ac0d" />
                <stop offset="100%" stopColor="#9c7a0a" />
              </radialGradient>
              <linearGradient id="stemGreen" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#52b788" />
                <stop offset="40%" stopColor="#2d6a4f" />
                <stop offset="100%" stopColor="#1b4332" />
              </linearGradient>
              <linearGradient id="leafGreen" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#74c69d" />
                <stop offset="50%" stopColor="#40916c" />
                <stop offset="100%" stopColor="#1b4332" />
              </linearGradient>
              <linearGradient id="leafGreen2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#95d5b2" />
                <stop offset="100%" stopColor="#2d6a4f" />
              </linearGradient>
              <linearGradient id="ribbonGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f9e79f" />
                <stop offset="30%" stopColor="#f4d03f" />
                <stop offset="70%" stopColor="#d4ac0d" />
                <stop offset="100%" stopColor="#b7950b" />
              </linearGradient>
              <linearGradient id="ribbonSheen" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fff8d6" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#f4d03f" stopOpacity="0" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
                <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <filter id="softGlow">
                <feGaussianBlur stdDeviation="2.5" result="blur"/>
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <filter id="petalShadow">
                <feDropShadow dx="1" dy="1.5" stdDeviation="1.5" floodColor="#4a0015" floodOpacity="0.4"/>
              </filter>
            </defs>

            {/* ===== STEMS, THORNS & LEAVES ===== */}
            <g className={`origin-bottom transition-all duration-[2000ms] ease-out ${stage === 'idle' ? 'scale-y-0 opacity-0' : 'scale-y-100 opacity-100'}`}>
              <path d="M250 440 Q240 370 230 280" stroke="url(#stemGreen)" strokeWidth="7" fill="none" strokeLinecap="round"/>
              <path d="M250 440 Q260 370 270 270" stroke="url(#stemGreen)" strokeWidth="7" fill="none" strokeLinecap="round"/>
              <path d="M250 440 Q215 365 185 290" stroke="url(#stemGreen)" strokeWidth="6.5" fill="none" strokeLinecap="round"/>
              <path d="M250 440 Q285 365 315 290" stroke="url(#stemGreen)" strokeWidth="6.5" fill="none" strokeLinecap="round"/>
              <path d="M250 440 Q250 350 250 260" stroke="url(#stemGreen)" strokeWidth="7" fill="none" strokeLinecap="round"/>
              <path d="M250 440 Q195 370 145 310" stroke="url(#stemGreen)" strokeWidth="6" fill="none" strokeLinecap="round"/>
              <path d="M250 440 Q305 370 355 310" stroke="url(#stemGreen)" strokeWidth="6" fill="none" strokeLinecap="round"/>
              <path d="M250 440 Q230 360 200 300" stroke="url(#stemGreen)" strokeWidth="5.5" fill="none" strokeLinecap="round"/>
              <path d="M250 440 Q270 360 300 300" stroke="url(#stemGreen)" strokeWidth="5.5" fill="none" strokeLinecap="round"/>

              <Thorn x={235} y={400} angle={-30} />
              <Thorn x={265} y={400} angle={30} />
              <Thorn x={220} y={340} angle={-40} />
              <Thorn x={280} y={340} angle={40} />
              <Thorn x={200} y={370} angle={-50} />
              <Thorn x={300} y={370} angle={50} />

              <g>
                <ellipse cx="200" cy="330" rx="28" ry="10" fill="url(#leafGreen)" transform="rotate(-45 200 330)"/>
                <path d="M175 340 Q200 330 225 320" stroke="#1b4332" strokeWidth="0.8" fill="none" opacity="0.5" transform="rotate(-45 200 330)"/>
                <path d="M182 336 Q190 330 200 328" stroke="#1b4332" strokeWidth="0.4" fill="none" opacity="0.35" transform="rotate(-45 200 330)"/>
                <path d="M218 324 Q210 328 200 328" stroke="#1b4332" strokeWidth="0.4" fill="none" opacity="0.35" transform="rotate(-45 200 330)"/>
              </g>
              <g>
                <ellipse cx="300" cy="330" rx="28" ry="10" fill="url(#leafGreen)" transform="rotate(45 300 330)"/>
                <path d="M275 340 Q300 330 325 320" stroke="#1b4332" strokeWidth="0.8" fill="none" opacity="0.5" transform="rotate(45 300 330)"/>
              </g>
              <g>
                <ellipse cx="170" cy="365" rx="24" ry="9" fill="url(#leafGreen2)" transform="rotate(-35 170 365)"/>
                <path d="M148 372 Q170 365 192 358" stroke="#1b4332" strokeWidth="0.7" fill="none" opacity="0.5" transform="rotate(-35 170 365)"/>
              </g>
              <g>
                <ellipse cx="330" cy="365" rx="24" ry="9" fill="url(#leafGreen2)" transform="rotate(35 330 365)"/>
                <path d="M308 372 Q330 365 352 358" stroke="#1b4332" strokeWidth="0.7" fill="none" opacity="0.5" transform="rotate(35 330 365)"/>
              </g>
              <g>
                <ellipse cx="225" cy="390" rx="26" ry="9" fill="url(#leafGreen)" transform="rotate(-25 225 390)"/>
                <path d="M201 397 Q225 390 249 383" stroke="#1b4332" strokeWidth="0.7" fill="none" opacity="0.5" transform="rotate(-25 225 390)"/>
              </g>
              <g>
                <ellipse cx="275" cy="390" rx="26" ry="9" fill="url(#leafGreen)" transform="rotate(25 275 390)"/>
                <path d="M251 397 Q275 390 299 383" stroke="#1b4332" strokeWidth="0.7" fill="none" opacity="0.5" transform="rotate(25 275 390)"/>
              </g>
              <ellipse cx="145" cy="385" rx="20" ry="8" fill="url(#leafGreen2)" transform="rotate(-50 145 385)"/>
              <ellipse cx="355" cy="385" rx="20" ry="8" fill="url(#leafGreen2)" transform="rotate(50 355 385)"/>
            </g>

            {/* ===== HUGE PACKED ROSES ===== */}
            
            {/* NEW TOP CENTER ROSE */}
            <g className={bloomClass()} style={{ transitionDelay: '400ms' }}>
              <RoseBloom cx={250} cy={135} scale={1.35} size="large" seed={12} />
            </g>

            {/* CENTER ROSE */}
            <g className={bloomClass()} style={{ transitionDelay: '200ms' }}>
              <RoseBloom cx={250} cy={230} scale={1.4} size="large" seed={1} />
            </g>

            {/* TOP LEFT ROSE */}
            <g className={bloomClass()} style={{ transitionDelay: '600ms' }}>
              <RoseBloom cx={185} cy={175} scale={1.3} rotate={-6} size="medium" seed={2} />
            </g>

            {/* TOP RIGHT ROSE */}
            <g className={bloomClass()} style={{ transitionDelay: '800ms' }}>
              <RoseBloom cx={315} cy={175} scale={1.3} rotate={6} size="medium" seed={3} />
            </g>

            {/* MID LEFT ROSE */}
            <g className={bloomClass()} style={{ transitionDelay: '1000ms' }}>
              <RoseBloom cx={150} cy={240} scale={1.2} rotate={-10} size="medium" seed={4} />
            </g>

            {/* MID RIGHT ROSE */}
            <g className={bloomClass()} style={{ transitionDelay: '1200ms' }}>
              <RoseBloom cx={350} cy={240} scale={1.2} rotate={10} size="medium" seed={5} />
            </g>

            {/* BOTTOM CENTER ROSES */}
            <g className={bloomClass()} style={{ transitionDelay: '1400ms' }}>
              <RoseBloom cx={205} cy={290} scale={1.15} rotate={-8} size="small" seed={6} />
              <RoseBloom cx={295} cy={290} scale={1.15} rotate={8} size="small" seed={7} />
            </g>

            {/* SMALL ACCENT ROSES */}
            <g className={bloomClass()} style={{ transitionDelay: '1600ms' }}>
              <RoseBloom cx={135} cy={285} scale={0.9} size="accent" seed={8} />
              <RoseBloom cx={365} cy={285} scale={0.9} size="accent" seed={9} />
              <RoseBloom cx={220} cy={100} scale={0.8} size="accent" seed={10} />
              <RoseBloom cx={280} cy={100} scale={0.8} size="accent" seed={11} />
            </g>

            {/* ===== RIBBON / WRAP ===== */}
            <g className={`transition-all duration-[1800ms] ease-out ${stage === 'idle' ? 'opacity-0 translate-y-6' : 'opacity-100 translate-y-0'}`} style={{ transitionDelay: '1800ms' }}>
              <path d="M170 320 Q250 385 330 320" stroke="url(#ribbonGold)" strokeWidth="7" fill="none" strokeLinecap="round"/>
              <path d="M185 337 Q250 400 315 337" stroke="url(#ribbonGold)" strokeWidth="5" fill="none" strokeLinecap="round"/>
              <path d="M170 320 Q250 385 330 320" stroke="url(#ribbonSheen)" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.6"/>
              <path d="M250 358 Q228 405 205 445" stroke="url(#ribbonGold)" strokeWidth="5" fill="none" strokeLinecap="round"/>
              <path d="M250 358 Q272 405 295 445" stroke="url(#ribbonGold)" strokeWidth="5" fill="none" strokeLinecap="round"/>
              <path d="M250 358 Q243 405 238 445" stroke="url(#ribbonGold)" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
              <path d="M250 358 Q257 405 262 445" stroke="url(#ribbonGold)" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
              <path d="M230 348 Q196 328 212 362 Q234 358 230 348" fill="url(#ribbonGold)" opacity="0.92"/>
              <path d="M270 348 Q304 328 288 362 Q266 358 270 348" fill="url(#ribbonGold)" opacity="0.92"/>
              <path d="M230 348 Q210 340 215 355" stroke="#fff8d6" strokeWidth="1" fill="none" opacity="0.4"/>
              <path d="M270 348 Q290 340 285 355" stroke="#fff8d6" strokeWidth="1" fill="none" opacity="0.4"/>
              <circle cx="250" cy="350" r="7" fill="#f4d03f" stroke="#d4ac0d" strokeWidth="1.2"/>
              <circle cx="248" cy="348" r="2.5" fill="#fff8d6" opacity="0.7"/>
            </g>
          </svg>
        </div>

        {/* Text Reveal - Sized responsively for mobile and desktop */}
        <div className={`mt-4 sm:mt-6 flex flex-col items-center justify-center text-center transition-all duration-1000 ease-out ${showName ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-rose-300 to-amber-200 drop-shadow-[0_0_30px_rgba(255,100,150,0.4)]">
            DONNA MARIE
          </h1>
          <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-[0.35em] text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-300 to-rose-200 mt-1 sm:mt-2 drop-shadow-[0_0_30px_rgba(255,150,100,0.4)]">
            MENDEZ
          </h2>
          
          <p className="mt-4 sm:mt-6 text-xs sm:text-sm md:text-base font-light italic text-rose-200/90 max-w-sm sm:max-w-lg mx-auto leading-relaxed px-4 text-center drop-shadow-md">
            "A flower is just the beginning. I’m not here to impress you for one day—I’m here to show you that my intentions are sincere."
          </p>

          <div className="mt-6 sm:mt-8 flex items-center justify-center gap-2 sm:gap-3">
            <span className="h-px w-6 sm:w-10 bg-gradient-to-r from-transparent to-rose-400/60"></span>
            <span className="text-rose-300/80 text-[10px] sm:text-xs tracking-[0.4em] uppercase font-semibold drop-shadow-sm">Madonna</span>
            <span className="h-px w-6 sm:w-10 bg-gradient-to-l from-transparent to-rose-400/60"></span>
          </div>
        </div>

        <div className={`mt-6 sm:mt-8 flex gap-4 transition-all duration-700 delay-500 pb-8 ${showName ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <button
            onClick={handleReset}
            className="px-5 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm tracking-widest uppercase text-rose-100 border border-rose-400/50 hover:border-rose-300 hover:bg-rose-500/20 transition-all duration-300 backdrop-blur-md cursor-pointer"
          >
            Replay
          </button>
        </div>
      </div>

      <style>{`
        /* Heart Float Animation Logic */
        .heart {
          animation: floatUpHeart linear infinite;
        }

        @keyframes floatUpHeart {
          0% {
            transform: translateY(0) scale(0.8) rotate(-5deg);
            opacity: 0;
          }
          10% {
            opacity: var(--target-opacity);
          }
          50% {
            transform: translateY(-50vh) scale(1.1) rotate(5deg);
          }
          90% {
            opacity: var(--target-opacity);
          }
          100% {
            transform: translateY(-110vh) scale(1) rotate(-5deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default RoseBouquet;