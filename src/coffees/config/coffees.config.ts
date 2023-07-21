import { registerAs } from '@nestjs/config';

export default registerAs('coffees', () => ({
  brands: ['nescafe'],
}));
