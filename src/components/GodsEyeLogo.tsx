import React from 'react';

export type GodsEyeLogoMode = 'idle' | 'scanning' | 'generating' | 'thinking' | 'success';

interface GodsEyeLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  mode?: GodsEyeLogoMode;
  showText?: boolean;
  subtext?: string;
  className?: string;
}

export const GodsEyeLogo: React.FC<GodsEyeLogoProps> = ({
  size = 'md',
  mode = 'idle',
  showText = false,
  subtext,
  className = '',
}) => {
  // Pixel sizing map
  const sizeMap = {
    xs: { dim: 28, stroke: 1.2, text: 'text-xs', sub: 'text-[9px]' },
    sm: { dim: 38, stroke: 1.4, text: 'text-sm', sub: 'text-[10px]' },
    md: { dim: 52, stroke: 1.6, text: 'text-base', sub: 'text-xs' },
    lg: { dim: 76, stroke: 1.8, text: 'text-xl', sub: 'text-xs' },
    xl: { dim: 130, stroke: 2.0, text: 'text-3xl', sub: 'text-sm' },
    hero: { dim: 220, stroke: 2.4, text: 'text-4xl sm:text-5xl', sub: 'text-sm sm:text-base' },
  };

  const currentSize = sizeMap[size];
  const dim = currentSize.dim;

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Eye Graphic SVG with Golden Pyramid & Radiant Rays */}
      <div
        className="relative flex items-center justify-center flex-shrink-0"
        style={{ width: dim, height: dim }}
      >
        {/* Outer ambient golden & cyan glow */}
        <div
          className={`absolute inset-0 rounded-full blur-xl pointer-events-none transition-all duration-700 ${
            mode === 'generating'
              ? 'bg-amber-400/40 opacity-100 scale-130'
              : mode === 'scanning'
              ? 'bg-cyan-400/30 opacity-90 scale-120'
              : mode === 'success'
              ? 'bg-amber-300/50 opacity-100 scale-140'
              : 'bg-amber-500/25 opacity-70 scale-110'
          }`}
        />

        <svg
          width={dim}
          height={dim}
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 select-none overflow-visible"
        >
          <defs>
            {/* Golden Metallic Linear Gradients */}
            <linearGradient id="godseye-gold-pyramid" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF2B2" />
              <stop offset="25%" stopColor="#F59E0B" />
              <stop offset="50%" stopColor="#D97706" />
              <stop offset="75%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#92400E" />
            </linearGradient>

            <linearGradient id="godseye-gold-edge" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="50%" stopColor="#FEF08A" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>

            <linearGradient id="godseye-ray-glow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
            </linearGradient>

            <radialGradient id="godseye-iris-gold" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="35%" stopColor="#F59E0B" />
              <stop offset="70%" stopColor="#B45309" />
              <stop offset="100%" stopColor="#451A03" />
            </radialGradient>

            <radialGradient id="godseye-pupil-depth" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="60%" stopColor="#0B0F19" />
              <stop offset="100%" stopColor="#020617" />
            </radialGradient>

            <linearGradient id="godseye-scan-beam" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0" />
              <stop offset="50%" stopColor="#67E8F9" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
            </linearGradient>

            <filter id="godseye-divine-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            <clipPath id="godseye-pyramid-clip">
              <polygon points="100,22 176,162 24,162" />
            </clipPath>
          </defs>

          {/* 1. RADIANT SUNBURST RAYS (Surrounding the Golden Pyramid) */}
          <g
            className={`${
              mode === 'generating' || mode === 'scanning'
                ? 'animate-pulse'
                : ''
            }`}
            style={{ transformOrigin: '100px 105px' }}
          >
            {/* Cardinal & diagonal major beams */}
            <line x1="100" y1="12" x2="100" y2="2" stroke="url(#godseye-gold-edge)" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="100" y1="188" x2="100" y2="198" stroke="url(#godseye-gold-edge)" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="12" y1="105" x2="2" y2="105" stroke="url(#godseye-gold-edge)" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="188" y1="105" x2="198" y2="105" stroke="url(#godseye-gold-edge)" strokeWidth="2.5" strokeLinecap="round" />

            {/* Sunburst diagonal rays */}
            <line x1="38" y1="42" x2="28" y2="32" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
            <line x1="162" y1="42" x2="172" y2="32" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
            <line x1="36" y1="168" x2="26" y2="178" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
            <line x1="164" y1="168" x2="174" y2="178" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" opacity="0.85" />

            {/* Fine intermediate light rays */}
            {[15, 30, 45, 60, 75, 105, 120, 135, 150, 165, 195, 210, 225, 240, 255, 285, 300, 315, 330, 345].map((deg) => {
              const rad = (deg * Math.PI) / 180;
              const x1 = 100 + Math.cos(rad) * 82;
              const y1 = 105 + Math.sin(rad) * 82;
              const x2 = 100 + Math.cos(rad) * 94;
              const y2 = 105 + Math.sin(rad) * 94;
              return (
                <line
                  key={deg}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#FBBF24"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  opacity="0.65"
                />
              );
            })}
          </g>

          {/* 2. CYBERNETIC SCANNING RING (Active during generating / scanning) */}
          {(mode === 'generating' || mode === 'scanning') && (
            <circle
              cx="100"
              cy="105"
              r="80"
              stroke="#38BDF8"
              strokeWidth="1.5"
              strokeDasharray="6 8 2 8"
              strokeOpacity="0.7"
              className="animate-spin"
              style={{ transformOrigin: '100px 105px', animationDuration: '8s' }}
            />
          )}

          {/* 3. GOLDEN PYRAMID OUTER BORDER (Thick bevelled triangular frame) */}
          <polygon
            points="100,20 180,165 20,165"
            fill="#090E17"
            stroke="url(#godseye-gold-pyramid)"
            strokeWidth="5"
            strokeLinejoin="round"
            filter="url(#godseye-divine-glow)"
          />

          {/* Inner Golden Rim Line */}
          <polygon
            points="100,32 170,158 30,158"
            fill="#060911"
            stroke="url(#godseye-gold-edge)"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeOpacity="0.9"
          />

          {/* Tiered Masonry Horizontal Lines inside Pyramid */}
          <g stroke="#D97706" strokeWidth="0.8" strokeOpacity="0.45" clipPath="url(#godseye-pyramid-clip)">
            <line x1="20" y1="55" x2="180" y2="55" />
            <line x1="20" y1="75" x2="180" y2="75" />
            <line x1="20" y1="95" x2="180" y2="95" />
            <line x1="20" y1="115" x2="180" y2="115" />
            <line x1="20" y1="135" x2="180" y2="135" />
            <line x1="20" y1="150" x2="180" y2="150" />
            {/* Pyramid brick vertical offsets */}
            <line x1="100" y1="20" x2="100" y2="55" />
            <line x1="85" y1="55" x2="85" y2="75" />
            <line x1="115" y1="55" x2="115" y2="75" />
            <line x1="70" y1="75" x2="70" y2="95" />
            <line x1="130" y1="75" x2="130" y2="95" />
            <line x1="60" y1="135" x2="60" y2="150" />
            <line x1="140" y1="135" x2="140" y2="150" />
          </g>

          {/* 4. THE ALL-SEEING EYE (Golden Almond Eye Silhouette) */}
          <g filter="url(#godseye-divine-glow)">
            {/* Outer Almond Eye Contour */}
            <path
              d="M 44 112 Q 100 68 156 112 Q 100 156 44 112 Z"
              fill="#060A12"
              stroke="url(#godseye-gold-edge)"
              strokeWidth="3"
              strokeLinejoin="round"
            />

            {/* Inner Golden Sclera Rim */}
            <path
              d="M 52 112 Q 100 76 148 112 Q 100 148 52 112 Z"
              fill="none"
              stroke="#FBBF24"
              strokeWidth="1"
              strokeOpacity="0.75"
            />

            {/* Golden Iris Ring */}
            <circle
              cx="100"
              cy="112"
              r="24"
              fill="url(#godseye-iris-gold)"
              stroke="#FFF2B2"
              strokeWidth="1.5"
            />

            {/* Radiant Iris Striations */}
            <g stroke="#78350F" strokeWidth="0.9" strokeOpacity="0.7">
              {[0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300, 320, 340].map((deg) => {
                const rad = (deg * Math.PI) / 180;
                const x1 = 100 + Math.cos(rad) * 12;
                const y1 = 112 + Math.sin(rad) * 12;
                const x2 = 100 + Math.cos(rad) * 23;
                const y2 = 112 + Math.sin(rad) * 23;
                return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} />;
              })}
            </g>

            {/* Inner Dark Pupil */}
            <circle
              cx="100"
              cy="112"
              r="12"
              fill="url(#godseye-pupil-depth)"
              stroke="#F59E0B"
              strokeWidth="1"
              className={mode === 'thinking' || mode === 'generating' ? 'animate-pulse' : ''}
            />

            {/* Specular White Light Reflection Point (At 1 o'clock position as in Reference Image 1) */}
            <circle cx="106" cy="106" r="4.2" fill="#FFFFFF" opacity="0.95" />
            <circle cx="95" cy="116" r="1.5" fill="#FEF08A" opacity="0.7" />
          </g>

          {/* 5. DYNAMIC LASER SCANNING BEAM (Active in scanning / generating) */}
          {(mode === 'scanning' || mode === 'generating') && (
            <g>
              <rect
                x="40"
                y="70"
                width="120"
                height="80"
                fill="url(#godseye-scan-beam)"
                clipPath="url(#godseye-pyramid-clip)"
                className="animate-pulse"
              />
              <line
                x1="45"
                y1="112"
                x2="155"
                y2="112"
                stroke="#67E8F9"
                strokeWidth="2"
                strokeOpacity="0.9"
                className="animate-ping"
              />
            </g>
          )}

          {/* 6. CORNER ACCENT LIGHTS (Electric Cyan-Blue Flare at lower corners) */}
          <circle cx="20" cy="165" r="3" fill="#38BDF8" opacity="0.8" />
          <circle cx="180" cy="165" r="3" fill="#38BDF8" opacity="0.8" />
          <circle cx="100" cy="20" r="3.5" fill="#FEF08A" opacity="0.9" />
        </svg>
      </div>

      {/* Typography Brand Label (Matching Official Reference 1 & 2) */}
      {showText && (
        <div className="flex flex-col select-none">
          <div className="flex items-baseline gap-2">
            {/* "GOD'S" in Radiant Burnished Gold */}
            <span
              className={`font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 font-heading ${currentSize.text}`}
              style={{
                textShadow: '0 0 20px rgba(245, 158, 11, 0.4)',
                letterSpacing: '0.06em',
              }}
            >
              GOD'S
            </span>

            {/* "EYE" in Chiseled Platinum-Silver with Electric Blue rim */}
            <span
              className={`font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-sky-200 to-slate-300 font-heading ${currentSize.text}`}
              style={{
                textShadow: '0 0 15px rgba(56, 189, 248, 0.3)',
                letterSpacing: '0.06em',
              }}
            >
              EYE
            </span>

            {/* "V2.0" in Gold Pill */}
            <span className="font-mono font-bold text-[10px] sm:text-xs text-amber-300 bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-600/50 shadow-sm shadow-amber-500/20">
              V2.0
            </span>
          </div>

          {/* Studio Subtext */}
          {subtext ? (
            <span className={`font-mono uppercase text-slate-400 tracking-wider mt-0.5 ${currentSize.sub}`}>
              {subtext}
            </span>
          ) : (
            <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
              AI CREATOR STUDIO
            </span>
          )}
        </div>
      )}
    </div>
  );
};
