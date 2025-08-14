import React, { useMemo } from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';
import pixelPetSVG from './PixelPetSVG';

const moodToState = {
  normal: 'default',
  happy: 'happy',
  sad: 'sad',
  sleeping: 'tired',
  celebrating: 'happy',
  critical: 'sad',
};

export default function PixelPetWeb({ type = 'pup8', mood = 'normal', size = 150 }) {
  const stateClass = moodToState[mood] || 'default';

  const html = useMemo(() => `<!doctype html>
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      <style>
        html, body { margin:0; padding:0; background:transparent; }
        .container { width:100vw; height:100vh; display:flex; align-items:center; justify-content:center; }
        svg { image-rendering: pixelated; }
        .sprite { width:0; height:0; position:absolute; opacity:0; }
        .display { width:100%; height:100%; }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Inject sprite sheet once -->
        <div id="sprite" class="sprite">${pixelPetSVG}</div>
        <!-- Render selected pet using symbol from sprite (defs moved in via script) -->
        <svg id="display" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" preserveAspectRatio="xMidYMid meet" class="display state-${stateClass}">
          <use href="#${type}" x="0" y="0" width="16" height="16" />
        </svg>
      </div>
      <script>
        (function(){
          try {
            var spriteSvg = document.querySelector('#sprite svg');
            var display = document.getElementById('display');
            if (spriteSvg && display) {
              var style = spriteSvg.querySelector('style');
              var defs = spriteSvg.querySelector('defs');
              if (style) display.appendChild(style.cloneNode(true));
              if (defs) display.appendChild(defs.cloneNode(true));
            }
          } catch (e) {}
        })();
      </script>
    </body>
  </html>`, [stateClass, type]);

  return (
    <View style={{ width: size, height: size }}>
      <WebView
        originWhitelist={["*"]}
        source={{ html }}
        style={{ backgroundColor: 'transparent' }}
        containerStyle={{ backgroundColor: 'transparent' }}
        javaScriptEnabled
        scalesPageToFit
      />
    </View>
  );
}


