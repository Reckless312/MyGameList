/**
 * @jest-environment node
 */

import '@testing-library/jest-dom';
import { TextEncoder } from 'node:util';
import {POST} from '@/app/api/games/filter/route';
import {setPool} from "@/lib/data"
import { Pool } from 'pg';
import {afterEach, beforeEach, describe, expect, it, jest} from '@jest/globals'

jest.mock('pg');

global.TextEncoder = TextEncoder;

describe('Filter Test', () => {
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

    describe('POST', () => {
        it('should get games that contain the name', async () => {
            const mockGameName = "New game"
            const mockGames = [
                {id: 1, name: 'New Game 1'},
                {id: 2, name: 'New Game 2'},
                {id: 3, name: 'New Game 3'},
            ]

            mockClient.query.mockResolvedValueOnce({rows: mockGames, rowCount: mockGames.length });

            const request = new Request('http://localhost', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({name : mockGameName}),
            });

            const response = await POST(request);
            expect(response.status).toBe(200);
            expect(await response.json()).toEqual({rows : mockGames});
            expect(mockClient.query).toHaveBeenCalledWith(
                'SELECT * FROM GAMES WHERE LOWER(name) LIKE \'%\' || LOWER($1) ||\'%\'',
                [mockGameName]
            );
        });
    });

    describe('POST WITH AN ARGUMENT MISSING', () => {
        it('should return a message', async () => {
            const mockGame = {
            };

            const request = new Request('http://localhost', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(mockGame),
            });

            const response = await POST(request);
            expect(response.status).toBe(404);
            expect(await response.json()).toEqual({ message: 'Missing required fields' });
        });
    });

    describe('POST WITH AN ERROR', () => {
        it('should return a message', async () => {
            const mockGame = {
                name: 'New Game',
            };

            mockClient.query.mockRejectedValueOnce(new Error("Database connection failed"));

            const request = new Request('http://localhost', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(mockGame),
            });

            const response = await POST(request);
            expect(response.status).toBe(500);
            expect(await response.json()).toEqual({ message: 'Error happened while filtering games' });
        });
    });
});