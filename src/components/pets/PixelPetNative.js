import React, { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Rect, G } from 'react-native-svg';

const COLORS = {
  fur: '#F6D9B3',
  furSpot: '#EBC49A',
  furDark: '#C89D6C',
  belly: '#FFEED8',
  nose: '#333',
  eye: '#111',
  collar: '#4F7BFF',
  heart: '#FF4D6D',
};

function DogPixels({ mood }) {
  const isHappy = mood === 'happy' || mood === 'celebrating';
  const isSad = mood === 'sad';
  const isCritical = mood === 'critical';
  const isTired = mood === 'sleeping';

  return (
    <G>
      {/* head */}
      <Rect x={4} y={3} width={8} height={6} fill={COLORS.fur} />
      {/* ears */}
      <Rect x={3} y={2} width={1} height={1} fill={COLORS.furSpot} />
      <Rect x={12} y={2} width={1} height={1} fill={COLORS.furSpot} />
      {/* face spot */}
      <Rect x={5} y={4} width={2} height={2} fill={COLORS.furSpot} />

      {/* eyes */}
      {isTired ? (
        <>
          <Rect x={6} y={6} width={1} height={0.25} fill={COLORS.eye} />
          <Rect x={9} y={6} width={1} height={0.25} fill={COLORS.eye} />
        </>
      ) : isCritical ? (
        <>
          <Rect x={6} y={6} width={1} height={0.3} fill={COLORS.eye} />
          <Rect x={9} y={6} width={1} height={0.3} fill={COLORS.eye} />
        </>
      ) : isSad ? (
        <>
          <Rect x={6} y={6} width={1} height={1} fill={COLORS.eye} />
          <Rect x={9} y={6} width={1} height={1} fill={COLORS.eye} />
        </>
      ) : (
        <>
          <Rect x={6} y={5} width={1} height={1} fill={COLORS.eye} />
          <Rect x={9} y={5} width={1} height={1} fill={COLORS.eye} />
        </>
      )}

      {/* mouth/nose */}
      {isSad || isCritical ? (
        <>
          <Rect x={7} y={7} width={1} height={1} fill={COLORS.nose} />
          <Rect x={9} y={8} width={1} height={1} fill={COLORS.nose} />
        </>
      ) : (
        <Rect x={7} y={7} width={3} height={1} fill={COLORS.nose} />
      )}

      {/* collar */}
      <Rect x={4} y={9} width={8} height={1} fill={COLORS.collar} />

      {/* body + belly */}
      <Rect x={5} y={10} width={6} height={4} fill={COLORS.fur} />
      <Rect x={6} y={11} width={4} height={2} fill={COLORS.belly} />

      {/* tail */}
      <Rect x={12} y={11} width={1} height={1} fill={COLORS.furSpot} />

      {/* heart tag */}
      <Rect x={8} y={10} width={1} height={1} fill={COLORS.heart} />
    </G>
  );
}

function CatPixels({ mood }) {
  const isSad = mood === 'sad';
  const isCritical = mood === 'critical';
  const isTired = mood === 'sleeping';
  const eyeY = isSad ? 6 : 5;
  return (
    <G>
      {/* head */}
      <Rect x={4} y={3} width={8} height={6} fill={COLORS.fur} />
      {/* ears */}
      <Rect x={5} y={1} width={1} height={1} fill={COLORS.fur} />
      <Rect x={10} y={1} width={1} height={1} fill={COLORS.fur} />
      <Rect x={5} y={2} width={1} height={1} fill="#FAD3D3" />
      <Rect x={10} y={2} width={1} height={1} fill="#FAD3D3" />

      {/* eyes */}
      {isTired || isCritical ? (
        <>
          <Rect x={6} y={6} width={1} height={0.25} fill={COLORS.eye} />
          <Rect x={9} y={6} width={1} height={0.25} fill={COLORS.eye} />
        </>
      ) : (
        <>
          <Rect x={6} y={eyeY} width={1} height={1} fill={COLORS.eye} />
          <Rect x={9} y={eyeY} width={1} height={1} fill={COLORS.eye} />
        </>
      )}

      {/* mouth */}
      {isSad || isCritical ? (
        <>
          <Rect x={7} y={7} width={1} height={1} fill={COLORS.nose} />
          <Rect x={9} y={8} width={1} height={1} fill={COLORS.nose} />
        </>
      ) : (
        <Rect x={7} y={7} width={3} height={1} fill={COLORS.nose} />
      )}

      {/* whiskers */}
      <Rect x={3} y={6} width={2} height={1} fill={COLORS.furDark} />
      <Rect x={11} y={6} width={2} height={1} fill={COLORS.furDark} />

      {/* collar */}
      <Rect x={4} y={9} width={8} height={1} fill={COLORS.collar} />

      {/* body + belly */}
      <Rect x={5} y={10} width={6} height={4} fill={COLORS.fur} />
      <Rect x={6} y={11} width={4} height={2} fill={COLORS.belly} />

      {/* tail */}
      <Rect x={12} y={11} width={1} height={1} fill={COLORS.furSpot} />
      <Rect x={12} y={10} width={1} height={1} fill={COLORS.furSpot} />

      {/* heart */}
      <Rect x={8} y={10} width={1} height={1} fill={COLORS.heart} />
    </G>
  );
}

