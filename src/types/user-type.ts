export type UserSetting = {
  profileDefault: number | null;
};

export type UserAction = {
  timeAt: Date | null;
  code: null | string;
  numberTries: number;
};

export type TUserSecurity = {
  login_attempts: number | null;
  login_time: Date | null;
  is_block: boolean;
  device_try?: string;
};
