/**
 * @jest-environment node
 */

import '@testing-library/jest-dom';
import { TextEncoder } from 'node:util';
import {GET, POST, DELETE, PATCH} from '@/app/api/games/route';
import {setPool} from "@/lib/data"
import { Pool } from 'pg';
import {afterEach, beforeEach, describe, expect, it, jest} from '@jest/globals'

jest.mock('pg');

global.TextEncoder = TextEncoder;

describe('API Test', () => {
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
            const mockGames = [{
                id: 1,
                name: 'Persona 3 Reload',
                description: 'Test description',
                image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1200px-Google_2015_logo.svg.png',
                releaseDate: '2024-02-02',
                price: 70,
                tag: 'JRPG'
            }];

            mockClient.query.mockResolvedValueOnce({ rows: mockGames });

            const request = new Request('http://localhost:8080', {
                headers: { origin: 'test' },
            });

            const response = await GET(request);
            expect(response.status).toBe(200);
            expect(await response.json()).toEqual(mockGames);
        });
    });

    describe('GET Error', () => {
        it('should return a message', async () => {
            mockClient.query.mockRejectedValueOnce(new Error("Database connection failed"));

            const request = new Request('http://localhost:8080', {
                headers: { origin: 'test' },
            });

            const response = await GET(request);

            expect(response.status).toBe(500);

            expect(await response.json()).toEqual({
                message: "Error happened while retrieving games"
            });
        });
    });

    describe('DELETE', () => {
        it('should delete a game', async () => {
            const mockId = 1;
            mockClient.query.mockResolvedValueOnce({ rowCount: 1 });

            const request = new Request('http://localhost:8080', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: mockId }),
            });

            const response = await DELETE(request);
            expect(response.status).toBe(200);
            expect(await response.json()).toEqual({ message: 'Game deleted successfully' });
        });
    });

    describe('DELETE WITH ID NOT PROVIDED', () => {
        it('should return a message', async () => {

            const request = new Request('http://localhost:8080', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({})
            });

            const response = await DELETE(request);
            expect(response.status).toBe(400);
            expect(await response.json()).toEqual({ message: 'Game id required' });
        });
    });

    describe('DELETE WITH ID NOT FOUND', () => {
        it('should return a message', async () => {
            const mockId = 100;

            mockClient.query.mockResolvedValueOnce({ rowCount: 0 });

            const request = new Request('http://localhost:8080', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: mockId }),
            });

            const response = await DELETE(request);
            expect(response.status).toBe(401);
            expect(await response.json()).toEqual({ message: 'Game id not found!' });
        });
    });

    describe('DELETE WITH ERROR', () => {
        it('should return a message', async () => {
            const mockId = 1;

            mockClient.query.mockRejectedValueOnce(new Error("Database connection failed"));

            const request = new Request('http://localhost:8080', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({id : mockId}),
            });

            const response = await DELETE(request);
            expect(response.status).toBe(500);
            expect(await response.json()).toEqual({ message: 'Error happened while deleting game' });
        });
    });

    describe('POST', () => {
        it('should create a new game', async () => {
            const mockGame = {
                name: 'New Game',
                description: 'Test description',
                image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1200px-Google_2015_logo.svg.png',
                releaseDate: '2024-01-01',
                price: 60,
                tag: 'Adventure'
            };

            mockClient.query
                .mockResolvedValueOnce({ rowCount: 0 })
                .mockResolvedValueOnce({ rowCount: 1 });

            const request = new Request('http://localhost:8080', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(mockGame),
            });

            const response = await POST(request);
            expect(response.status).toBe(200);
            expect(await response.json()).toEqual({ message: 'Game created successfully' });
        });
    });

    describe('POST WITH AN ARGUMENT MISSING', () => {
        it('should return a message', async () => {
            const mockGame = {
                description: 'Test description',
                image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1200px-Google_2015_logo.svg.png',
                releaseDate: '2024-01-01',
                price: 60,
                tag: 'Adventure'
            };

            const request = new Request('http://localhost:8080', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(mockGame),
            });

            const response = await POST(request);
            expect(response.status).toBe(404);
            expect(await response.json()).toEqual({ message: 'Missing required fields' });
        });
    });

    describe('POST A GAME THAT IS IN THE DATABASE', () => {
        it('should return a message', async () => {
            const mockGame = {
                name: 'New Game',
                description: 'Test description',
                image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1200px-Google_2015_logo.svg.png',
                releaseDate: '2024-01-01',
                price: 60,
                tag: 'Adventure'
            };

            mockClient.query.mockResolvedValueOnce({ rowCount: 1 })

            const request = new Request('http://localhost:8080', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(mockGame),
            });

            const response = await POST(request);
            expect(response.status).toBe(401);
            expect(await response.json()).toEqual({ message: 'Game already found with same critical information' });
        });
    });

    describe('POST A GAME WITH INVALID GAME DATA', () => {
        it('should return a message', async () => {
            const mockGame = {
                name: 'Ne',
                description: 'Test description',
                image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1200px-Google_2015_logo.svg.png',
                releaseDate: '2024-01-01',
                price: 60,
                tag: 'Adventure'
            };

            const request = new Request('http://localhost:8080', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(mockGame),
            });

            const response = await POST(request);
            expect(response.status).toBe(400);
            expect(await response.json()).toEqual({ message: 'Validation for input failed!' });
        });
    });

    describe('POST WITH AN ERROR', () => {
        it('should return a message', async () => {
            const mockGame = {
                name: 'New Game',
                description: 'Test description',
                image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1200px-Google_2015_logo.svg.png',
                releaseDate: '2024-01-01',
                price: 60,
                tag: 'Adventure'
            };

            mockClient.query.mockRejectedValueOnce(new Error("Database connection failed"));

            const request = new Request('http://localhost:8080', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(mockGame),
            });

            const response = await POST(request);
            expect(response.status).toBe(500);
            expect(await response.json()).toEqual({ message: 'Error happened while creating game' });
        });
    });

    describe('PATCH', () => {
        it('should update a game', async () => {
            const mockGame = {
                id: "1",
                name: 'New Game',
                description: 'Test description',
                image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1200px-Google_2015_logo.svg.png',
                releaseDate: '2024-01-01',
                price: 60,
                tag: 'Adventure'
            };

            mockClient.query
                .mockResolvedValueOnce({ rowCount: 1 })
                .mockResolvedValueOnce({ rowCount: 0})
                .mockResolvedValueOnce({ rowCount: 1 });

            const request = new Request('http://localhost:8080', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(mockGame),
            });

            const response = await PATCH(request);
            expect(response.status).toBe(200);
            expect(await response.json()).toEqual({ message: 'Game updated successfully' });
        });
    });

    describe('PATCH A GAME WITH WRONG VALIDATION', () => {
        it('should update a game', async () => {
            const mockGame = {
                id: "1",
                name: 'Ne',
                description: 'Test description',
                image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1200px-Google_2015_logo.svg.png',
                releaseDate: '2024-01-01',
                price: 60,
                tag: 'Adventure'
            };

            const request = new Request('http://localhost:8080', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(mockGame),
            });

            const response = await PATCH(request);
            expect(response.status).toBe(400);
            expect(await response.json()).toEqual({ message: 'Validation for input failed!' });
        });
    });

    describe('PATCH WITH MISSING ARGUMENTS', () => {
        it('should return a message', async () => {
            const mockGame = {
                name: 'New Game',
                description: 'Test description',
                image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1200px-Google_2015_logo.svg.png',
                releaseDate: '2024-01-01',
                price: 60,
                tag: 'Adventure'
            };

            const request = new Request('http://localhost:8080', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(mockGame),
            });

            const response = await PATCH(request);
            expect(response.status).toBe(401);
            expect(await response.json()).toEqual({ message: 'Missing required fields' });
        });
    });

    describe('PATCH WITH GAME NOT INSIDE THE DATABASE', () => {
        it('should return a message', async () => {
            const mockGame = {
                id: "1",
                name: 'New Game',
                description: 'Test description',
                image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1200px-Google_2015_logo.svg.png',
                releaseDate: '2024-01-01',
                price: 60,
                tag: 'Adventure'
            };

            mockClient.query
                .mockResolvedValueOnce({ rowCount: 0 })

            const request = new Request('http://localhost:8080', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(mockGame),
            });

            const response = await PATCH(request);
            expect(response.status).toBe(402);
            expect(await response.json()).toEqual({ message: 'Game id not found!' });
        });
    });

    describe('PATCH ERROR', () => {
        it('should return a message', async () => {
            const mockGame = {
                id: "1",
                name: 'New Game',
                description: 'Test description',
                image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1200px-Google_2015_logo.svg.png',
                releaseDate: '2024-01-01',
                price: 60,
                tag: 'Adventure'
            };

            mockClient.query.mockRejectedValueOnce(new Error("Database connection failed"));

            const request = new Request('http://localhost:8080', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(mockGame),
            });

            const response = await PATCH(request);
            expect(response.status).toBe(500);
            expect(await response.json()).toEqual({ message: 'Error happened while updating the game' });
        });
    });
});