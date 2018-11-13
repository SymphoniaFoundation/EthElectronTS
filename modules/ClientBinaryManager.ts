import { app } from 'electron';
import { EventEmitter } from 'events';
import * as path from 'path';
import * as fs from 'fs';

import { Manager } from 'ethereum-client-binaries';

import Settings from './Settings';

export default class ClientBinaryManager extends EventEmitter {

  // tslint:disable-next-line:max-line-length
  private ALLOWED_DOWNLOAD_URLS_REGEX = /^https:\/\/(?:(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)?ethereum\.org\/|gethstore\.blob\.core\.windows\.net\/|bintray\.com\/artifact\/download\/karalabe\/ethereum\/)(?:.+)/;
  // private BINARY_URL = 'https://raw.githubusercontent.com/symphoniafoundation/EthElectronTS/master/clientBinaries.json';

  private _clientConfig;
  private _platform;
  private _binaryVersion;
  private _binaryPath;

  public manager;
  public downloaded: boolean;

  /**
   * @param _binaryJsonPath JSON Path
   * @param _settings Setting Class
   */
  constructor(private _binaryJsonPath: string, private _settings: Settings) {
    super();
    this._readClientConfig();
    this._setPlatform();
    this._setBinaryVerstion();
  }

  private _readClientConfig() {
    try {
      this._clientConfig = JSON.parse(fs.readFileSync(this._binaryJsonPath).toString());
    } catch (err) {
      console.warn(err);
    }
  }

  private _setPlatform() {
    this._platform = process.platform
      .replace('darwin', 'mac')
      .replace('win32', 'win')
      .replace('freebsd', 'linux')
      .replace('sunos', 'linux');
  }

  private _setBinaryVerstion() {
    this._binaryVersion = this._clientConfig.clients['Geth'].platforms[this._platform][process.arch];
  }

  public async ManagerInit() {
    this.manager = new Manager(this._clientConfig);

    await this.manager.init({
      folders: [
        path.join(this._settings.userDataPath, 'binaries', 'Geth', 'unpacked')
      ]
    });

    return this.manager.clients;
  }

  /**
   * isDownloaded
   */
  public isDownloaded() {
    return this.manager.clients.Geth.state.available;
  }

  public async NodeDownload() {
    const result = await this.manager.download(this.manager.clients.Geth.id, {
      downloadFolder: path.join(this._settings.userDataPath, 'binaries'),
      urlRegex: this.ALLOWED_DOWNLOAD_URLS_REGEX,
    });
  }

  getBinaryPath() {
    if (this.isDownloaded() === true) {
      return this.manager.clients.Geth.activeCli.fullPath;
    }
    return ''
  }

  isInstalled() {
    return fs.existsSync(path.join(app.getPath('userData'), 'binaries', 'unpacked', 'geth'));
  }

}
