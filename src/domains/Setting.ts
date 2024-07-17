export enum Currency {
  PEN = "PEN",
}

export enum Language {
  SPANISH = "SPANISH",
  ENGLISH = "ENGLISH",
}

export enum Theme {
  DARK = "DARK",
  LIGHT = "LIGHT",
  DEFAULT = "DEFAULT",
}

export class Setting {
  id: string;

  currency: Currency;

  language: Language;

  themePreference: Theme;

  user: {
    id: string;
  };

  constructor(data?: Partial<Setting>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
