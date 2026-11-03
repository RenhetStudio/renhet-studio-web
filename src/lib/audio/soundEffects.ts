/**
 * Procedural Audio Synthesis via Web Audio API.
 * Only triggers on click events with organic random micro-pitch variation.
 * Hover sounds and extra bells have been completely eliminated.
 */

class SoundSystem {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;
  private listeners: Set<(muted: boolean) => void> = new Set();
  private lastClickTime: number = 0;

  init(): void {
    if (typeof window === "undefined") return;

    const stored = localStorage.getItem("renhet_audio_muted");
    this.isMuted = stored === "true";

    const unlock = () => {
      this.ensureContext();
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };

    window.addEventListener("pointerdown", unlock, { once: true, passive: true });
    window.addEventListener("keydown", unlock, { once: true, passive: true });
  }

  private ensureContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  subscribe(callback: (muted: boolean) => void): () => void {
    this.listeners.add(callback);
    callback(this.isMuted);
    return () => this.listeners.delete(callback);
  }

  toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (typeof window !== "undefined") {
      localStorage.setItem("renhet_audio_muted", String(this.isMuted));
    }
    if (!this.isMuted) {
      this.ensureContext();
      this.playClick();
    }
    this.listeners.forEach((cb) => cb(this.isMuted));
    return this.isMuted;
  }

  /**
   * Randomized tactile click sound.
   * Pitch and decay duration vary slightly on every single click
   * to produce an organic, physical, non-repetitive micro-pop.
   */
  playClick(): void {
    if (this.isMuted) return;

    // Debounce rapid double-fires (e.g. pointerdown + click within 50ms)
    const nowMs = Date.now();
    if (nowMs - this.lastClickTime < 40) return;
    this.lastClickTime = nowMs;

    const ctx = this.ensureContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Pitch variation: randomized base around 480Hz ± 60Hz
      const randomFreq = 480 + (Math.random() - 0.5) * 120;
      // Duration variation: ~18ms to ~26ms
      const randomDuration = 0.018 + Math.random() * 0.008;
      // Gain variation: gentle cozy volume
      const randomGain = 0.038 + (Math.random() - 0.5) * 0.01;

      osc.type = "sine";
      osc.frequency.setValueAtTime(randomFreq, now);
      osc.frequency.exponentialRampToValueAtTime(randomFreq * 0.55, now + randomDuration);

      gain.gain.setValueAtTime(randomGain, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + randomDuration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + randomDuration + 0.005);
    } catch (err) {
      void err;
    }
  }

  /**
   * Aliases kept for compatibility, routing exclusively to randomized click.
   */
  playPop(): void {
    this.playClick();
  }

  playHover(): void {
    // Intentionally disabled: user requested no hover sounds.
  }

  playDing(): void {
    this.playClick();
  }
}

export const sound = new SoundSystem();
