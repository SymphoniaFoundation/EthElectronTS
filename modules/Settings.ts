import { app } from "electron";

/**
 * 설정에는 어떤 데이터들이 담겨야 할까?
 * Swarm 을 추가하는 체크 박스
 * Node 시작시에, 각각 LightClient 설정
 * cli Flag 체크 박스
 * 노드가 설치 되었는지 확인
 * 사용자 폴더
 */

export default class Settings {

  // Swarm Integration
  private _SwarmIntegration: boolean;

  constructor() {
    this._SwarmIntegration = false;
  }

  set setSwarmIntegration(state) {
    this._SwarmIntegration = state;
  }

  get getSwarmIntegrarion(): boolean {
    return this._SwarmIntegration;
  }

  get userDataPath() {
    return app.getPath('userData');
  }

  get appDataPath() {
    return app.getPath('appData');
  }

  get userHomePath() {
    return app.getPath('home');
  }

  public ipcPath() {
    let ipcPath = this.userHomePath;

    if (process.platform === 'darwin') {
      ipcPath += '/Library/Ethereum/geth.ipc';
    } else if ( process.platform === 'freebsd' || process.platform === 'linux' || process.platform === 'sunos') {
      ipcPath += '/.ethereum/geth.ipc';
    } else if (process.platform === 'win32') {
      ipcPath = '\\\\.\\pipe\\geth.ipc';
    }
    return ipcPath;
  }
}