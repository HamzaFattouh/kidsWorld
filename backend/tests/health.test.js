"use strict";var _supertest = _interopRequireDefault(require("supertest"));
var _app = _interopRequireDefault(require("../backend/app"));function _interopRequireDefault(e) {return e && e.__esModule ? e : { default: e };}

describe('Health Check API', () => {
  it('should return 200 and status UP', async () => {
    const res = await (0, _supertest.default)(_app.default).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('UP');
  });
});