import {jest} from '@jest/globals';

const mockClient = {
    query: jest.fn(),
    release: jest.fn(),
    connect: jest.fn(),
};

const mockPool = {
    connect: jest.fn(() => mockClient),
    query: jest.fn(),
    end: jest.fn(),
};

module.exports = {
    Pool: jest.fn(() => mockPool),
    Client: jest.fn(() => mockClient),
};