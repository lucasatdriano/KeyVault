import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function verifyEdgeToken(token: string) {
    return jwtVerify(token, secret);
}
