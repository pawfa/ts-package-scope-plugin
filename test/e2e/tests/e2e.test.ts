import { TSServerFixture } from '../server-fixture/tsserver-fixture';
import assert from 'assert';
import * as path from 'path';

describe('Errors', () => {
  it('should return package scope error when importing from other package', async () => {
    const server = new TSServerFixture()
    await server.sendCommand({ command: 'open', arguments: { file: path.join(__dirname, '..', 'project-fixture','package.core', 'domain.ts') } })
    await server.sendCommand({ command: 'semanticDiagnosticsSync', arguments: { file: path.join(__dirname, '..', 'project-fixture','package.core', 'domain.ts') } })

    await server.close()

    const diagnosticResponse = server.findResponse('semanticDiagnosticsSync')
    assert(diagnosticResponse);

    expect(diagnosticResponse.body[0].text).toEqual("Package scope is incorrect.")
  });
});
