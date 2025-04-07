/**
 * @jest-environment node
 */

import '@testing-library/jest-dom';
import { TextEncoder } from 'node:util';
import {GET, setPool} from '@/app/api/games/sort/route';
import { Pool } from 'pg';
import {afterEach, beforeEach, describe, expect, it, jest} from '@jest/globals'

jest.mock('pg');

global.TextEncoder = TextEncoder;

describe('Sort Test', () => {
    let mockPool: any;
    let mockClient: any;

    beforeEach(() => {
        mockPool = new Pool();
        mockClient = {
            query: jest.fn(),
            release: jest.fn(),
        };
        mockPool.connect.mockResolvedValue(mockClient);
        setPool(mockPool);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET', () => {
        it('should fetch all games', async () => {
            const mockGames = [
                {id: 1, name: 'Persona 3 Reload'},
                {id: 2, name: 'Minecraft'},];

            const expectedMockGames = [
                {id: 2, name: 'Minecraft'},
                {id: 1, name: 'Persona 3 Reload'}];

            mockClient.query.mockResolvedValueOnce({ rows: expectedMockGames });

            const response = await GET();
            expect(response.status).toBe(200);
            expect(await response.json()).toEqual(expectedMockGames);
            expect(mockClient.query).toHaveBeenCalledWith('SELECT * FROM GAMES ORDER BY name');
        });
    });

    describe('GET Error', () => {
        it('should return a message', async () => {
            mockClient.query.mockRejectedValueOnce(new Error("Database connection failed"));

            const response = await GET();

            expect(response.status).toBe(500);

            expect(await response.json()).toEqual({
                message: "Error happened while retrieving games"
            });
        });
    });
});