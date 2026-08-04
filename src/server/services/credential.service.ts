import { Credential } from '@/src/generated/prisma/client';
import { AuditAction } from '@/src/generated/prisma/client';
import { CredentialRepository } from '../database/repositories/credential.repository';
import { PaginatedResponse } from '@/src/shared/types/pagination';
import { AuditService } from './audit.service';
import {
    CreateCredentialData,
    FindCredentialsOptions,
    UpdateCredentialData,
} from '../types/repository/credential';
import {
    validateCreateCredentialData,
    validateUpdateCredentialData,
} from '../validators/credential/credential.validator';
import { AuditContext } from '../types/service/audit';

export class CredentialService {
    constructor(
        private readonly credentialRepository: CredentialRepository,
        private readonly auditService: AuditService,
    ) {}

    async create(
        data: CreateCredentialData,
        audit?: AuditContext,
    ): Promise<Credential> {
        validateCreateCredentialData(data);

        const credential = await this.credentialRepository.create(data);

        await this.auditService.createLog({
            userId: data.userId,
            credentialId: credential.id,
            action: AuditAction.CREATE_CREDENTIAL,
            resourceSearchHash: credential.resourceSearchHash,
            browser: audit?.browser,
            os: audit?.os,
            device: audit?.device,
            ip: audit?.ip,
        });

        return credential;
    }

    async getById(id: string): Promise<Credential | null> {
        if (!id) {
            throw new Error('id inválido.');
        }

        return this.credentialRepository.findById(id);
    }

    async getUserCredentials(
        userId: string,
        options: FindCredentialsOptions = {},
    ): Promise<PaginatedResponse<Credential>> {
        if (!userId) {
            throw new Error('userId inválido.');
        }

        if (options.page && options.page < 1) {
            throw new Error('Página inválida.');
        }

        if (options.limit && (options.limit < 1 || options.limit > 100)) {
            throw new Error('Limite inválido.');
        }

        return this.credentialRepository.findByUser(userId, options);
    }

    async update(
        data: UpdateCredentialData,
        audit?: AuditContext,
    ): Promise<Credential> {
        validateUpdateCredentialData(data);

        const credential = await this.credentialRepository.update(
            data.id,
            data,
        );

        await this.auditService.createLog({
            userId: credential.userId,
            credentialId: credential.id,
            action: AuditAction.UPDATE_CREDENTIAL,
            resourceSearchHash: credential.resourceSearchHash,
            browser: audit?.browser,
            os: audit?.os,
            device: audit?.device,
            ip: audit?.ip,
        });

        return credential;
    }

    async toggleFavorite(id: string): Promise<Credential> {
        if (!id) {
            throw new Error('id inválido.');
        }

        const credential = await this.credentialRepository.findById(id);

        if (!credential) {
            throw new Error('Credencial não encontrada.');
        }

        return this.credentialRepository.updateFavorite(
            id,
            !credential.favorite,
        );
    }

    async copyPassword(id: string, audit?: AuditContext): Promise<Credential> {
        if (!id) {
            throw new Error('id inválido.');
        }

        const credential = await this.credentialRepository.findById(id);

        if (!credential) {
            throw new Error('Credencial não encontrada.');
        }

        await this.auditService.createLog({
            userId: credential.userId,
            credentialId: credential.id,
            action: AuditAction.COPY_PASSWORD,
            resourceSearchHash: credential.resourceSearchHash,
            browser: audit?.browser,
            os: audit?.os,
            device: audit?.device,
            ip: audit?.ip,
        });

        return credential;
    }

    async delete(id: string, audit?: AuditContext): Promise<void> {
        if (!id) {
            throw new Error('id inválido.');
        }

        const credential = await this.credentialRepository.findById(id);

        if (!credential) {
            throw new Error('Credencial não encontrada.');
        }

        await this.credentialRepository.delete(id);

        await this.auditService.createLog({
            userId: credential.userId,
            credentialId: credential.id,
            action: AuditAction.DELETE_CREDENTIAL,
            resourceSearchHash: credential.resourceSearchHash,
            browser: audit?.browser,
            os: audit?.os,
            device: audit?.device,
            ip: audit?.ip,
        });
    }

    async countUserCredentials(userId: string): Promise<number> {
        if (!userId) {
            throw new Error('userId inválido.');
        }

        return this.credentialRepository.countByUser(userId);
    }
}
