import { spawn } from "child_process";
import { EventEmitter } from "events";

export default class SwarmManager extends EventEmitter {

  constructor(private binPath: string) {
    super();
  }

  start() {

  }
}