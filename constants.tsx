
import { ServiceNode, Connection, SchemaTable } from './types';

export const SYSTEM_NODES: ServiceNode[] = [
  { id: 'client', name: 'Web/Mobile Client', type: 'external', description: 'User interface for browsing and booking' },
  { id: 'lb', name: 'Load Balancer', type: 'gateway', description: 'NGINX / AWS ALB for traffic distribution' },
  { id: 'gateway', name: 'API Gateway', type: 'gateway', description: 'Authentication, Rate Limiting, Logging' },
  { id: 'user_svc', name: 'User Service', type: 'service', description: 'Profile, Auth, Preferences', technologies: ['Node.js', 'Go'] },
  { id: 'movie_svc', name: 'Movie Catalog Service', type: 'service', description: 'Search movies, theaters, and availability', technologies: ['ElasticSearch', 'Java'] },
  { id: 'booking_svc', name: 'Booking Service', type: 'service', description: 'Locking seats, creating reservations', technologies: ['Python', 'Redis'] },
  { id: 'payment_svc', name: 'Payment Service', type: 'service', description: 'Gateway integration, Ledger', technologies: ['Go', 'Stripe API'] },
  { id: 'notif_svc', name: 'Notification Service', type: 'service', description: 'SMS, Email, Push Notifications', technologies: ['Kafka', 'Twilio'] },
  { id: 'main_db', name: 'Transactional DB', type: 'database', description: 'PostgreSQL - Consistency for bookings' },
  { id: 'cache', name: 'Redis Cache', type: 'database', description: 'Session data & Seat Locking' },
  { id: 'search_db', name: 'ElasticSearch', type: 'database', description: 'Fast movie/theater searching' },
];

export const SYSTEM_CONNECTIONS: Connection[] = [
  { from: 'client', to: 'lb', label: 'HTTPS' },
  { from: 'lb', to: 'gateway', label: 'Internal' },
  { from: 'gateway', to: 'user_svc', label: 'gRPC' },
  { from: 'gateway', to: 'movie_svc', label: 'gRPC' },
  { from: 'gateway', to: 'booking_svc', label: 'gRPC' },
  { from: 'movie_svc', to: 'search_db', label: 'Query' },
  { from: 'booking_svc', to: 'cache', label: 'Distributed Lock' },
  { from: 'booking_svc', to: 'main_db', label: 'ACID Txn' },
  { from: 'booking_svc', to: 'payment_svc', label: 'Async/Sync' },
  { from: 'payment_svc', to: 'notif_svc', label: 'Event (Kafka)' },
];

export const SCHEMAS: SchemaTable[] = [
  {
    name: 'Cities/Theaters',
    columns: [
      { name: 'city_id', type: 'UUID', constraints: 'PK' },
      { name: 'name', type: 'VARCHAR(100)' },
      { name: 'theater_id', type: 'UUID', constraints: 'FK' },
    ]
  },
  {
    name: 'Movies/Shows',
    columns: [
      { name: 'movie_id', type: 'UUID', constraints: 'PK' },
      { name: 'title', type: 'VARCHAR(255)' },
      { name: 'show_id', type: 'UUID', constraints: 'FK' },
      { name: 'hall_id', type: 'UUID', constraints: 'FK' },
      { name: 'start_time', type: 'TIMESTAMP' },
    ]
  },
  {
    name: 'Bookings',
    columns: [
      { name: 'booking_id', type: 'UUID', constraints: 'PK' },
      { name: 'user_id', type: 'UUID', constraints: 'FK' },
      { name: 'show_id', type: 'UUID', constraints: 'FK' },
      { name: 'status', type: 'ENUM', constraints: 'PENDING, PAID, EXPIRED' },
      { name: 'seats', type: 'JSONB', constraints: 'Array of IDs' },
    ]
  },
  {
    name: 'Show_Seats (Critical)',
    columns: [
      { name: 'id', type: 'UUID', constraints: 'PK' },
      { name: 'show_id', type: 'UUID', constraints: 'FK' },
      { name: 'seat_number', type: 'VARCHAR(10)' },
      { name: 'status', type: 'INT', constraints: '0: Available, 1: Locked, 2: Booked' },
      { name: 'version', type: 'INT', constraints: 'Optimistic Locking' },
    ]
  }
];
