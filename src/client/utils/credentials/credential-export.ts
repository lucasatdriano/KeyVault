import {
    CredentialExport,
    ExportCredential,
} from '@/src/shared/types/credential';

export function downloadCredentialsExport(
    credentials: ExportCredential[],
): void {
    const data: CredentialExport = {
        version: 1,
        exportedAt: new Date().toISOString(),
        credentials,
    };

    const json = JSON.stringify(data, null, 2);

    const blob = new Blob([json], {
        type: 'application/json',
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');

    link.href = url;
    link.download = `keyvault-export-${new Date()
        .toISOString()
        .slice(0, 10)}.json`;

    link.click();

    URL.revokeObjectURL(url);
}
