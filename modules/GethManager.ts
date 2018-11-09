import { spawn } from "child_process";
import { EventEmitter } from "events";
import Settings from "./Settings";

export default class GethManager extends EventEmitter {

  private _networkId: number;   // 1=Frontier, 2=Morden (disused), 3=Ropsten, 4=Rinkeby
  private _syncmode: string;  // --syncmode fast, --syncmode full, --syncmode light
  private _whisper: string;

  private _proc;

  constructor(private binPath: string, private settings: Settings) {
    super();

    this._proc = null;

    this.setFoundationNetwork();
    this.setSyncmodeFast();
  }

  start() {
    let args: Array<string>;

    switch(this._networkId) {
      case 4: 
        args = [
          '--syncmode',
          this._syncmode,
          '--ipcpath',
          this.settings.ipcPath(),
          this._whisper,
        ];
        break;

      case 3: 
        args = [
          '--syncmode',
          this._syncmode,
          '--ipcpath',
          this.settings.ipcPath(),
          this._whisper,
        ];
        break;

      case 1: 
        args = [
          '--syncmode',
          this._syncmode,
          '--ipcpath',
          this.settings.ipcPath(),
          this._whisper,
        ];
        break;
    }

    this._proc = spawn(this.binPath, args);
  }

  stop() {
    this._proc.kill('SIGKILL');
  }

  /// Network
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

  /// Syncmode
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

  /// Whisper
  whisperOn() {
    this._whisper = '--shh';
  }

  whisperOff() {
    this._whisper = '';
  }

  getWhisper() {
    return this._whisper;
  }
}