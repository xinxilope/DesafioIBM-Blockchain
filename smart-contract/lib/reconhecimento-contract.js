/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class ReconhecimentoContract extends Contract {

    async usuarioExists(ctx, usuarioID) {
        const buffer = await ctx.stub.getState(usuarioID);
        return (!!buffer && buffer.length > 0);
    }

    async createUsuario(ctx, usuarioID, value) {
        const exists = await this.usuarioExists(ctx, usuarioID);
        if (exists) {
            throw new Error(`The usuario ${usuarioID} already exists`);
        }
        const asset = {
        id: usuarioID,
        hash: value,
        saldoRetirada: 0,
        saldoParaEnviar: 0,
        };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(usuarioID, buffer);
    }

    async readUsuario(ctx, usuarioID) {
        const exists = await this.usuarioExists(ctx, usuarioID);
        if (!exists) {
            throw new Error(`The usuario ${usuarioID} does not exist`);
        }
        const buffer = await ctx.stub.getState(usuarioID);
        const asset = JSON.parse(buffer.toString());
        return asset;
    }

    async updateUsuario(ctx, usuarioID, value) {
        const exists = await this.usuarioExists(ctx, usuarioID);
        if (!exists) {
            throw new Error(`The usuario ${usuarioID} does not exist`);
        }
        var usuario = await ctx.stub.getState(usuarioID)
        usuario = JSON.parse(usuario)
        const asset = {
            id: usuarioID,
            hash: value,
            saldoRetirada: usuario.saldoRetirada,
            saldoParaEnviar: usuario.saldoParaEnviar,
        };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(usuarioID, buffer);
    }

    async updateUsuarioProCiclo(ctx, usuarioID) {
        const exists = await this.usuarioExists(ctx, usuarioID);
        if (!exists) {
            throw new Error(`The usuario ${usuarioID} does not exist`);
        }
        var usuario = await ctx.stub.getState(usuarioID)
        usuario = JSON.parse(usuario)
        const asset = {
            id: usuarioID,
            hash: usuario.hash,
            saldoRetirada: usuario.saldoRetirada,
            saldoParaEnviar: 2000,
        };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(usuarioID, buffer);
    }

    async deleteUsuario(ctx, usuarioID) {
        const exists = await this.usuarioExists(ctx, usuarioID);
        if (!exists) {
            throw new Error(`The usuario ${usuarioID} does not exist`);
        }
        await ctx.stub.deleteState(usuarioID);
    }

    async eviarSaldo(ctx, usuarioID1, usuarioID2, value) {
        const valueIsMultiple = value % 100
        const exists1 = await this.usuarioExists(ctx, usuarioID1);
        const exists2 = await this.usuarioExists(ctx, usuarioID2);
        if (!exists1 && !exists2) {
            throw new Error(`One of the users dont exist`);
        }
        else if (valueIsMultiple !== 0) {
            throw new Error(`The value must be multiple of 100`);
        }

        var usuario1 = await ctx.stub.getState(usuarioID1)
        usuario1 = JSON.parse(usuario1)
        if ((usuario1.saldoParaEnviar - Number(value)) < 0) {
            throw new Error(`Insufiscient funds`);
        }

        const asset1 = {
            id: usuario1.usuarioID,
            hash: usuario1.hash,
            saldoRetirada: usuario1.saldoRetirada,
            saldoParaEnviar: usuario1.saldoParaEnviar - Number(value)
        };
        const buffer1 = Buffer.from(JSON.stringify(asset1));
        await ctx.stub.putState(usuarioID1, buffer1);


        var usuario2 = await ctx.stub.getState(usuarioID2)
        usuario2 = JSON.parse(usuario2)
        const asset2 = {
            id: usuario2.usuarioID,
            hash: usuario2.hash,
            saldoRetirada: usuario2.saldoRetirada + Number(value),
            saldoParaEnviar: usuario2.saldoParaEnviar
        };
        const buffer2 = Buffer.from(JSON.stringify(asset2));
        await ctx.stub.putState(usuarioID2, buffer2);
    }

    async iniciaCiclo(ctx) {
        const startKey = '0';
        const endKey = '999';
        const iterator = await ctx.stub.getStateByRange(startKey, endKey);
        const allResults = [];

        
        while (true) {
            const res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString('utf8'));

                const Key = res.value.key;
                let Record;
                try {
                    Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    Record = res.value.value.toString('utf8');
                }
                allResults.push({ Key, Record });
            }
            if (res.done) {
                await iterator.close();
                return JSON.stringify({msg: "concluido"});
            }
        }
    }
}

module.exports = ReconhecimentoContract;
