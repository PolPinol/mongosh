import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);
const { expect } = chai;

import ShellEvaluator from './shell-evaluator';
import { EventEmitter } from 'events';

describe('ShellEvaluator', () => {
  let shellEvaluator: ShellEvaluator;
  let serviceProviderMock;
  let containerMock;
  let busMock;

  beforeEach(() => {
    serviceProviderMock = {} as any;
    busMock = new EventEmitter();
    containerMock = { toggleTelemetry: sinon.spy() };

    shellEvaluator = new ShellEvaluator(
      serviceProviderMock,
      busMock,
      containerMock
    );
  });

  describe('setCtx', () => {
    let ctx;

    beforeEach(() => {
      ctx = {};
      shellEvaluator.setCtx(ctx);
    });

    it('sets shell api globals', () => {
      expect(ctx).to.include.all.keys('it', 'help', 'show', 'use');
    });

    it('sets db', () => {
      expect(ctx.db.constructor.name).to.equal('Database');
    });

    it('sets the object as context for the mapper', () => {
      expect((shellEvaluator as any).mapper.context).to.equal(ctx);
    });
  });
});
