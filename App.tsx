import React, { useState, Suspense, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Loader } from '@react-three/drei';
import { TreeState } from './types';
import Experience from './components/Experience';
import Overlay from './components/Overlay';

const App: React.FC = () => {
  const [treeState, setTreeState] = useState<TreeState>(TreeState.TREE_SHAPE);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const dragStartRef = useRef<number>(0);

  // Cycle: Tree -> Text -> Tree
  const toggleState = () => {
    setTreeState((prev) => {
      if (prev === TreeState.TREE_SHAPE) return TreeState.TEXT_SHAPE;
      return TreeState.TREE_SHAPE;
    });

    // Ensure audio plays on interaction if autoplay failed
    if (audioRef.current && !isPlaying) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(e => console.log("Audio waiting for interaction"));
    }
  };

  useEffect(() => {
    // Attempt auto-play on mount
    const playAudio = async () => {
      if (audioRef.current) {
        audioRef.current.volume = 0.3;
        try {
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (err) {
          console.log("Autoplay blocked, waiting for interaction");
        }
      }
    };
    playAudio();
  }, []);

  const handlePointerDown = () => {
    dragStartRef.current = Date.now();
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    // Differentiate click from drag (threshold 200ms)
    if (Date.now() - dragStartRef.current < 200) {
      // Prevent toggling if clicking on buttons (handled by event propagation usually, but just in case)
      const target = e.target as HTMLElement;
      if (target.tagName !== 'BUTTON') {
        toggleState();
      }
    }
  };

  return (
    <div 
      className="relative w-full h-full bg-[#050b14]"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      {/* Background Audio - Merry Christmas Mr. Lawrence */}
      <audio 
        ref={audioRef} 
        loop 
        src="https://archive.org/download/MerryChristmasMrLawrence/RyuichiSakamoto-MerryChristmasMrLawrence.mp3" 
        crossOrigin="anonymous"
      />

      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 2, 22], fov: 45, near: 0.1, far: 200 }}
        gl={{ antialias: false, toneMappingExposure: 1.2 }}
        shadows
      >
        <Suspense fallback={null}>
          <Experience treeState={treeState} />
        </Suspense>
      </Canvas>
      
      <Loader 
        containerStyles={{ background: '#050b14' }}
        barStyles={{ background: '#A5D6A7' }}
        dataStyles={{ color: '#E0F7FA', fontFamily: 'sans-serif' }}
      />
      
      <Overlay treeState={treeState} onToggle={toggleState} />
    </div>
  );
};

export default App;