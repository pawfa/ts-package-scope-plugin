import { TSServerFixture } from "../server-fixture/tsserver-fixture";
import assert from "assert";

describe("e2e", () => {
  it("should return package scope error when importing from other package", async () => {
    const server = await new TSServerFixture("project-fixture").openFile(["package.core", "domain.ts"]);

    await server.sendSemanticDiagnosticsCommand();

    await server.close();

    const diagnosticResponse = server.findResponse("semanticDiagnosticsSync");
    assert(diagnosticResponse);

    expect(diagnosticResponse.body[0].text).toEqual("The scope of this file is limited to its package only.");
  });

  it("should return package scope error when importing from other package and when package names option is set", async () => {
    const server = await new TSServerFixture("project-fixture-package-names-option").openFile(["core", "domain.ts"]);

    await server.sendSemanticDiagnosticsCommand();

    await server.close();

    const diagnosticResponse = server.findResponse("semanticDiagnosticsSync");
    assert(diagnosticResponse);

    expect(diagnosticResponse.body[0].text).toEqual("The scope of this file is limited to its package only.");
  });

  it("should return package scope error when importing from other package and when package names and include options are set", async () => {
    const server = await new TSServerFixture("project-fixture-include-option").openFile(["core", "domain.ts"]);

    await server.sendSemanticDiagnosticsCommand();

    await server.close();

    const diagnosticResponse = server.findResponse("semanticDiagnosticsSync");
    assert(diagnosticResponse);

    expect(diagnosticResponse.body[0].text).toEqual("The scope of this file is limited to its package only.");
  });
});
