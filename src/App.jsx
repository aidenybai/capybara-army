import { useState, useEffect, useRef, useMemo, startTransition } from 'react';

export default function App() {
  const [coords, setCoords] = useState([]);
  return (
    <div
      style={{
        width: '100%',
        overflow: 'hidden',
        height: '100%',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
        onClick={(event) => {
          startTransition(() => {
            setCoords((prevCoords) => [
              ...prevCoords,
              {
                x: event.clientX,
                y: event.clientY,
              },
            ]);
          });
        }}
      >
        {coords.map((coord) => (
          <Capybara coord={{ x: coord.x, y: coord.y }} />
        ))}
      </div>
      <div
        style={{
          width: '100%',
          height: '100%',
          color: 'lightslategray',
          fontFamily: 'monospace',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          pointerEvents: 'none',
          overflow: 'hidden',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      >
        click anywhere to spawn
        <br />
        <small>zoom in/out to see more</small>
      </div>
    </div>
  );
}

export const Capybara = ({ coord }) => {
  const { x, y } = coord;
  const hue = useMemo(() => Math.random() * 360, []);
  const rotation = useMemo(() => Math.random() * 360, []);
  const size = 100;

  const imgRef = useRef(null);
  const positionRef = useRef({ x, y });
  const velocityRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Randomize speed and direction based on rotation
    const angleRad = (rotation * Math.PI) / 180;
    const speed = Math.random() * 5 + 1; // Random speed between 1 and 6
    velocityRef.current = {
      x: Math.cos(angleRad) * speed,
      y: Math.sin(angleRad) * speed,
    };

    let animationFrameId;

    const animate = () => {
      positionRef.current.x += velocityRef.current.x;
      positionRef.current.y += velocityRef.current.y;

      if (imgRef.current) {
        imgRef.current.style.transform = `translate(${
          positionRef.current.x - size / 2
        }px, ${positionRef.current.y - size / 2}px) rotate(${rotation}deg)`;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
      ref={imgRef}
    >
      <img
        src="./capy.gif"
        style={{
          pointerEvents: 'none',
          width: size,
          height: size,
          filter: `hue-rotate(${hue}deg)`,
          userSelect: 'none',
          willChange: 'transform',
        }}
      />
      <small
        style={{
          fontSize: '0.5rem',
          fontFamily: 'monospace',
          color: 'lightslategray',
        }}
      >
        ({x}, {y})
      </small>
    </div>
  );
};
