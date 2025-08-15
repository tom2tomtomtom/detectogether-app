import { Audio } from 'expo-av';

class SoundService {
  constructor() {
    this.sounds = {};
    this.isEnabled = true;
    this.volume = 0.3; // 30% volume for subtle effects
  }

  // Initialize audio mode
  async initialize() {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
    } catch (error) {
      console.log('🔇 Error initializing audio:', error);
    }
  }

  // Play system beep sound for health events
  async playHealthDrop() {
    if (!this.isEnabled) return;
    
    try {
      // Create a simple low-frequency beep programmatically
      // Using Web Audio API for web, native for mobile
      if (typeof window !== 'undefined' && window.AudioContext) {
        // Web implementation
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 220; // Low A note for warning
        gainNode.gain.setValueAtTime(this.volume, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.3);
      } else {
        console.log('🔉 Health drop sound triggered (audio not available)');
      }
    } catch (error) {
      console.log('🔇 Error playing health drop sound:', error);
    }
  }

  async playHealthImprove() {
    if (!this.isEnabled) return;
    
    try {
      if (typeof window !== 'undefined' && window.AudioContext) {
        // Web implementation - ascending notes for positive feedback
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(330, audioContext.currentTime); // E note
        oscillator.frequency.linearRampToValueAtTime(440, audioContext.currentTime + 0.2); // A note
        gainNode.gain.setValueAtTime(this.volume, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.4);
      } else {
        console.log('🔉 Health improve sound triggered (audio not available)');
      }
    } catch (error) {
      console.log('🔇 Error playing health improve sound:', error);
    }
  }

  async playCriticalAlert() {
    if (!this.isEnabled) return;
    
    try {
      if (typeof window !== 'undefined' && window.AudioContext) {
        // Web implementation - urgent beeping pattern
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create 3 quick beeps
        for (let i = 0; i < 3; i++) {
          setTimeout(async () => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 880; // High A for urgency
            gainNode.gain.setValueAtTime(this.volume, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
            
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.15);
          }, i * 200);
        }
      } else {
        console.log('🔉 Critical alert sound triggered (audio not available)');
      }
    } catch (error) {
      console.log('🔇 Error playing critical alert sound:', error);
    }
  }

  // Enable/disable sounds
  setEnabled(enabled) {
    this.isEnabled = enabled;
  }

  // Set volume (0.0 to 1.0)
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
  }
}

// Export singleton instance
export default new SoundService();
