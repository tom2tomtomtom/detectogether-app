import React, { useMemo } from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';

/**
 * Renders the provided mascot sprite-sheet SVG in a WebView so that
 * CSS-based animations (blink, wag, pulse, shadow filters) work as-authored.
 *
 * Props:
 * - species: 'pup' | 'cat' | 'bunny' | 'axolotl'
 * - size: number (px)
 * - cssVars: optional object to override CSS variables (e.g. { fur: '#fff' })
 */
export default function PetSpriteWebSvg({ species = 'pup', size = 160, cssVars = {} }) {
  const symbolId = species === 'cat' || species === 'bunny' || species === 'axolotl' ? species : 'pup';

  const cssVarString = useMemo(() => {
    const defaultVars = {
      fur: '#F6D9B3',
      'fur-spot': '#EBC49A',
      'fur-dark': '#C89D6C',
      belly: '#FFEED8',
      nose: '#333',
      eye: '#111',
      cheek: '#FF9BB0',
      collar: '#4F7BFF',
      heart: '#FF4D6D',
      metal: '#8BA3B8',
      bandage: '#F3C9C9',
      ...cssVars,
    };
    return Object.entries(defaultVars)
      .map(([k, v]) => `--${k}:${v}`)
      .join(';');
  }, [cssVars]);

  const html = useMemo(() => `<!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
    <style>
      html, body { margin:0; padding:0; background:transparent; }
      .container { width:100vw; height:100vh; display:flex; align-items:center; justify-content:center; }
      /* Ensure animations are smooth */
      svg { -webkit-transform: translateZ(0); transform: translateZ(0); }
    </style>
  </head>
  <body>
    <div class="container">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 320" aria-hidden="true" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
        <title>Pet Health Mascot Sprite Sheet</title>
        <style>
          :root{ ${cssVarString} }
          .blink { animation: blink 5.5s infinite; transform-origin:center; }
          @keyframes blink { 0%,4%,100%{transform:scaleY(0)} 2%,3%{transform:scaleY(1)} }
          .wag { animation: wag 1.2s ease-in-out infinite; transform-origin:250px 210px; }
          @keyframes wag { 0%,100%{transform:rotate(8deg)} 50%{transform:rotate(-8deg)} }
          .pulse { animation: pulse 1.8s ease-in-out infinite; transform-origin:center; }
          @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.12)} }
          .shadow { filter: drop-shadow(0 2px .5px rgba(0,0,0,.05)) drop-shadow(0 6px 12px rgba(0,0,0,.12)); }
        </style>

        <defs>
          <g id="collar-heart">
            <path d="M110 162 q50 18 100 0" stroke="var(--collar)" stroke-width="14" fill="none" stroke-linecap="round"/>
            <g class="pulse" transform="translate(160,175)">
              <path d="M0 9 c -8 -10 -22 -7 -22 5 c 0 10 9 17 22 27 c 13 -10 22 -17 22 -27 c 0 -12 -14 -15 -22 -5z"
                    fill="var(--heart)" stroke="#C12A45" stroke-width="2"/>
              <circle r="4.2" cy="-8.5" fill="var(--metal)"/>
            </g>
          </g>

          <g id="stethoscope">
            <g fill="none" stroke="var(--metal)" stroke-width="3">
              <path d="M140 170 q -18 20 -12 40 q 8 24 32 22 q 22 -2 28 -26 q 4 -18 -8 -36"/>
              <circle cx="188" cy="214" r="10" fill="var(--metal)"/>
              <circle cx="188" cy="214" r="6" fill="#E6EFF7" stroke="none"/>
              <circle cx="132" cy="164" r="3.5" fill="var(--metal)" stroke="none"/>
              <circle cx="188" cy="164" r="3.5" fill="var(--metal)" stroke="none"/>
            </g>
          </g>

          <g id="eyes-blink">
            <circle cx="135" cy="115" r="6.5" fill="var(--eye)"/>
            <circle cx="185" cy="115" r="6.5" fill="var(--eye)"/>
            <circle cx="133" cy="113" r="1.6" fill="#fff"/>
            <circle cx="183" cy="113" r="1.6" fill="#fff"/>
            <g class="blink">
              <rect x="126" y="107" width="18" height="14" rx="7" fill="var(--fur)" />
              <rect x="176" y="107" width="18" height="14" rx="7" fill="var(--fur)" />
            </g>
          </g>

          <symbol id="pup" viewBox="0 0 320 320">
            <g class="shadow">
              <g class="wag">
                <path d="M246 210 q 22 -10 34 8 q -10 28 -34 22 q 14 -10 6 -30 Z"
                      fill="var(--fur-spot)" stroke="var(--fur-dark)" stroke-width="2"/>
              </g>
              <ellipse cx="160" cy="215" rx="68" ry="58" fill="var(--fur)" stroke="var(--fur-dark)" stroke-width="2"/>
              <ellipse cx="160" cy="230" rx="44" ry="36" fill="var(--belly)"/>
              <ellipse cx="115" cy="238" rx="18" ry="14" fill="var(--fur)" stroke="var(--fur-dark)" stroke-width="2"/>
              <rect x="102" y="228" width="26" height="12" rx="4" fill="var(--bandage)"/>
              <path d="M106 232 l18 4 M106 236 l18 -4" stroke="#D88F8F" stroke-width="1.6" stroke-linecap="round"/>
              <g id="head-dog">
                <circle cx="160" cy="120" r="68" fill="var(--fur)" stroke="var(--fur-dark)" stroke-width="2"/>
                <path d="M110 80 q-18 -24 -40 -12 q 10 36 34 44 z" fill="var(--fur-spot)" stroke="var(--fur-dark)" stroke-width="2"/>
                <path d="M210 80 q18 -24 40 -12 q-10 36 -34 44 z" fill="var(--fur-spot)" stroke="var(--fur-dark)" stroke-width="2"/>
                <ellipse cx="136" cy="112" rx="26" ry="24" fill="var(--fur-spot)"/>
                <use href="#eyes-blink"/>
                <path d="M125 100 q10 -8 20 0" stroke="var(--fur-dark)" stroke-width="3" stroke-linecap="round" fill="none"/>
                <path d="M175 100 q10 -8 20 0" stroke="var(--fur-dark)" stroke-width="3" stroke-linecap="round" fill="none"/>
                <ellipse cx="160" cy="132" rx="8" ry="6" fill="var(--nose)"/>
                <path d="M160 138 q -8 10 -18 0" stroke="var(--nose)" stroke-width="2.5" fill="none" stroke-linecap="round"/>
                <path d="M160 138 q 8 10 18 0" stroke="var(--nose)" stroke-width="2.5" fill="none" stroke-linecap="round"/>
                <circle cx="120" cy="134" r="7" fill="var(--cheek)" opacity=".8"/>
                <circle cx="200" cy="134" r="7" fill="var(--cheek)" opacity=".8"/>
              </g>
              <use href="#collar-heart"/>
              <use href="#stethoscope"/>
              <ellipse cx="160" cy="278" rx="64" ry="10" fill="#000" opacity=".06"/>
            </g>
          </symbol>

          <symbol id="cat" viewBox="0 0 320 320">
            <g class="shadow">
              <g class="wag" transform="rotate(12 250 210)">
                <path d="M250 230
                         q 26 -6 26 -28
                         q 0 -30 -28 -36
                         q -22 -4 -28 14
                         q 18 -4 24 10
                         q 6 12 -6 22 z"
                      fill="var(--fur-spot)" stroke="var(--fur-dark)" stroke-width="2"/>
              </g>
              <ellipse cx="160" cy="215" rx="68" ry="58" fill="var(--fur)" stroke="var(--fur-dark)" stroke-width="2"/>
              <ellipse cx="160" cy="230" rx="44" ry="36" fill="var(--belly)"/>
              <g id="head-cat">
                <circle cx="160" cy="120" r="66" fill="var(--fur)" stroke="var(--fur-dark)" stroke-width="2"/>
                <path d="M116 72 L92 34 L88 82 Q102 88 116 72 Z" fill="var(--fur)" stroke="var(--fur-dark)" stroke-width="2"/>
                <path d="M204 72 L228 34 L232 82 Q218 88 204 72 Z" fill="var(--fur)" stroke="var(--fur-dark)" stroke-width="2"/>
                <path d="M108 64 L93 40 L95 72 Z" fill="#FAD3D3" opacity=".8"/>
                <path d="M212 64 L227 40 L225 72 Z" fill="#FAD3D3" opacity=".8"/>
                <g>
                  <ellipse cx="135" cy="115" rx="8" ry="6.2" fill="var(--eye)"/>
                  <ellipse cx="185" cy="115" rx="8" ry="6.2" fill="var(--eye)"/>
                  <g class="blink">
                    <rect x="126" y="107" width="18" height="14" rx="7" fill="var(--fur)" />
                    <rect x="176" y="107" width="18" height="14" rx="7" fill="var(--fur)" />
                  </g>
                </g>
                <polygon points="160,130 154,136 166,136" fill="var(--nose)"/>
                <path d="M154 138 q-10 8 -18 0 M166 138 q10 8 18 0" stroke="var(--nose)" stroke-width="2.5" fill="none" stroke-linecap="round"/>
                <g stroke="var(--fur-dark)" stroke-linecap="round">
                  <path d="M132 132 h22" stroke-width="1.6"/>
                  <path d="M130 138 h24" stroke-width="1.6"/>
                  <path d="M132 144 h22" stroke-width="1.6"/>
                  <path d="M166 132 h22" stroke-width="1.6"/>
                  <path d="M166 138 h24" stroke-width="1.6"/>
                  <path d="M166 144 h22" stroke-width="1.6"/>
                </g>
                <circle cx="120" cy="136" r="6.5" fill="var(--cheek)" opacity=".85"/>
                <circle cx="200" cy="136" r="6.5" fill="var(--cheek)" opacity=".85"/>
              </g>
              <use href="#collar-heart"/>
              <use href="#stethoscope"/>
              <ellipse cx="160" cy="278" rx="64" ry="10" fill="#000" opacity=".06"/>
            </g>
          </symbol>

          <symbol id="bunny" viewBox="0 0 320 320">
            <g class="shadow">
              <g class="wag">
                <circle cx="252" cy="214" r="14" fill="#FFF6FA" stroke="var(--fur-dark)" stroke-width="2"/>
              </g>
              <ellipse cx="160" cy="215" rx="68" ry="58" fill="var(--fur)" stroke="var(--fur-dark)" stroke-width="2"/>
              <ellipse cx="160" cy="230" rx="44" ry="36" fill="var(--belly)"/>
              <g id="head-bunny">
                <circle cx="160" cy="120" r="64" fill="var(--fur)" stroke="var(--fur-dark)" stroke-width="2"/>
                <path d="M125 58 q-24 -48 -8 -70 q 26 10 28 42 q2 22 -20 28 z" fill="var(--fur)" stroke="var(--fur-dark)" stroke-width="2"/>
                <path d="M195 58 q24 -48 8 -70 q -26 10 -28 42 q-2 22 20 28 z" fill="var(--fur)" stroke="var(--fur-dark)" stroke-width="2"/>
                <path d="M126 52 q-16 -36 -4 -50 q 16 12 16 34 q0 14 -12 16 z" fill="#FAD3D3" opacity=".7"/>
                <path d="M194 52 q16 -36 4 -50 q -16 12 -16 34 q0 14 12 16 z" fill="#FAD3D3" opacity=".7"/>
                <use href="#eyes-blink"/>
                <ellipse cx="160" cy="132" rx="7" ry="5.5" fill="var(--nose)"/>
                <path d="M160 136 v12 M160 148 q -8 8 -16 0 M160 148 q 8 8 16 0" stroke="var(--nose)" stroke-width="2.4" fill="none" stroke-linecap="round"/>
                <rect x="154" y="150" width="12" height="8" rx="2" fill="#fff" stroke="#E8E8E8"/>
                <circle cx="120" cy="138" r="6.5" fill="var(--cheek)" opacity=".85"/>
                <circle cx="200" cy="138" r="6.5" fill="var(--cheek)" opacity=".85"/>
              </g>
              <use href="#collar-heart"/>
              <use href="#stethoscope"/>
              <ellipse cx="160" cy="278" rx="64" ry="10" fill="#000" opacity=".06"/>
            </g>
          </symbol>

          <symbol id="axolotl" viewBox="0 0 320 320">
            <g class="shadow">
              <g class="wag">
                <path d="M244 206 q 42 -10 48 28 q -24 26 -60 6 q 18 -8 12 -34 z"
                      fill="#FDE7EF" stroke="#E6A4B6" stroke-width="2"/>
              </g>
              <ellipse cx="160" cy="215" rx="70" ry="54" fill="var(--fur)" stroke="var(--fur-dark)" stroke-width="2"/>
              <ellipse cx="160" cy="228" rx="46" ry="32" fill="var(--belly)"/>
              <g id="head-axolotl">
                <circle cx="160" cy="120" r="62" fill="var(--fur)" stroke="var(--fur-dark)" stroke-width="2"/>
                <g stroke="#E6A4B6" fill="#FDE7EF" stroke-width="2">
                  <path d="M110 110 q-34 -16 -44 -32 q 18 -4 40 10 q 12 8 12 22 z"/>
                  <path d="M112 132 q-34 16 -44 32 q 18 4 40 -10 q 12 -8 12 -22 z"/>
                  <path d="M210 110 q34 -16 44 -32 q-18 -4 -40 10 q-12 8 -12 22 z"/>
                  <path d="M208 132 q34 16 44 32 q-18 4 -40 -10 q-12 -8 -12 -22 z"/>
                </g>
                <circle cx="138" cy="118" r="6" fill="var(--eye)"/>
                <circle cx="182" cy="118" r="6" fill="var(--eye)"/>
                <g class="blink">
                  <rect x="130" y="110" width="16" height="14" rx="7" fill="var(--fur)" />
                  <rect x="174" y="110" width="16" height="14" rx="7" fill="var(--fur)" />
                </g>
                <path d="M140 138 q20 14 40 0" stroke="var(--nose)" stroke-width="2.6" fill="none" stroke-linecap="round"/>
                <circle cx="122" cy="134" r="6.5" fill="var(--cheek)" opacity=".85"/>
                <circle cx="198" cy="134" r="6.5" fill="var(--cheek)" opacity=".85"/>
              </g>
              <use href="#collar-heart"/>
              <g transform="translate(0,-6)"><use href="#stethoscope"/></g>
              <ellipse cx="160" cy="278" rx="64" ry="10" fill="#000" opacity=".06"/>
            </g>
          </symbol>
        </defs>

        <!-- Render a single selected symbol at full size -->
        <use href="#${symbolId}" x="0" y="0"/>
      </svg>
    </div>
  </body>
  </html>`, [cssVarString, symbolId]);

  return (
    <View style={{ width: size, height: size, overflow: 'hidden' }}>
      <WebView
        originWhitelist={["*"]}
        source={{ html }}
        style={{ backgroundColor: 'transparent' }}
        containerStyle={{ backgroundColor: 'transparent' }}
        androidHardwareAccelerationDisabled={false}
        javaScriptEnabled
        scalesPageToFit
      />
    </View>
  );
}



