import { spawn } from "child_process";
import { EventEmitter } from "events";
import Settings from "./Settings";

export default class GethManager extends EventEmitter {

  private _networkId: number;   // 1=Frontier, 2=Morden (disused), 3=Ropsten, 4=Rinkeby
  private _syncmode: string;    // --syncmode fast, --syncmode full, --syncmode light
  private _whisper: string;     // --shh, ''
  private _v5disc: string;      // --v5disc, ''

  private _proc;

  constructor(private binPath: string, private settings: Settings) {
    super();

    this._proc = null;

    this.setFoundationNetwork();
    this.setSyncmodeFast();
    this.onWhisper();
    this.onV5Discovery();
  }

  start() {
    let args: Array<string>;

    switch(this._networkId) {
      case 4: 
        args = [
          // '--rinkeby',
          '--syncmode',
          this._syncmode,
          '--ipcpath',
          this.settings.ipcPath(),
          this._whisper,
          this._v5disc,
        ];
        break;

      case 3: 
        args = [
          // '--testnet',
          '--syncmode',
          this._syncmode,
          '--ipcpath',
          this.settings.ipcPath(),
          this._whisper,
          this._v5disc,
        ];
        break;

      case 1: 
        args = [
          '--syncmode',
          this._syncmode,
          '--ipcpath',
          this.settings.ipcPath(),
          this._whisper,
          this._v5disc,
        ];
        break;
    }

    this._proc = spawn(this.binPath, args);
  }

  stop() {
    this._proc.kill('SIGKILL');
  }

  /// Network flag
  setFoundationNetwork() {
    this.networkId = 1;
  }

  setTestNetwork() {
    this.networkId = 3;
  }

  setRinkebyNetwork() {
    this.networkId = 4;
  }

  set networkId(code: number) {
    this._networkId = code;
  }

  get networkId() {
    return this._networkId;
  }

  /// Syncmode flag
  setSyncmodeFull() {
    this.syncmode = 'full';
  }

  setSyncmodeFast() {
    this.syncmode = 'fast';
  }

  setSyncmodeLight() {
    this.syncmode = 'light';
  }

  set syncmode(mode: string) {
    this._syncmode = mode;
  }

  get syncmode() {
    return this._syncmode;
  }

  /// Whisper flag
  onWhisper() {
    this._whisper = '--shh';
  }

  offWhisper() {
    this._whisper = '';
  }

  getWhisperState() {
    return this._whisper;
  }

  /// RLP v5 Discovery flag
  onV5Discovery() {
    this._v5disc = '--v5disc';
  }

  offV5Discovery() {
    this._v5disc = '';
  }

  getV5DiscoveryState() {
    return this._v5disc;
  }
}