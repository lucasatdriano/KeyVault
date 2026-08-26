import { headers } from 'next/headers';

import { AuditContext } from '../types/service/audit';

export async function getAuditContext(): Promise<AuditContext> {
    const h = await headers();

    const forwardedFor = h.get('x-forwarded-for');
    const realIp = h.get('x-real-ip');

    const ip = forwardedFor?.split(',')[0].trim() ?? realIp ?? undefined;

    return {
        browser: h.get('sec-ch-ua') ?? undefined,
        os: h.get('sec-ch-ua-platform') ?? undefined,
        device: h.get('sec-ch-ua-mobile') === '?1' ? 'Mobile' : 'Desktop',
        ip,
    };
}
