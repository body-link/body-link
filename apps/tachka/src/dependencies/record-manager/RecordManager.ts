import { CollectionInfo, Db, MongoClient } from 'mongodb';
import { createContextToken, createReader, useContext } from '@marblejs/core';
import { arrayToRecord } from '@body-link/helpers';
import { isDefined, isError, isUndefined, TOption } from '@body-link/type-guards';
import { getState } from '../../state';
import { getRecordCollectionName, RecordAny, recordMeta, toMongo } from '../../data/record/RecordAny';
import { Assistant, AssistantToken } from '../assistant/Assistant';
import { createReplyError } from '../../data/Reply';
import { ReplyEntry } from '../../data/ReplyEntry';

export class RecordManager {
  private readonly _assistant: Assistant;
  private readonly _client: MongoClient = new MongoClient(getState().mongoURI);
  private _db: Db = this._client.db();
  private _connected: boolean = false;

  public constructor(params: { assistant: Assistant }) {
    this._assistant = params.assistant;
  }

  public connect = async (): Promise<void> => {
    try {
      await this._client.connect();
      this._connected = true;
      const collections = await this._db.listCollections().toArray();
      const collectionsMap = arrayToRecord(collections, (c) => c.name);

      const toCreate = Object.values(recordMeta).filter((recordCollectionName) => {
        const collection: TOption<CollectionInfo> = collectionsMap[recordCollectionName];
        if (isDefined(collection)) {
          if (isUndefined(collection.options) || !('validator' in collection.options)) {
            throw new Error(`Reserved "${recordCollectionName}" doesn't have validator`);
          }
          return false;
        } else {
          return true;
        }
      });

      if (toCreate.length > 0) {
        await Promise.all(
          toCreate.map((recordCollectionName) =>
            this._db.createCollection(recordCollectionName, {
              validator: {
                $jsonSchema: {
                  bsonType: 'object',
                  additionalProperties: false,
                  required: ['timestamp', 'duration', 'owner', 'source', 'group'],
                  properties: {
                    _id: {
                      bsonType: 'string',
                      minLength: 1,
                    },
                    timestamp: {
                      bsonType: 'date',
                    },
                    offset: {
                      bsonType: 'int',
                      minimum: -1440,
                      maximum: 1440,
                    },
                    duration: {
                      bsonType: 'int',
                      minimum: 0,
                    },
                    data: {
                      bsonType: ['number', 'string', 'object', 'array', 'null', 'bool'],
                    },
                    source: {
                      bsonType: 'string',
                      minLength: 1,
                      pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$',
                    },
                    group: {
                      bsonType: 'string',
                      minLength: 1,
                      pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$',
                    },
                    owner: {
                      bsonType: 'string',
                      minLength: 1,
                      pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$',
                    },
                  },
                },
              },
            })
          )
        );
        await Promise.all(
          toCreate.map((recordCollectionName) => {
            const collection = this._db.collection(recordCollectionName);
            return Promise.all([
              collection.createIndex({ timestamp: 1 }),
              collection.createIndex({ duration: 1 }),
              collection.createIndex({ owner: 1 }),
              collection.createIndex({ source: 1 }),
              collection.createIndex({ group: 1 }),
            ]);
          })
        );
      }
    } catch (error) {
      this._connected = false;
      this._assistant.reply(
        createReplyError({
          entry: ReplyEntry.build({
            subject: 'Record Manager',
            action: 'connect',
          }),
          error: isError(error) ? error.message : String(error),
        })
      );
    }
  };

  public disconnect = async (): Promise<void> => {
    if (this._connected) {
      await this._client.close();
      this._connected = false;
    }
  };

  public save = async (record: RecordAny): Promise<void> => {
    await this._db.collection(getRecordCollectionName(record)).insertOne(toMongo(record));
  };
}

// eslint-disable-next-line @rushstack/typedef-var
export const RecordManagerToken = createContextToken<RecordManager>('RecordManager');

// eslint-disable-next-line @rushstack/typedef-var
export const recordManager = createReader(async (ask) => {
  const assistant = useContext(AssistantToken)(ask);
  const rm = new RecordManager({ assistant });
  await rm.connect();
  return rm;
});
