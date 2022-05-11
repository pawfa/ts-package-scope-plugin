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
  projectName: string;
  filePath = "";

  constructor(projectName: string, options?: { logs: boolean }) {
    this.projectName = projectName;
    const tsServerPath = path.join(require.resolve("typescript"), "..", "tsserver.js");
    const tsServerParams = ["--pluginProbeLocations", path.join(__dirname, "..")];

    options?.logs && tsServerParams.push("--logFile", path.join(__dirname, projectName + "logs.txt"));

    this.proc = child_process.fork(tsServerPath, tsServerParams, {
      stdio: ["pipe", "pipe", "pipe", "ipc"],
      cwd: path.join(__dirname, "..", "cases", this.projectName),
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

  async openFile(paths: string[]) {
    this.filePath = path.join(__dirname, "..", "cases", this.projectName, ...paths);
    await this.sendCommand({
      command: "open",
      arguments: {
        file: this.filePath,
      },
    });
    return this;
  }

  async sendCommand(command: Command) {
    return new Promise<void>((resolve, reject) => {
      const req = JSON.stringify(Object.assign({ seq: TSServerFixture.seq++, type: "request" }, command)) + "\n";
      this.proc.stdin?.write(req, (error) => {
        error ? reject(error) : resolve();
      });
    });
  }

  async sendSemanticDiagnosticsCommand() {
    await this.sendCommand({
      command: "semanticDiagnosticsSync",
      arguments: {
        file: this.filePath,
      },
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
