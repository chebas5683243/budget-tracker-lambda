export class Setting {
  id: string;

  name: string;

  value: string;

  user: {
    id: string;
  };

  constructor(data?: Partial<Setting>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
