// Supabase Configuration for Dashboard Metrics
const SUPABASE_URL = 'https://rbdxfleejaqtmordcdot.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJiZHhmbGVlamFxdG1vcmRjZG90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4NDk0MjQsImV4cCI6MjA3NjQyNTQyNH0.LXAm8mEm8E0aUd1bH-PfXW2527OtU-JIZYxgNrjJ0pc'

// Bruk global Supabase fra CDN
export const supabase = window.supabase?.createClient ? 
    window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : 
    null

// Backup mock client hvis Supabase ikke er tilgjengelig
export const mockSupabase = {
    from: (table) => ({
        select: (columns = '*') => ({
            eq: (column, value) => ({
                neq: (neqColumn, neqValue) => ({
                    gte: (gteColumn, gteValue) => ({
                        order: (orderColumn, options = {}) => ({
                            limit: (limitValue) => ({
                                then: (callback) => {
                                    // Mock data for testing
                                    console.log(`Mock Supabase query: SELECT ${columns} FROM ${table}`);
                                    const mockData = getMockData(table);
                                    return callback(mockData);
                                }
                            })
                        })
                    })
                })
            }),
            neq: (column, value) => ({
                order: (orderColumn, options = {}) => ({
                    limit: (limitValue) => ({
                        then: (callback) => {
                            const mockData = getMockData(table);
                            return callback(mockData);
                        }
                    })
                })
            }),
            order: (orderColumn, options = {}) => ({
                limit: (limitValue) => ({
                    then: (callback) => {
                        const mockData = getMockData(table);
                        return callback(mockData);
                    }
                })
            })
        }),
        
        insert: (data) => ({
            then: (callback) => {
                console.log(`Mock Supabase insert: ${JSON.stringify(data)}`);
                return callback({ data: [data], error: null });
            }
        })
    })
};

// Mock data for testing dashboard
function getMockData(table) {
    if (table === 'automation_logs') {
        return {
            data: [
                {
                    id: '1',
                    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 timer siden
                    automation_type: 'faktura',
                    user_name: 'Kunde A',
                    batch_id: '202501151430_ABC123',
                    request_id: 'req_123',
                    supplier: 'Uno-X',
                    file_count: 1,
                    status: 'completed',
                    time_saved_minutes: 5,
                    metadata: {}
                },
                {
                    id: '2',
                    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 timer siden
                    automation_type: 'prisliste_bring_transport',
                    user_name: 'Kunde B',
                    batch_id: '202501151200_DEF456',
                    request_id: 'req_124',
                    supplier: null,
                    file_count: 1,
                    status: 'completed',
                    time_saved_minutes: 10,
                    metadata: {}
                },
                {
                    id: '3',
                    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 dag siden
                    automation_type: 'faktura',
                    user_name: 'Kunde C',
                    batch_id: '202501141500_GHI789',
                    request_id: 'req_125',
                    supplier: 'Shell',
                    file_count: 3,
                    status: 'completed',
                    time_saved_minutes: 15,
                    metadata: {}
                },
                {
                    id: '4',
                    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 dager siden
                    automation_type: 'faktura',
                    user_name: 'Kunde A',
                    batch_id: '202501131000_JKL012',
                    request_id: 'req_126',
                    supplier: 'Circle K',
                    file_count: 2,
                    status: 'completed',
                    time_saved_minutes: 10,
                    metadata: {}
                },
                {
                    id: '5',
                    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 dager siden
                    automation_type: 'prisliste_bring_transport',
                    user_name: 'Kunde D',
                    batch_id: '202501121400_MNO345',
                    request_id: 'req_127',
                    supplier: null,
                    file_count: 1,
                    status: 'completed',
                    time_saved_minutes: 10,
                    metadata: {}
                },
                {
                    id: '6',
                    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 1 uke siden
                    automation_type: 'faktura',
                    user_name: 'Kunde E',
                    batch_id: '202501051100_PQR678',
                    request_id: 'req_128',
                    supplier: 'Best',
                    file_count: 1,
                    status: 'completed',
                    time_saved_minutes: 5,
                    metadata: {}
                }
            ],
            error: null
        };
    }
    return { data: [], error: null };
}

// TODO: Erstatt med ekte Supabase setup når du har credentials
/*
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://your-project.supabase.co'
const SUPABASE_ANON_KEY = 'your-anon-key'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
*/