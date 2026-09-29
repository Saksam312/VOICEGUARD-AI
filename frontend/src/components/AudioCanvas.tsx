import React, { useEffect, useRef } from 'react';

interface AudioCanvasProps {
  isLive?: boolean;
  snrDb?: number;
}

export const AudioCanvas: React.FC<AudioCanvasProps> = ({ isLive = false, snrDb = 28.5 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const height = canvas.height;

      // 1. Dark Cyber Background Grid
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = 'rgba(30, 41, 59, 0.6)';
      ctx.lineWidth = 1;
      const gridSize = 30;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. Multi-Band Spectrum Analyzer Bar Graph (Background Layer)
      const numBars = 32;
      const barWidth = width / numBars;
      for (let i = 0; i < numBars; i++) {
        const barHeight = isLive
          ? Math.sin(i * 0.4 + phase * 2) * 35 + Math.cos(i * 0.8 - phase) * 20 + 40
          : Math.sin(i * 0.3 + phase) * 15 + 20;

        const grad = ctx.createLinearGradient(0, height, 0, height - barHeight);
        grad.addColorStop(0, 'rgba(6, 182, 212, 0.05)');
        grad.addColorStop(0.5, 'rgba(16, 185, 129, 0.25)');
        grad.addColorStop(1, isLive ? 'rgba(244, 63, 94, 0.6)' : 'rgba(6, 182, 212, 0.5)');

        ctx.fillStyle = grad;
        ctx.fillRect(i * barWidth + 2, height - barHeight, barWidth - 4, barHeight);

        // Peak Dot
        ctx.fillStyle = isLive ? '#22d3ee' : '#10b981';
        ctx.fillRect(i * barWidth + 2, height - barHeight - 3, barWidth - 4, 2);
      }

      // 3. Dual Oscilloscope Waveform Line (Foreground Layer)
      ctx.shadowBlur = isLive ? 12 : 6;
      ctx.shadowColor = isLive ? '#06b6d4' : '#10b981';

      ctx.beginPath();
      ctx.strokeStyle = isLive ? '#22d3ee' : '#10b981';
      ctx.lineWidth = 2.5;

      const midY = height / 2;
      for (let x = 0; x < width; x += 2) {
        const freq1 = 0.025;
        const freq2 = 0.06;
        const amp = isLive ? 38 : 18;

        const y = midY + Math.sin(x * freq1 + phase * 1.5) * amp * Math.cos(x * freq2 - phase * 0.8);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0; // Reset glow shadow

      phase += 0.06;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isLive]);

  return (
    <div className="glass-panel p-4 space-y-2 relative overflow-hidden border-t-2 border-t-cyan-500">
      <div className="flex items-center justify-between font-mono text-xs text-slate-300">
        <span className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${isLive ? 'bg-cyan-400 animate-ping shadow-[0_0_10px_#22d3ee]' : 'bg-emerald-500'}`}></span>
          <span className="font-bold tracking-wider text-slate-100">REAL-TIME SPECTRAL & OSCILLOSCOPE AUDIO VISUALIZER</span>
        </span>
        <div className="flex items-center gap-3">
          <span>SAMPLING: <strong className="text-cyan-400">16.0 kHz</strong></span>
          <span>SNR: <strong className="text-emerald-400">{snrDb.toFixed(1)} dB</strong></span>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        width={800}
        height={130}
        className="w-full h-32 rounded-xl border border-slate-800 shadow-inner"
      />
    </div>
  );
};
