export type UserSetting = {
  profileDefault: number | null;
};

export type UserAction = {
  timeAt: Date | null;
  code: null | string;
  numberTries: number;
};
