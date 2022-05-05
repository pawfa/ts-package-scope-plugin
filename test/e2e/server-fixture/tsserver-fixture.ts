import * as path from "path";
import * as child_process from "child_process";
import * as readline from "readline";

interface Command {
  command: string;
  arguments: {
    file: string;
  };
}

export class TSServerFixture {
  static seq = 0;

  proc;
  logs: { command: string; body: Array<{ text: string }> }[] = [];
  exitPromise;
  constructor() {
    const tsServerPath = path.join(require.resolve("typescript"), "..", "tsserver.js");
    this.proc = child_process.fork(tsServerPath, ["--pluginProbeLocations", path.join(__dirname, "..")], {
      stdio: ["pipe", "pipe", "pipe", "ipc"],
      cwd: path.join(__dirname, "..", "project-fixture"),
    });

    this.proc.stdout &&
      readline.createInterface({ input: this.proc.stdout })?.on("line", (line) => {
        if (line[0] !== "{") {
          return;
        }
        this.logs.push(JSON.parse(line));
      });

    this.exitPromise = new Promise<void>((resolve) => {
      this.proc.stdout?.on("exit", () => {
        resolve();
      });
      this.proc.stdout?.on("end", () => {
        resolve();
      });
    });
  }

  async sendCommand(command: Command) {
    return new Promise<void>((resolve, reject) => {
      const req = JSON.stringify(Object.assign({ seq: TSServerFixture.seq++, type: "request" }, command)) + "\n";
      this.proc.stdin?.write(req, (error) => {
        error ? reject(error) : resolve();
      });
    });
  }

  async close() {
    this.proc.stdin?.end();
    return this.exitPromise;
  }

  findResponse(command: string) {
    return this.logs.find((log) => log.command === command);
  }
}
