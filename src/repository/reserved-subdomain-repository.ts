import { escape } from "mysql2";
import ReservedDomain from "../model/reserved-domain";
import { getConnection } from "../mysql/connection";

const RESERVED_DOMAINS = 'reserved_domains'

const findSubdomainsNotBelongingToApiKey = async(apiKey: string, subdomain: string): Promise<ReservedDomain|undefined> => {
    const connection = await getConnection();
    const sql = `
        SELECT * FROM ${RESERVED_DOMAINS} 
        WHERE subdomain = ${escape(subdomain)}
        AND apiKey <> ${escape(apiKey)}
    `;
    const [rows, fields] = await connection.execute(sql);
    return Promise.resolve(rows[0] ?? undefined);
}

const findBySubdomain = async(subdomain: string): Promise<ReservedDomain|undefined> => {
    const connection = await getConnection();
    const sql = `
        SELECT * FROM ${RESERVED_DOMAINS} 
        WHERE subdomain = ${escape(subdomain)}
    `;
    const [rows, fields] = await connection.execute(sql);

    return Promise.resolve(rows[0] ?? undefined);
}

const addReservedDomain = async(reservedDomain: ReservedDomain) => {
    // Don't add a duplicate record if the domain already exists
    const existingReservedDomain = await findBySubdomain(reservedDomain.subdomain);
    if (existingReservedDomain !== undefined) {
        return;
    }

    const connection = await getConnection();
    const sql = `
        INSERT INTO ${RESERVED_DOMAINS} (apiKey, subdomain)
        VALUES (
            ${escape(reservedDomain.apiKey)},
            ${escape(reservedDomain.subdomain)}
        )
    `;
    await connection.execute(sql);
}

export {
    findBySubdomain,
    findSubdomainsNotBelongingToApiKey,
    addReservedDomain
}