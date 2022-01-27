/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class ReconhecimentoContract extends Contract {

    async reconhecimentoExists(ctx, reconhecimentoId) {
        const buffer = await ctx.stub.getState(reconhecimentoId);
        return (!!buffer && buffer.length > 0);
    }

    async createReconhecimento(ctx, reconhecimentoId, value) {
        const exists = await this.reconhecimentoExists(ctx, reconhecimentoId);
        if (exists) {
            throw new Error(`The reconhecimento ${reconhecimentoId} already exists`);
        }
        const asset = { value };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(reconhecimentoId, buffer);
    }

    async readReconhecimento(ctx, reconhecimentoId) {
        const exists = await this.reconhecimentoExists(ctx, reconhecimentoId);
        if (!exists) {
            throw new Error(`The reconhecimento ${reconhecimentoId} does not exist`);
        }
        const buffer = await ctx.stub.getState(reconhecimentoId);
        const asset = JSON.parse(buffer.toString());
        return asset;
    }

    async updateReconhecimento(ctx, reconhecimentoId, newValue) {
        const exists = await this.reconhecimentoExists(ctx, reconhecimentoId);
        if (!exists) {
            throw new Error(`The reconhecimento ${reconhecimentoId} does not exist`);
        }
        const asset = { value: newValue };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(reconhecimentoId, buffer);
    }

    async deleteReconhecimento(ctx, reconhecimentoId) {
        const exists = await this.reconhecimentoExists(ctx, reconhecimentoId);
        if (!exists) {
            throw new Error(`The reconhecimento ${reconhecimentoId} does not exist`);
        }
        await ctx.stub.deleteState(reconhecimentoId);
    }

}

module.exports = ReconhecimentoContract;
