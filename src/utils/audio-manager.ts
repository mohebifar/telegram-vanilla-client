class AudioManager {
  public audio: HTMLAudioElement;

  constructor() {
    this.audio = new Audio();
  }

  get src() {
    return this.audio.src;
  }

  set src(newSource: string) {
    this.audio.src = newSource;
  }
}

const audioManager = new AudioManager();

export default audioManager;
