-- Smart Contracts Schema
-- Create tables for smart contract management

-- Smart Contract Projects table
CREATE TABLE IF NOT EXISTS smart_contract_projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    project_name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    version VARCHAR(50),
    last_deployed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Smart Contract Versions table
CREATE TABLE IF NOT EXISTS smart_contract_versions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES smart_contract_projects(id) ON DELETE CASCADE,
    version VARCHAR(50) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'draft', -- draft, compile_queued, compiled, deployed, failed
    compile_type VARCHAR(50) DEFAULT 'standard',
    compiler_settings JSONB,
    packages TEXT[],
    contract_files JSONB,
    artifacts JSONB,
    slither_file TEXT,
    last_compiled_at TIMESTAMPTZ,
    last_deployed_at TIMESTAMPTZ,
    latest_error TEXT,
    vulnerabilities INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(project_id, version)
);

-- Deployed Smart Contracts table
CREATE TABLE IF NOT EXISTS deployed_smart_contracts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES smart_contract_projects(id) ON DELETE CASCADE,
    version_id UUID REFERENCES smart_contract_versions(id) ON DELETE CASCADE,
    contract_address VARCHAR(42) NOT NULL UNIQUE,
    contract_name VARCHAR(255) NOT NULL,
    deployment_id VARCHAR(255),
    deployment_params JSONB,
    wallet_address VARCHAR(42) NOT NULL,
    wallet_type VARCHAR(50) NOT NULL, -- organisation, end_user, non_custodial
    transaction_hash VARCHAR(66),
    deploy_gas_used BIGINT,
    total_gas_used BIGINT,
    deployed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Smart Contract Webhooks table
CREATE TABLE IF NOT EXISTS smart_contract_webhooks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    version_id UUID REFERENCES smart_contract_versions(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'active', -- active, inactive
    capture_anonymous BOOLEAN DEFAULT FALSE,
    subscribed_events JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Smart Contract Interactions table (for tracking calls/executions)
CREATE TABLE IF NOT EXISTS smart_contract_interactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    contract_id UUID REFERENCES deployed_smart_contracts(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    interaction_type VARCHAR(20) NOT NULL, -- call, execute
    method_name VARCHAR(255) NOT NULL,
    parameters JSONB,
    wallet_address VARCHAR(42),
    transaction_hash VARCHAR(66),
    gas_used BIGINT,
    result JSONB,
    status VARCHAR(20) DEFAULT 'pending', -- pending, success, failed
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance (safe to run multiple times)
CREATE INDEX IF NOT EXISTS idx_smart_contract_projects_tenant_id ON smart_contract_projects(tenant_id);
CREATE INDEX IF NOT EXISTS idx_smart_contract_projects_slug ON smart_contract_projects(slug);
CREATE INDEX IF NOT EXISTS idx_smart_contract_versions_project_id ON smart_contract_versions(project_id);
CREATE INDEX IF NOT EXISTS idx_deployed_smart_contracts_address ON deployed_smart_contracts(contract_address);
CREATE INDEX IF NOT EXISTS idx_deployed_smart_contracts_project_id ON deployed_smart_contracts(project_id);
CREATE INDEX IF NOT EXISTS idx_smart_contract_interactions_contract_id ON smart_contract_interactions(contract_id);
CREATE INDEX IF NOT EXISTS idx_smart_contract_interactions_tenant_id ON smart_contract_interactions(tenant_id);

-- Enable RLS
ALTER TABLE smart_contract_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE smart_contract_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE deployed_smart_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE smart_contract_webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE smart_contract_interactions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies before creating new ones
DROP POLICY IF EXISTS "Users can manage their own smart contract projects" ON smart_contract_projects;
DROP POLICY IF EXISTS "Users can manage versions of their projects" ON smart_contract_versions;
DROP POLICY IF EXISTS "Users can view their deployed contracts" ON deployed_smart_contracts;
DROP POLICY IF EXISTS "Users can manage webhooks for their versions" ON smart_contract_webhooks;
DROP POLICY IF EXISTS "Users can view their contract interactions" ON smart_contract_interactions;

-- RLS Policies
CREATE POLICY "Users can manage their own smart contract projects" ON smart_contract_projects
    FOR ALL USING (auth.uid() = tenant_id);

CREATE POLICY "Users can manage versions of their projects" ON smart_contract_versions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM smart_contract_projects 
            WHERE id = smart_contract_versions.project_id 
            AND tenant_id = auth.uid()
        )
    );

CREATE POLICY "Users can view their deployed contracts" ON deployed_smart_contracts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM smart_contract_projects 
            WHERE id = deployed_smart_contracts.project_id 
            AND tenant_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage webhooks for their versions" ON smart_contract_webhooks
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM smart_contract_versions sv
            JOIN smart_contract_projects sp ON sv.project_id = sp.id
            WHERE sv.id = smart_contract_webhooks.version_id 
            AND sp.tenant_id = auth.uid()
        )
    );

CREATE POLICY "Users can view their contract interactions" ON smart_contract_interactions
    FOR ALL USING (auth.uid() = tenant_id);

-- Create updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing triggers before creating new ones
DROP TRIGGER IF EXISTS update_smart_contract_projects_updated_at ON smart_contract_projects;
DROP TRIGGER IF EXISTS update_smart_contract_versions_updated_at ON smart_contract_versions;
DROP TRIGGER IF EXISTS update_smart_contract_webhooks_updated_at ON smart_contract_webhooks;

-- Add updated_at triggers
CREATE TRIGGER update_smart_contract_projects_updated_at 
    BEFORE UPDATE ON smart_contract_projects 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_smart_contract_versions_updated_at 
    BEFORE UPDATE ON smart_contract_versions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_smart_contract_webhooks_updated_at 
    BEFORE UPDATE ON smart_contract_webhooks 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
