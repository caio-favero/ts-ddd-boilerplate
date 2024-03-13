import mongoose, { Connection } from 'mongoose';

export type ReadStrategy = 'primary' | 'secondary' | 'primaryPreferred' | 'secondaryPreferred' | 'nearest';

interface DatabaseSettings {
    alias: string,
    host: string,
    port: string | number,
    name: string,
    user: string,
    password: string,
    replicaSet: {
        name: string,
        hosts: string,
        readStrategy: ReadStrategy,
    },
}

export default async function factory(settings: DatabaseSettings): Promise<Connection> {
    const {
        alias,
        name,
        user,
        password,
        host,
        port,
        replicaSet
    } = settings;

    return new Promise((resolve) => {
        let options = '?authSource=admin';

        if (replicaSet.name) options = `${options}&replicaSet=${replicaSet.name}`;
        if (replicaSet.readStrategy) options = `${options}&readPreference=${replicaSet.readStrategy}`;

        const uri =
            `mongodb://${user}:${password}@${host}:${port}${replicaSet.hosts ? (',' + replicaSet.hosts) : ''}/${name}${options}`;

        const conn = mongoose.createConnection(uri, {
            retryWrites: true,
            ssl: false,
            socketTimeoutMS: 0,
            connectTimeoutMS: 0,
        });

        conn.on('open', () => {
            console.info(`${alias} - connected to MongoDB "${host}:${port}/${name}"`);
        });

        conn.on('disconnected', function() {
            console.info(`${alias} - disconnected from MongoDB "${host}:${port}/${name}"`);
        });

        conn.on('reconnected', function() {
            console.info(`${alias} - reconnected on MongoDB "${host}:${port}/${name}"`);
        });

        conn.on('reconnecting', function() {
            console.info(`${alias} - trying to reconnect on MongoDB "${host}:${port}/${name}"`);
        });

        conn.on('close', function() {
            console.info(`${alias} - closed connection with MongoDB "${host}:${port}/${name}"`);
        });

        conn.on('error', function(ref: Error) {
            console.error(`${alias} - error on connection with MongoDB "${host}:${port}/${name}"`, ref);

            if (ref.message && ref.message.match(/failed to connect to server .* on first connect/)) {
                setTimeout(async function() {
                    console.info(
                        new Date(),
                        `${alias} - Attempting to establish first connection with MongoDB "${host}:${port}/${name}"`
                    );

                    resolve(await factory(settings));
                }, 5 * 1000);
            }
        });
    });
}
