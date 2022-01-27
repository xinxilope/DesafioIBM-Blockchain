/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class ReconhecimentoContract extends Contract {

    async reconhecimentoExists(ctx, usuarioID) {
        const buffer = await ctx.stub.getState(usuarioID);
        return (!!buffer && buffer.length > 0);
    }

    async createReconhecimento(ctx, usuarioID, value) {
        const exists = await this.reconhecimentoExists(ctx, usuarioID);
        if (exists) {
            throw new Error(`The reconhecimento ${usuarioID} already exists`);
        }
        const asset = { value };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(usuarioID, buffer);
    }

    async readReconhecimento(ctx, usuarioID) {
        const exists = await this.reconhecimentoExists(ctx, usuarioID);
        if (!exists) {
            throw new Error(`The reconhecimento ${usuarioID} does not exist`);
        }
        const buffer = await ctx.stub.getState(usuarioID);
        const asset = JSON.parse(buffer.toString());
        return asset;
    }

    async updateReconhecimento(ctx, usuarioID, newValue) {
        const exists = await this.reconhecimentoExists(ctx, usuarioID);
        if (!exists) {
            throw new Error(`The reconhecimento ${usuarioID} does not exist`);
        }
        const asset = { value: newValue };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(usuarioID, buffer);
    }

    async deleteReconhecimento(ctx, usuarioID) {
        const exists = await this.reconhecimentoExists(ctx, usuarioID);
        if (!exists) {
            throw new Error(`The reconhecimento ${usuarioID} does not exist`);
        }
        await ctx.stub.deleteState(usuarioID);
    }

}

module.exports = ReconhecimentoContract;
