/* eslint-disable consistent-return */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { codec, db as klayrDB } from 'klayr-sdk';
import * as os from 'os';
import { join } from 'path';
import { ensureDir } from 'fs-extra';
import { newTokenEventSchema, heightSchema } from './schemas';
import { NewTokenEvent as Event, Height } from './types';
import { DB_LAST_TOKENID_COUNTER_INFO, DB_LAST_HEIGHT_INFO } from './constants';
import { NewTokenEventData } from '@app/modules/token_factory/events/new_token';

const { Database } = klayrDB;
type KVStore = klayrDB.Database;

// Returns DB's instance.
export const getDBInstance = async (
	dataPath: string,
	dbName = 'lisk-framework-tokenFactoryInfo-plugin.db',
): Promise<KVStore> => {
	const dirPath = join(dataPath.replace('~', os.homedir()), 'database', dbName);
	await ensureDir(dirPath);
	return new Database(dirPath);
};

// Returns event's data stored in the database.
export const getEventNewTokenInfo = async (
	db: KVStore,
	tokenIDZero: Buffer,
	lastTokenID: Buffer,
): Promise<Event[]> => {
	// 1. Look for all the given key-value pairs in the database
	const stream = db.createReadStream({
		gte: tokenIDZero,
		lte: lastTokenID,
	});

	// 2. Get event's data out of the collected stream and push it in an array.
	const results = await new Promise<Event[]>((resolve, reject) => {
		const events: Event[] = [];
		stream
			.on('data', ({ value }: { value: Buffer }) => {
				events.push(codec.decode<Event>(newTokenEventSchema, value));
			})
			.on('error', error => {
				reject(error);
			})
			.on('end', () => {
				resolve(events);
			});
	});
	return results;
};

// Stores event data in the database.
export const setEventNewTokenInfo = async (
	db: KVStore,
	parsedData: NewTokenEventData,
	_eventHeight: number,
): Promise<void> => {
	const { owner, tokenID, name, symbol } = parsedData;
	const encodedAddressInfo = codec.encode(newTokenEventSchema, {
		owner,
		tokenID,
		name,
		symbol,
		totalSupply: BigInt(0),
		height: _eventHeight,
	});
	await db.set(tokenID, encodedAddressInfo);
};

export const getSingleEventTokenInfo = async (db: KVStore, tokenID: Buffer): Promise<Event> => {
	const encodedTokenInfo = await db.get(tokenID);
	return codec.decode<Event>(newTokenEventSchema, encodedTokenInfo);
};

export const setSingleEventTokenInfo = async (
	db: KVStore,
	tokenID: Buffer,
	event: Event,
): Promise<void> => {
	const encodedTokenInfo = codec.encode(newTokenEventSchema, event);
	await db.set(tokenID, encodedTokenInfo);
};

// Stores lastCounter for key generation.
export const setLastTokenID = async (db: KVStore, lastTokenID: Buffer): Promise<void> => {
	await db.set(DB_LAST_TOKENID_COUNTER_INFO, lastTokenID);
};

// Returns lastCounter.
export const getLastTokenID = async (db: KVStore): Promise<Buffer> => {
	const encodedCounterInfo = await db.get(DB_LAST_TOKENID_COUNTER_INFO);
	return encodedCounterInfo;
};

// Stores height of block where hello event exists.
export const setLastEventHeight = async (db: KVStore, lastHeight: number): Promise<void> => {
	const encodedHeightInfo = codec.encode(heightSchema, { height: lastHeight });
	await db.set(DB_LAST_HEIGHT_INFO, encodedHeightInfo);
};

// Returns height of block where hello event exists.
export const getLastEventHeight = async (db: KVStore): Promise<Height> => {
	const encodedHeightInfo = await db.get(DB_LAST_HEIGHT_INFO);
	return codec.decode<Height>(heightSchema, encodedHeightInfo);
};
