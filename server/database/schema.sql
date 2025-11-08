-- ParkFlow Database Schema for Supabase
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  phone VARCHAR(20),
  vehicle_number VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Parking lots table
CREATE TABLE IF NOT EXISTS parking_lots (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  location TEXT NOT NULL,
  capacity INTEGER NOT NULL,
  current_occupancy INTEGER DEFAULT 0,
  predicted_occupancy INTEGER DEFAULT 0,
  price_per_hour DECIMAL(10, 2) NOT NULL,
  confidence INTEGER DEFAULT 80,
  distance DECIMAL(10, 2),
  coordinates JSONB,
  features TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT occupancy_check CHECK (current_occupancy >= 0 AND current_occupancy <= capacity)
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  lot_id VARCHAR(50) REFERENCES parking_lots(id) ON DELETE CASCADE,
  lot_name VARCHAR(255),
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  duration INTEGER NOT NULL,
  vehicle_number VARCHAR(20) NOT NULL,
  payment_method VARCHAR(50) DEFAULT 'upi',
  total_price DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  slot_number VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  cancelled_at TIMESTAMP WITH TIME ZONE
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  transaction_id VARCHAR(100) UNIQUE NOT NULL,
  status VARCHAR(20) DEFAULT 'success' CHECK (status IN ('success', 'failed', 'pending')),
  processed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Refunds table
CREATE TABLE IF NOT EXISTS refunds (
  id SERIAL PRIMARY KEY,
  booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  reason TEXT,
  refund_id VARCHAR(100) UNIQUE NOT NULL,
  status VARCHAR(20) DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
  initiated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  estimated_completion TIMESTAMP WITH TIME ZONE
);

-- Predictions table
CREATE TABLE IF NOT EXISTS predictions (
  id SERIAL PRIMARY KEY,
  lot_id VARCHAR(50) REFERENCES parking_lots(id) ON DELETE CASCADE,
  predicted_occupancy INTEGER NOT NULL,
  predicted_available INTEGER NOT NULL,
  confidence INTEGER NOT NULL,
  message TEXT,
  factors JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily revenue table (for analytics)
CREATE TABLE IF NOT EXISTS daily_revenue (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  revenue DECIMAL(10, 2) NOT NULL DEFAULT 0,
  bookings_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_lot_id ON bookings(lot_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_predictions_lot_id ON predictions(lot_id);
CREATE INDEX IF NOT EXISTS idx_predictions_created_at ON predictions(created_at DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_parking_lots_updated_at BEFORE UPDATE ON parking_lots
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample parking lots
INSERT INTO parking_lots (id, name, location, capacity, current_occupancy, predicted_occupancy, price_per_hour, confidence, distance, coordinates, features) VALUES
('lot-001', 'Central Plaza Parking', 'Connaught Place, New Delhi', 150, 98, 105, 50.00, 87, 0.8, '{"lat": 28.6315, "lng": 77.2167}', ARRAY['covered', 'security', 'evCharging']),
('lot-002', 'Mall Road Parking Hub', 'Saket, New Delhi', 200, 145, 160, 40.00, 92, 2.3, '{"lat": 28.5244, "lng": 77.2066}', ARRAY['covered', 'evCharging']),
('lot-003', 'Metro Station Parking', 'Rajiv Chowk, New Delhi', 100, 45, 50, 30.00, 78, 1.5, '{"lat": 28.6328, "lng": 77.2197}', ARRAY['security']),
('lot-004', 'Business District Parking', 'Nehru Place, New Delhi', 180, 162, 170, 60.00, 95, 3.5, '{"lat": 28.5494, "lng": 77.2501}', ARRAY['covered', 'security', 'evCharging']),
('lot-005', 'Airport Express Parking', 'Aerocity, New Delhi', 250, 120, 130, 45.00, 85, 5.2, '{"lat": 28.5562, "lng": 77.0999}', ARRAY['covered', 'evCharging', 'security'])
ON CONFLICT (id) DO NOTHING;

-- Insert sample daily revenue data
INSERT INTO daily_revenue (date, revenue, bookings_count) VALUES
(CURRENT_DATE - INTERVAL '6 days', 4500, 45),
(CURRENT_DATE - INTERVAL '5 days', 5200, 52),
(CURRENT_DATE - INTERVAL '4 days', 4800, 48),
(CURRENT_DATE - INTERVAL '3 days', 6100, 61),
(CURRENT_DATE - INTERVAL '2 days', 7200, 72),
(CURRENT_DATE - INTERVAL '1 day', 8500, 85),
(CURRENT_DATE, 7800, 78)
ON CONFLICT (date) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies (adjust based on your auth setup)
-- Allow public read access to parking lots
CREATE POLICY "Public parking lots read" ON parking_lots
  FOR SELECT USING (true);

-- Allow authenticated users to create bookings
CREATE POLICY "Users can create bookings" ON bookings
  FOR INSERT WITH CHECK (true);

-- Allow users to read their own bookings
CREATE POLICY "Users can read own bookings" ON bookings
  FOR SELECT USING (true);

-- Allow users to update their own bookings
CREATE POLICY "Users can update own bookings" ON bookings
  FOR UPDATE USING (true);

-- Allow public read access to predictions
CREATE POLICY "Public predictions read" ON predictions
  FOR SELECT USING (true);

COMMENT ON TABLE users IS 'Registered users of the ParkFlow system';
COMMENT ON TABLE parking_lots IS 'Available parking lots with capacity and pricing information';
COMMENT ON TABLE bookings IS 'Parking slot bookings made by users';
COMMENT ON TABLE payments IS 'Payment transactions for bookings';
COMMENT ON TABLE predictions IS 'AI-generated occupancy predictions';
COMMENT ON TABLE daily_revenue IS 'Daily revenue aggregation for analytics';
