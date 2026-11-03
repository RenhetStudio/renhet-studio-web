/**
 * Procedural Audio Synthesis via Web Audio API.
 * Ultra-lightweight (~0KB assets), zero network requests, whisper-soft cozy sound design.
 */

class SoundSystem {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;
  private isUnlocked: boolean = false;
  private listeners: Set<(muted: boolean) => void> = new Set();

  init(): void {
    if (typeof window === "undefined") return;

    const stored = localStorage.getItem("renhet_audio_muted");
    // User requested sound active from first click/interaction by default
    this.isMuted = stored === "true";

    const unlock = () => {
      this.ensureContext();
      this.isUnlocked = true;
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
      this.playPop(560);
    }
    this.listeners.forEach((cb) => cb(this.isMuted));
    return this.isMuted;
  }

  /**
   * Whisper-soft organic drop/pop (e.g. for card hover, badge tap)
   */
  playPop(freq = 520): void {
    if (this.isMuted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.5, now + 0.022);

      gain.gain.setValueAtTime(0.045, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.022);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.025);
    } catch (err) {
      void err;
    }
  }

  /**
   * Subtle micro-tick on hovering interactive elements
   */
  playHover(freq = 440): void {
    if (this.isMuted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.7, now + 0.015);

      gain.gain.setValueAtTime(0.025, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.015);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.018);
    } catch (err) {
      void err;
    }
  }

  /**
   * Pleasant soft bell for primary action clicks (e.g. Itch.io play button)
   */
  playDing(): void {
    if (this.isMuted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(660, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.06);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.13);
    } catch (err) {
      void err;
    }
  }
}

export const sound = new SoundSystem();
