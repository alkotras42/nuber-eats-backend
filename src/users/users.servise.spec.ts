import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from 'src/jwt/jwt.service';
import { MailService } from 'src/mail/mail.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Verification } from './entities/verification.entity';
import { UsersService } from './user.service';

const mockRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  delete: jest.fn(),
});

const mockJwtServise = () => ({
  sign: jest.fn(() => 'signe-token'),
  verify: jest.fn(),
});

const mockMailService = () => ({
  sendVerificationEmail: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('UserService', () => {
  let service: UsersService;
  let usersRepository: MockRepository<User>;
  let verificationRepository: MockRepository<Verification>;
  let mailService: MailService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(Verification),
          useValue: mockRepository(),
        },
        {
          provide: JwtService,
          useValue: mockJwtServise(),
        },
        {
          provide: MailService,
          useValue: mockMailService(),
        },
      ],
    }).compile();
    service = module.get<UsersService>(UsersService);
    usersRepository = module.get(getRepositoryToken(User));
    verificationRepository = module.get(getRepositoryToken(Verification));
    mailService = module.get<MailService>(MailService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createAccount', () => {
    const createAccountArgs = {
      email: '',
      password: '',
      role: 0,
    };
    it('should fail if user exist', async () => {
      usersRepository.findOne.mockResolvedValue({
        id: 1,
        email: 'foo',
      });
      const result = await service.createAccount(createAccountArgs);
      expect(result).toEqual([
        false,
        'There is a user with that email already',
      ]);
    });

    it('should create a new user', async () => {
      usersRepository.findOne.mockResolvedValue(undefined);
      usersRepository.create.mockReturnValue(createAccountArgs);
      usersRepository.save.mockReturnValue(createAccountArgs);
      verificationRepository.create.mockReturnValue({
        user: createAccountArgs,
      });
      verificationRepository.save.mockResolvedValue({ code: 'code' });
      const result = await service.createAccount(createAccountArgs);
      expect(usersRepository.create).toHaveBeenCalledTimes(1);
      expect(usersRepository.create).toHaveBeenCalledWith(createAccountArgs);
      expect(usersRepository.save).toHaveBeenCalledTimes(1);
      expect(usersRepository.save).toHaveBeenCalledWith(createAccountArgs);
      expect(verificationRepository.create).toHaveBeenCalledTimes(1);
      expect(verificationRepository.create).toHaveBeenCalledWith({
        user: createAccountArgs,
      });
      expect(verificationRepository.save).toHaveBeenCalledTimes(1);
      expect(verificationRepository.save).toHaveBeenCalledWith({
        user: createAccountArgs,
      });
      expect(mailService.sendVerificationEmail).toHaveBeenCalledTimes(1);
      expect(mailService.sendVerificationEmail).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
      );
      expect(result).toEqual([true]);
    });

    it('should fail on exeption', async () => {
      usersRepository.findOne.mockRejectedValue(new Error('Error'));
      const result = await service.createAccount(createAccountArgs);

      expect(result).toEqual([false, "Couldn't create account "]);
    });
  });
  describe('Login', () => {
    const loginArgs = { email: '', password: '' };
    it('should fail if user does not exist', async () => {
      usersRepository.findOne.mockResolvedValue(null);

      const result = await service.Login(loginArgs);

      expect(usersRepository.findOne).toHaveBeenCalledTimes(1);
      expect(usersRepository.findOne).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(Object),
      );

      expect(result).toEqual([false, 'There is no user with this email']);
    });

    it('should fail if password is wrong', async () => {
      const mockedUser = {
        id: 1,
        checkPassword: jest.fn(() => Promise.resolve(false)),
      };
      usersRepository.findOne.mockResolvedValue(mockedUser);
      const result = await service.Login(loginArgs);
      expect(result).toEqual([false, 'Wrong password']);
    });

    it('should return token if password correnct', async () => {
      const mockedUser = {
        id: 1,
        checkPassword: jest.fn(() => Promise.resolve(true)),
      };
      usersRepository.findOne.mockResolvedValue(mockedUser);
      const result = await service.Login(loginArgs);
      expect(jwtService.sign).toHaveBeenCalledTimes(1);
      expect(jwtService.sign).toHaveBeenCalledWith(expect.any(Number));

      expect(result).toEqual([true, '', mockJwtServise().sign()]);
    });

    it('should fail on exception', async () => {
      usersRepository.findOne.mockRejectedValue(new Error());
      const result = await service.Login(loginArgs);
      expect(result).toEqual([false, "Can't log user in"]);
    });
  });
  describe('findUserById', () => {
    it('should find an existing user', async () => {
      usersRepository.findOne.mockResolvedValue({ id: 1 });
      const result = await service.findUserById(1);
      expect(result).toEqual({ id: 1 });
    });
    it('should return null if user not found', async () => {
      usersRepository.findOne.mockResolvedValue(undefined);
      const result = await service.findUserById(1);
      expect(result).toEqual(null);
    });
  });
  describe('editProfile', () => {
    it('should change email', async () => {
      const oldUser = {
        email: '123123',
        verified: true,
      };
      const editProfileArg = {
        userId: 1,
        input: { email: '123123123' },
      };
      const newVerification = {
        code: 'code',
      };
      usersRepository.findOne.mockResolvedValue(oldUser);
      verificationRepository.create.mockReturnValue(newVerification);
      verificationRepository.save.mockResolvedValue(newVerification);

      await service.editProfile(editProfileArg.userId, editProfileArg.input);

      expect(usersRepository.findOne).toHaveBeenCalledWith(
        editProfileArg.userId,
      );

      expect(verificationRepository.create).toHaveBeenCalledWith({
        user: {
          verified: false,
          email: editProfileArg.input.email,
        },
      });
      expect(usersRepository.save).toHaveBeenCalledWith({
        verified: false,
        email: editProfileArg.input.email,
      });
      expect(mailService.sendVerificationEmail).toHaveBeenCalledWith(
        editProfileArg.input.email,
        newVerification.code,
      );
    });

    it('should change password', async () => {
      const editProfileArg = {
        userId: 1,
        input: { password: 'newPass' },
      };

      usersRepository.findOne.mockResolvedValue({ password: 'old' });

      await service.editProfile(editProfileArg.userId, editProfileArg.input);

      expect(usersRepository.save).toHaveBeenCalledWith(editProfileArg.input);
    });
  });
  describe('verifyEmail', () => {
    it('should verify email', async () => {
      const mockedVerification = {
        user: {
          verified: false,
        },
        id: 1,
      };
      verificationRepository.findOne.mockResolvedValue(mockedVerification);

      const res = await service.verifyEmail('code');


      expect(verificationRepository.findOne).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(Object),
      );
      expect(usersRepository.save).toHaveBeenCalledWith({ verified: true });

      expect(verificationRepository.delete).toHaveBeenCalledWith(
        mockedVerification.id,
      );
      expect(res).toBeTruthy();
    });

    it('should return false if user does not exist', async () => {
      verificationRepository.findOne.mockResolvedValue(undefined)

      const res = await service.verifyEmail('code')

      expect(res).toBeFalsy()
    })
  });
});
