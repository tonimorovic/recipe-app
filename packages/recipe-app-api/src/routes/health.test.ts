import { expect } from 'chai';
import server from '../test/server';

describe('Health', () => {
  it('should return server status', async () => {
    const res = await server.get('/health');
    expect(res.status).to.equal(200);
    expect(res.body.version).not.to.be.null;
    expect(res.body.environmentVariableSetting).not.to.be.null;
  });
});
