import { Test } from '@nestjs/testing';
import * as jwt from 'jsonwebtoken';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { JwtService } from './jwt.service';

jest.mock('jsonwebtoken', () => {
  return {
    sign: jest.fn(() => 'TOKEN'),
    verify: jest.fn(() => ({ id: 1 })),
  };
});

const TEST_KEY = 'privateKey';

describe('JwtService', () => {
  let service: JwtService;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        JwtService,
        {
          provide: CONFIG_OPTIONS,
          useValue: { privateKey: TEST_KEY },
        },
      ],
    }).compile();
    service = module.get<JwtService>(JwtService);
  });
  it('be defined', async () => {
    expect(service).toBeDefined();
  });
  describe('sign', () => {
    it('should return token', () => {
      const token = service.sign(1);
      expect(typeof token).toBe('string');
      expect(jwt.sign).toBeCalledTimes(1);
      expect(jwt.sign).toBeCalledWith({ id: 1 }, TEST_KEY);
    });
  });
  describe('verify', () => {
    it('should verify a token', () => {
        const decodedToken = service.verify('TOKEN')
        expect(decodedToken).toEqual({ id: 1 })
        expect(jwt.verify).toBeCalledTimes(1)
        expect(jwt.verify).toBeCalledWith('TOKEN', TEST_KEY)
    });
  });
});
