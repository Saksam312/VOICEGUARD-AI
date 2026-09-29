export class AudioStreamer {
  private mediaStream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private processor: ScriptProcessorNode | null = null;
  private socket: WebSocket | null = null;
  private isStreaming: boolean = false;
  private onDataCallback: ((data: any) => void) | null = null;

  async startStream(callId: string, onData: (data: any) => void) {
    this.onDataCallback = onData;
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${wsProtocol}//${window.location.host}/ws/live-call/${callId}`;

    this.socket = new WebSocket(wsUrl);

    this.socket.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (this.onDataCallback) this.onDataCallback(payload);
      } catch (err) {
        console.error('WebSocket JSON parse error:', err);
      }
    };

    this.socket.onopen = async () => {
      this.isStreaming = true;
      try {
        this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        const source = this.audioContext.createMediaStreamSource(this.mediaStream);

        this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);
        source.connect(this.processor);
        this.processor.connect(this.audioContext.destination);

        this.processor.onaudioprocess = (e) => {
          if (!this.isStreaming || !this.socket || this.socket.readyState !== WebSocket.OPEN) return;

          const inputData = e.inputBuffer.getChannelData(0);
          // Convert Float32Array to 16-bit PCM ArrayBuffer
          const pcm16 = new Int16Array(inputData.length);
          for (let i = 0; i < inputData.length; i++) {
            const s = Math.max(-1, Math.min(1, inputData[i]));
            pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
          }

          // Convert PCM ArrayBuffer to Base64
          const bytes = new Uint8Array(pcm16.buffer);
          let binary = '';
          for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          const base64Audio = btoa(binary);

          this.socket.send(JSON.stringify({ audio_base64: base64Audio }));
        };
      } catch (err) {
        console.error('Microphone access denied:', err);
      }
    };
  }

  stopStream() {
    this.isStreaming = false;
    if (this.processor) this.processor.disconnect();
    if (this.audioContext) this.audioContext.close();
    if (this.mediaStream) this.mediaStream.getTracks().forEach(track => track.stop());
    if (this.socket) this.socket.close();
  }
}
