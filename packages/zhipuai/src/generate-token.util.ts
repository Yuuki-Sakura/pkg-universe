import jwt from 'jsonwebtoken';

export function generateToken(apiKey: string, timestamp: number, ttl: number) {
  const [id, secret] = apiKey.split('.');

  const exp = timestamp + ttl;

  // @ts-ignore
  const token = jwt.sign(
    {
      api_key: id,
      exp,
      timestamp: timestamp,
    },
    secret,
    {
      header: {
        alg: 'HS256',
        sign_type: 'SIGN',
      },
    },
  );

  return token;
}
