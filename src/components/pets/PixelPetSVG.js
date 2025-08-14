// Export the full 8-bit pixel pet SVG sprite content as a string.
// This content includes CSS animations that are supported when rendered via WebView.

const pixelPetSVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1" aria-hidden="true">
  <title>8-bit Pet Sprite Sheet</title>
  <style>
    :root{
      --fur:#F6D9B3; --fur-spot:#EBC49A; --fur-dark:#C89D6C;
      --belly:#FFEED8; --nose:#333; --eye:#111;
      --collar:#4F7BFF; --heart:#FF4D6D;
    }
    /* crisp pixels when scaled */
    .pxart *{ shape-rendering:crispEdges; }

    /* pixel animations */
    .pblink{ animation:pblink 5s infinite; }
    @keyframes pblink{ 0%,96%,100%{opacity:0} 97%,99%{opacity:1} }
    .ppulse{ animation:ppulse 1.6s ease-in-out infinite; transform-origin:center; transform-box:fill-box; }
    @keyframes ppulse{ 0%,100%{transform:scale(1)} 50%{transform:scale(1.15)} }
    .pwag{ animation:pwag 1.1s ease-in-out infinite; transform-box:fill-box; }
    @keyframes pwag{ 0%,100%{transform:rotate(6deg)} 50%{transform:rotate(-6deg)} }

    /* facial states (apply on the outer <svg> that wraps <use>) */
    .face{ display:none }
    .state-happy .face-happy{ display:block }
    .state-sad   .face-sad  { display:block }
    .state-tired .face-tired{ display:block }
    /* default if no state set */
    .face-default{ display:block }
  </style>

  <defs>
    <!-- 1x1 pixel block -->
    <symbol id="px" viewBox="0 0 1 1"><rect width="1" height="1"/></symbol>

    <!-- ========== DOG (pup8) ========== -->
    <symbol id="pup8" viewBox="0 0 16 16">
      <g class="pxart">
        <!-- head -->
        <use href="#px" x="4" y="3" width="8" height="6" fill="var(--fur)"/>
        <!-- ears -->
        <use href="#px" x="3" y="2" fill="var(--fur-spot)"/>
        <use href="#px" x="12" y="2" fill="var(--fur-spot)"/>
        <!-- face spot -->
        <use href="#px" x="5" y="4" width="2" height="2" fill="var(--fur-spot)"/>

        <!-- eyes base -->
        <use href="#px" x="6" y="5" fill="var(--eye)"/>
        <use href="#px" x="9" y="5" fill="var(--eye)"/>
        <!-- blink lids -->
        <g class="pblink">
          <use href="#px" x="6" y="5" fill="var(--fur)"/>
          <use href="#px" x="9" y="5" fill="var(--fur)"/>
        </g>

        <!-- mouths by state -->
        <g class="face face-default face-happy">
          <use href="#px" x="7" y="7" width="3" height="1" fill="var(--nose)"/>
        </g>
        <g class="face face-sad">
          <use href="#px" x="7" y="7" fill="var(--nose)"/>
          <use href="#px" x="9" y="8" fill="var(--nose)"/>
        </g>
        <g class="face face-tired">
          <use href="#px" x="6" y="6" fill="var(--fur)"/>
          <use href="#px" x="9" y="6" fill="var(--fur)"/>
          <use href="#px" x="7" y="7" width="3" height="1" fill="var(--nose)"/>
        </g>

        <!-- collar -->
        <use href="#px" x="4" y="9" width="8" height="1" fill="var(--collar)"/>

        <!-- body + belly -->
        <use href="#px" x="5" y="10" width="6" height="4" fill="var(--fur)"/>
        <use href="#px" x="6" y="11" width="4" height="2" fill="var(--belly)"/>

        <!-- tail (wag) -->
        <g class="pwag" style="transform-origin:12px 11px;">
          <use href="#px" x="12" y="11" fill="var(--fur-spot)"/>
        </g>

        <!-- heart tag (pulse) -->
        <g class="ppulse">
          <use href="#px" x="8" y="10" fill="var(--heart)"/>
        </g>
      </g>
    </symbol>

    <!-- ========== CAT (cat8) ========== -->
    <symbol id="cat8" viewBox="0 0 16 16">
      <g class="pxart">
        <!-- head -->
        <use href="#px" x="4" y="3" width="8" height="6" fill="var(--fur)"/>
        <!-- ears -->
        <use href="#px" x="5" y="1" fill="var(--fur)"/>
        <use href="#px" x="10" y="1" fill="var(--fur)"/>
        <use href="#px" x="5" y="2" fill="#FAD3D3"/>
        <use href="#px" x="10" y="2" fill="#FAD3D3"/>

        <!-- eyes -->
        <use href="#px" x="6" y="5" fill="var(--eye)"/>
        <use href="#px" x="9" y="5" fill="var(--eye)"/>
        <g class="pblink">
          <use href="#px" x="6" y="5" fill="var(--fur)"/>
          <use href="#px" x="9" y="5" fill="var(--fur)"/>
        </g>

        <!-- mouths by state -->
        <g class="face face-default face-happy">
          <use href="#px" x="7" y="7" width="3" height="1" fill="var(--nose)"/>
        </g>
        <g class="face face-sad">
          <use href="#px" x="7" y="7" fill="var(--nose)"/>
          <use href="#px" x="9" y="8" fill="var(--nose)"/>
        </g>
        <g class="face face-tired">
          <use href="#px" x="6" y="6" fill="var(--fur)"/>
          <use href="#px" x="9" y="6" fill="var(--fur)"/>
          <use href="#px" x="7" y="7" width="3" height="1" fill="var(--nose)"/>
        </g>

        <!-- whiskers -->
        <use href="#px" x="3" y="6" width="2" height="1" fill="var(--fur-dark)"/>
        <use href="#px" x="11" y="6" width="2" height="1" fill="var(--fur-dark)"/>

        <!-- collar -->
        <use href="#px" x="4" y="9" width="8" height="1" fill="var(--collar)"/>

        <!-- body + belly -->
        <use href="#px" x="5" y="10" width="6" height="4" fill="var(--fur)"/>
        <use href="#px" x="6" y="11" width="4" height="2" fill="var(--belly)"/>

        <!-- tail (wag/curve) -->
        <g class="pwag" style="transform-origin:12px 10px;">
          <use href="#px" x="12" y="11" fill="var(--fur-spot)"/>
          <use href="#px" x="12" y="10" fill="var(--fur-spot)"/>
        </g>

        <!-- heart -->
        <g class="ppulse"><use href="#px" x="8" y="10" fill="var(--heart)"/></g>
      </g>
    </symbol>

    <!-- ========== BUNNY (bunny8) ========== -->
    <symbol id="bunny8" viewBox="0 0 16 16">
      <g class="pxart">
        <!-- ears -->
        <use href="#px" x="6" y="1" width="1" height="3" fill="var(--fur)"/>
        <use href="#px" x="9" y="1" width="1" height="3" fill="var(--fur)"/>
        <use href="#px" x="6" y="1" width="1" height="2" fill="#FAD3D3"/>
        <use href="#px" x="9" y="1" width="1" height="2" fill="#FAD3D3"/>

        <!-- head -->
        <use href="#px" x="4" y="4" width="8" height="5" fill="var(--fur)"/>

        <!-- eyes -->
        <use href="#px" x="6" y="5" fill="var(--eye)"/>
        <use href="#px" x="9" y="5" fill="var(--eye)"/>
        <g class="pblink">
          <use href="#px" x="6" y="5" fill="var(--fur)"/>
          <use href="#px" x="9" y="5" fill="var(--fur)"/>
        </g>

        <!-- nose/teeth by state -->
        <g class="face face-default face-happy">
          <use href="#px" x="8" y="6" fill="var(--nose)"/>
          <use href="#px" x="8" y="7" width="1" height="1" fill="#fff"/>
        </g>
        <g class="face face-sad">
          <use href="#px" x="8" y="6" fill="var(--nose)"/>
          <use href="#px" x="7" y="7" fill="var(--nose)"/>
        </g>
        <g class="face face-tired">
          <use href="#px" x="6" y="6" fill="var(--fur)"/>
          <use href="#px" x="9" y="6" fill="var(--fur)"/>
          <use href="#px" x="8" y="6" fill="var(--nose)"/>
        </g>

        <!-- collar -->
        <use href="#px" x="4" y="9" width="8" height="1" fill="var(--collar)"/>

        <!-- body + belly -->
        <use href="#px" x="5" y="10" width="6" height="4" fill="var(--fur)"/>
        <use href="#px" x="6" y="11" width="4" height="2" fill="var(--belly)"/>

        <!-- puff tail (wag) -->
        <g class="pwag" style="transform-origin:12px 12px;">
          <use href="#px" x="12" y="12" fill="#FFF6FA"/>
        </g>

        <!-- heart -->
        <g class="ppulse"><use href="#px" x="8" y="10" fill="var(--heart)"/></g>
      </g>
    </symbol>

    <!-- ========== AXOLOTL (axolotl8) ========== -->
    <symbol id="axolotl8" viewBox="0 0 16 16">
      <g class="pxart">
        <!-- gill frills -->
        <use href="#px" x="3" y="5" fill="#E6A4B6"/>
        <use href="#px" x="3" y="7" fill="#E6A4B6"/>
        <use href="#px" x="12" y="5" fill="#E6A4B6"/>
        <use href="#px" x="12" y="7" fill="#E6A4B6"/>

        <!-- head -->
        <use href="#px" x="4" y="4" width="8" height="5" fill="var(--fur)"/>

        <!-- eyes -->
        <use href="#px" x="6" y="6" fill="var(--eye)"/>
        <use href="#px" x="9" y="6" fill="var(--eye)"/>
        <g class="pblink">
          <use href="#px" x="6" y="6" fill="var(--fur)"/>
          <use href="#px" x="9" y="6" fill="var(--fur)"/>
        </g>

        <!-- mouths by state -->
        <g class="face face-default face-happy">
          <use href="#px" x="7" y="7" width="3" height="1" fill="var(--nose)"/>
        </g>
        <g class="face face-sad">
          <use href="#px" x="7" y="7" fill="var(--nose)"/>
          <use href="#px" x="9" y="8" fill="var(--nose)"/>
        </g>
        <g class="face face-tired">
          <use href="#px" x="6" y="7" width="4" height="1" fill="var(--fur)"/>
          <use href="#px" x="7" y="8" width="2" height="1" fill="var(--nose)"/>
        </g>

        <!-- body + belly -->
        <use href="#px" x="5" y="10" width="6" height="4" fill="var(--fur)"/>
        <use href="#px" x="6" y="11" width="4" height="2" fill="var(--belly)"/>

        <!-- tail frill (wag) -->
        <g class="pwag" style="transform-origin:13px 11px;">
          <use href="#px" x="12" y="11" width="2" height="2" fill="#FDE7EF"/>
        </g>

        <!-- heart -->
        <g class="ppulse"><use href="#px" x="8" y="10" fill="var(--heart)"/></g>
      </g>
    </symbol>
  </defs>

  <!-- Nothing is drawn by default; use with <use>. -->
</svg>
`;

export default pixelPetSVG;


