import * as jwt from "jwt";
import { load } from "dotenv";
import { StatusCodes } from "http-status-codes";
import { BaseError } from "@/cores/errors/base/base.error.js";

await load({ envPath: ".env" });
const rawSecret = Deno.env.get("ACCESS_TOKEN_SECRET");
const ACCESS_TOKEN_SECRET = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(rawSecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
);
const DEFAULT_EXP = 60 * 60; // 1 hour in seconds

const genAccessToken = async ({ payload, expiresIn = DEFAULT_EXP }) => {
    return await jwt.create(
        { alg: "HS256", typ: "JWT" },
        { ...payload, exp: jwt.getNumericDate(expiresIn) },
        ACCESS_TOKEN_SECRET,
    );
};

const verifyToken = async ({ token, secret = ACCESS_TOKEN_SECRET }) => {
    if (!token)
        throw new BaseError({
            message: "Token is required",
            statusCode: StatusCodes.UNAUTHORIZED,
            errorCode: "TOKEN_MISSING",
        });

    try {
        return await jwt.verify(token, secret);
    } catch (err) {
        throw new BaseError({
            message: "Token is invalid or expired",
            statusCode: StatusCodes.UNAUTHORIZED,
            errorCode: "TOKEN_INVALID",
            details: err,
        });
    }
};

export { genAccessToken, verifyToken };