function BunnyPixels({ mood }) {
  const isSad = mood === 'sad';
  const isCritical = mood === 'critical';
  const isTired = mood === 'sleeping';
  return (
    <G>
      {/* ears */}
      <Rect x={6} y={1} width={1} height={3} fill={COLORS.fur} />
      <Rect x={9} y={1} width={1} height={3} fill={COLORS.fur} />
      <Rect x={6} y={1} width={1} height={2} fill="#FAD3D3" />
      <Rect x={9} y={1} width={1} height={2} fill="#FAD3D3" />

      {/* head */}
      <Rect x={4} y={4} width={8} height={5} fill={COLORS.fur} />

      {/* eyes */}
      {isTired || isCritical ? (
        <>
          <Rect x={6} y={6} width={1} height={0.25} fill={COLORS.eye} />
          <Rect x={9} y={6} width={1} height={0.25} fill={COLORS.eye} />
        </>
      ) : (
        <>
          <Rect x={6} y={5} width={1} height={1} fill={COLORS.eye} />
          <Rect x={9} y={5} width={1} height={1} fill={COLORS.eye} />
        </>
      )}

      {/* nose/teeth */}
      {isSad || isCritical ? (
        <>
          <Rect x={8} y={6} width={1} height={1} fill={COLORS.nose} />
          <Rect x={7} y={7} width={1} height={1} fill={COLORS.nose} />
        </>
      ) : (
        <>
          <Rect x={8} y={6} width={1} height={1} fill={COLORS.nose} />
          <Rect x={8} y={7} width={1} height={1} fill="#fff" />
        </>
      )}

      {/* collar */}
      <Rect x={4} y={9} width={8} height={1} fill={COLORS.collar} />

      {/* body + belly */}
      <Rect x={5} y={10} width={6} height={4} fill={COLORS.fur} />
      <Rect x={6} y={11} width={4} height={2} fill={COLORS.belly} />

      {/* puff tail */}
      <Rect x={12} y={12} width={1} height={1} fill="#FFF6FA" />

      {/* heart */}
      <Rect x={8} y={10} width={1} height={1} fill={COLORS.heart} />
    </G>
  );
}

function AxolotlPixels({ mood }) {
  const isSad = mood === 'sad';
  const isCritical = mood === 'critical';
  const isTired = mood === 'sleeping';
  return (
    <G>
      {/* gill frills */}
      <Rect x={3} y={5} width={1} height={1} fill="#E6A4B6" />
      <Rect x={3} y={7} width={1} height={1} fill="#E6A4B6" />
      <Rect x={12} y={5} width={1} height={1} fill="#E6A4B6" />
      <Rect x={12} y={7} width={1} height={1} fill="#E6A4B6" />

      {/* head */}
      <Rect x={4} y={4} width={8} height={5} fill={COLORS.fur} />

      {/* eyes */}
      {isTired || isCritical ? (
        <>
          <Rect x={6} y={6} width={1} height={0.25} fill={COLORS.eye} />
          <Rect x={9} y={6} width={1} height={0.25} fill={COLORS.eye} />
        </>
      ) : (
        <>
          <Rect x={6} y={6} width={1} height={1} fill={COLORS.eye} />
          <Rect x={9} y={6} width={1} height={1} fill={COLORS.eye} />
        </>
      )}

      {/* mouth */}
      {isSad || isCritical ? (
        <>
          <Rect x={7} y={7} width={1} height={1} fill={COLORS.nose} />
          <Rect x={9} y={8} width={1} height={1} fill={COLORS.nose} />
        </>
      ) : (
        <Rect x={7} y={7} width={3} height={1} fill={COLORS.nose} />
      )}

      {/* body + belly */}
      <Rect x={5} y={10} width={6} height={4} fill={COLORS.fur} />
      <Rect x={6} y={11} width={4} height={2} fill={COLORS.belly} />

      {/* tail frill */}
      <Rect x={12} y={11} width={2} height={2} fill="#FDE7EF" />

      {/* heart */}
      <Rect x={8} y={10} width={1} height={1} fill={COLORS.heart} />
    </G>
  );
}

export default function PixelPetNative({ type = 'pup8', mood = 'normal', size = 150 }) {
  const content = useMemo(() => {
    switch (type) {
      case 'cat8':
        return <CatPixels mood={mood} />;
      case 'bunny8':
        return <BunnyPixels mood={mood} />;
      case 'axolotl8':
        return <AxolotlPixels mood={mood} />;
      case 'pup8':
      default:
        return <DogPixels mood={mood} />;
    }
  }, [type, mood]);

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 16 16" shapeRendering="crispEdges">
        {content}
      </Svg>
    </View>
  );
}


