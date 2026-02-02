-- ================================================================================
-- APPASAMY QC APPLICATION - COMPLETE DATABASE SCHEMA (v3)
-- ================================================================================
-- Database: PostgreSQL 14+
-- Version: 3.0 (Without Gate Entry)
-- Date: February 1, 2026
-- 
-- MODULES COVERED:
-- 1. Master Data (Categories, Groups, Units, Instruments, Vendors)
-- 2. Component Master (with Checking Parameters)
-- 3. QC Plans (with Stages & Parameters)
-- 4. GRN (Goods Receipt Note)
-- 5. QC Inspection (Queue, Results, Samples)
-- 6. Vendor Returns (with Approval Workflow)
-- 7. Workflow & Approvals
-- 8. Dashboard & Reports
-- ================================================================================


-- ================================================================================
-- SECTION 1: CORE MASTER TABLES
-- ================================================================================

-- 1.1 Product Categories
CREATE TABLE IF NOT EXISTS qc_product_categories (
    id SERIAL PRIMARY KEY,
    category_code VARCHAR(50) UNIQUE NOT NULL,
    category_name VARCHAR(100) NOT NULL,
    icon VARCHAR(20),
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100)
);

-- 1.2 Product Groups
CREATE TABLE IF NOT EXISTS qc_product_groups (
    id SERIAL PRIMARY KEY,
    category_id INTEGER NOT NULL REFERENCES qc_product_categories(id),
    group_code VARCHAR(50) UNIQUE NOT NULL,
    group_name VARCHAR(100) NOT NULL,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_pg_category ON qc_product_groups(category_id);

-- 1.3 Units of Measurement
CREATE TABLE IF NOT EXISTS qc_units (
    id SERIAL PRIMARY KEY,
    unit_code VARCHAR(20) UNIQUE NOT NULL,
    unit_name VARCHAR(100) NOT NULL,
    unit_symbol VARCHAR(20),
    unit_type VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 1.4 Measuring Instruments
CREATE TABLE IF NOT EXISTS qc_instruments (
    id SERIAL PRIMARY KEY,
    instrument_code VARCHAR(50) UNIQUE NOT NULL,
    instrument_name VARCHAR(200) NOT NULL,
    instrument_type VARCHAR(100),
    make VARCHAR(100),
    model VARCHAR(100),
    serial_number VARCHAR(100),
    calibration_due_date DATE,
    calibration_frequency_days INTEGER DEFAULT 365,
    location VARCHAR(200),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 1.5 Vendors/Suppliers Master
CREATE TABLE IF NOT EXISTS qc_vendors (
    id SERIAL PRIMARY KEY,
    vendor_code VARCHAR(50) UNIQUE NOT NULL,
    vendor_name VARCHAR(200) NOT NULL,
    vendor_type VARCHAR(50) DEFAULT 'supplier',
    contact_person VARCHAR(100),
    email VARCHAR(200),
    phone VARCHAR(50),
    mobile VARCHAR(50),
    address_line1 TEXT,
    address_line2 TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'India',
    pincode VARCHAR(20),
    gst_number VARCHAR(50),
    pan_number VARCHAR(20),
    is_approved BOOLEAN DEFAULT FALSE,
    approval_date DATE,
    approved_by VARCHAR(100),
    quality_rating DECIMAL(3,2),
    delivery_rating DECIMAL(3,2),
    odoo_partner_id INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 1.6 Sampling Plans (AQL)
CREATE TABLE IF NOT EXISTS qc_sampling_plans (
    id SERIAL PRIMARY KEY,
    plan_code VARCHAR(50) UNIQUE NOT NULL,
    plan_name VARCHAR(200) NOT NULL,
    aql_level VARCHAR(50),
    inspection_level VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 1.7 Sampling Plan Details (Lot Size -> Sample Size)
CREATE TABLE IF NOT EXISTS qc_sampling_plan_details (
    id SERIAL PRIMARY KEY,
    sampling_plan_id INTEGER NOT NULL REFERENCES qc_sampling_plans(id) ON DELETE CASCADE,
    lot_size_min INTEGER NOT NULL,
    lot_size_max INTEGER NOT NULL,
    sample_size INTEGER NOT NULL,
    accept_number INTEGER NOT NULL,
    reject_number INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_spd_plan ON qc_sampling_plan_details(sampling_plan_id);

-- 1.8 Defect Types Master
CREATE TABLE IF NOT EXISTS qc_defect_types (
    id SERIAL PRIMARY KEY,
    defect_code VARCHAR(50) UNIQUE NOT NULL,
    defect_name VARCHAR(200) NOT NULL,
    defect_category VARCHAR(50),
    severity_level INTEGER DEFAULT 1,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 1.9 Rejection Reasons Master
CREATE TABLE IF NOT EXISTS qc_rejection_reasons (
    id SERIAL PRIMARY KEY,
    reason_code VARCHAR(50) UNIQUE NOT NULL,
    reason_name VARCHAR(200) NOT NULL,
    reason_category VARCHAR(50),
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 1.10 Locations/Warehouses
CREATE TABLE IF NOT EXISTS qc_locations (
    id SERIAL PRIMARY KEY,
    location_code VARCHAR(50) UNIQUE NOT NULL,
    location_name VARCHAR(200) NOT NULL,
    location_type VARCHAR(50),
    parent_location_id INTEGER REFERENCES qc_locations(id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- ================================================================================
-- SECTION 2: QC PLANS
-- ================================================================================

-- 2.1 QC Plan Master
CREATE TABLE IF NOT EXISTS qc_plans (
    id SERIAL PRIMARY KEY,
    plan_code VARCHAR(50) UNIQUE NOT NULL,
    plan_name VARCHAR(200) NOT NULL,
    revision VARCHAR(20),
    revision_date DATE,
    effective_date DATE,
    plan_type VARCHAR(50) DEFAULT 'standard',
    inspection_stages INTEGER DEFAULT 1,
    document_number VARCHAR(100),
    document_path VARCHAR(500),
    approved_by VARCHAR(100),
    approved_date DATE,
    status VARCHAR(20) DEFAULT 'draft',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2.2 QC Plan Stages
CREATE TABLE IF NOT EXISTS qc_plan_stages (
    id SERIAL PRIMARY KEY,
    qc_plan_id INTEGER NOT NULL REFERENCES qc_plans(id) ON DELETE CASCADE,
    stage_code VARCHAR(50) NOT NULL,
    stage_name VARCHAR(100) NOT NULL,
    stage_sequence INTEGER NOT NULL,
    inspection_type VARCHAR(20) DEFAULT 'sampling',
    sampling_plan_id INTEGER REFERENCES qc_sampling_plans(id),
    is_mandatory BOOLEAN DEFAULT TRUE,
    requires_instrument BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(qc_plan_id, stage_code),
    UNIQUE(qc_plan_id, stage_sequence)
);
CREATE INDEX idx_qps_plan ON qc_plan_stages(qc_plan_id);

-- 2.3 QC Plan Parameters
CREATE TABLE IF NOT EXISTS qc_plan_parameters (
    id SERIAL PRIMARY KEY,
    qc_plan_stage_id INTEGER NOT NULL REFERENCES qc_plan_stages(id) ON DELETE CASCADE,
    parameter_code VARCHAR(50),
    parameter_name VARCHAR(200) NOT NULL,
    parameter_sequence INTEGER DEFAULT 0,
    specification TEXT,
    unit_id INTEGER REFERENCES qc_units(id),
    nominal_value DECIMAL(15,4),
    tolerance_min DECIMAL(15,4),
    tolerance_max DECIMAL(15,4),
    instrument_id INTEGER REFERENCES qc_instruments(id),
    input_type VARCHAR(20) DEFAULT 'measurement',
    is_mandatory BOOLEAN DEFAULT TRUE,
    acceptance_criteria TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_qpp_stage ON qc_plan_parameters(qc_plan_stage_id);


-- ================================================================================
-- SECTION 3: COMPONENT MASTER
-- ================================================================================

-- 3.1 Component Master
CREATE TABLE IF NOT EXISTS qc_component_master (
    id SERIAL PRIMARY KEY,
    component_code VARCHAR(50) UNIQUE NOT NULL,
    part_code VARCHAR(100) UNIQUE NOT NULL,
    part_name VARCHAR(300) NOT NULL,
    part_description TEXT,
    category_id INTEGER REFERENCES qc_product_categories(id),
    product_group_id INTEGER REFERENCES qc_product_groups(id),
    qc_plan_id INTEGER REFERENCES qc_plans(id),
    default_inspection_type VARCHAR(20) DEFAULT 'sampling',
    default_sampling_plan_id INTEGER REFERENCES qc_sampling_plans(id),
    drawing_no VARCHAR(100),
    drawing_revision VARCHAR(20),
    test_cert_required BOOLEAN DEFAULT FALSE,
    spec_required BOOLEAN DEFAULT FALSE,
    fqir_required BOOLEAN DEFAULT FALSE,
    coc_required BOOLEAN DEFAULT FALSE,
    pr_process_code VARCHAR(50),
    lead_time_days INTEGER,
    primary_vendor_id INTEGER REFERENCES qc_vendors(id),
    odoo_product_id INTEGER,
    odoo_product_tmpl_id INTEGER,
    skip_lot_enabled BOOLEAN DEFAULT FALSE,
    skip_lot_count INTEGER DEFAULT 0,
    skip_lot_threshold INTEGER DEFAULT 5,
    status VARCHAR(20) DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by VARCHAR(100)
);

CREATE INDEX idx_cm_part_code ON qc_component_master(part_code);
CREATE INDEX idx_cm_category ON qc_component_master(category_id);
CREATE INDEX idx_cm_qc_plan ON qc_component_master(qc_plan_id);
CREATE INDEX idx_cm_status ON qc_component_master(status) WHERE is_deleted = FALSE;

-- 3.2 Component Checking Parameters
CREATE TABLE IF NOT EXISTS qc_component_checking_params (
    id SERIAL PRIMARY KEY,
    component_id INTEGER NOT NULL REFERENCES qc_component_master(id) ON DELETE CASCADE,
    qc_plan_stage_id INTEGER REFERENCES qc_plan_stages(id),
    checking_point VARCHAR(200) NOT NULL,
    specification VARCHAR(500),
    unit_id INTEGER REFERENCES qc_units(id),
    unit_code VARCHAR(20),
    nominal_value DECIMAL(15,4),
    tolerance_min DECIMAL(15,4),
    tolerance_max DECIMAL(15,4),
    instrument_id INTEGER REFERENCES qc_instruments(id),
    instrument_name VARCHAR(200),
    input_type VARCHAR(20) DEFAULT 'measurement',
    sort_order INTEGER DEFAULT 0,
    is_mandatory BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_ccp_component ON qc_component_checking_params(component_id);

-- 3.3 Component Specifications
CREATE TABLE IF NOT EXISTS qc_component_specifications (
    id SERIAL PRIMARY KEY,
    component_id INTEGER NOT NULL REFERENCES qc_component_master(id) ON DELETE CASCADE,
    spec_key VARCHAR(100) NOT NULL,
    spec_value VARCHAR(500),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(component_id, spec_key)
);
CREATE INDEX idx_cs_component ON qc_component_specifications(component_id);

-- 3.4 Component Documents
CREATE TABLE IF NOT EXISTS qc_component_documents (
    id SERIAL PRIMARY KEY,
    component_id INTEGER NOT NULL REFERENCES qc_component_master(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL,
    file_name VARCHAR(300) NOT NULL,
    original_name VARCHAR(300),
    file_path VARCHAR(500),
    file_url VARCHAR(500),
    file_size INTEGER,
    mime_type VARCHAR(100),
    version VARCHAR(20) DEFAULT '1.0',
    is_current BOOLEAN DEFAULT TRUE,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    uploaded_by VARCHAR(100)
);
CREATE INDEX idx_cd_component ON qc_component_documents(component_id);

-- 3.5 Component Vendors
CREATE TABLE IF NOT EXISTS qc_component_vendors (
    id SERIAL PRIMARY KEY,
    component_id INTEGER NOT NULL REFERENCES qc_component_master(id) ON DELETE CASCADE,
    vendor_id INTEGER NOT NULL REFERENCES qc_vendors(id) ON DELETE CASCADE,
    is_primary BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT FALSE,
    approval_date DATE,
    vendor_part_code VARCHAR(100),
    unit_price DECIMAL(15,2),
    currency VARCHAR(10) DEFAULT 'INR',
    lead_time_days INTEGER,
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(component_id, vendor_id)
);
CREATE INDEX idx_cv_component ON qc_component_vendors(component_id);


-- ================================================================================
-- SECTION 4: GRN (GOODS RECEIPT NOTE)
-- ================================================================================

-- 4.1 GRN Master
CREATE TABLE IF NOT EXISTS qc_grn (
    id SERIAL PRIMARY KEY,
    grn_number VARCHAR(50) UNIQUE NOT NULL,
    grn_date DATE NOT NULL DEFAULT CURRENT_DATE,
    vendor_id INTEGER NOT NULL REFERENCES qc_vendors(id),
    po_number VARCHAR(100),
    po_date DATE,
    odoo_po_id INTEGER,
    invoice_number VARCHAR(100),
    invoice_date DATE,
    invoice_amount DECIMAL(15,2),
    dc_number VARCHAR(100),
    dc_date DATE,
    vehicle_number VARCHAR(50),
    receiving_location_id INTEGER REFERENCES qc_locations(id),
    status VARCHAR(20) DEFAULT 'draft',
    qc_status VARCHAR(20),
    maker_id VARCHAR(100),
    maker_date TIMESTAMP WITH TIME ZONE,
    checker_id VARCHAR(100),
    checker_date TIMESTAMP WITH TIME ZONE,
    approver_id VARCHAR(100),
    approver_date TIMESTAMP WITH TIME ZONE,
    odoo_picking_id INTEGER,
    odoo_sync_status VARCHAR(20),
    odoo_sync_date TIMESTAMP WITH TIME ZONE,
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100)
);

CREATE INDEX idx_grn_date ON qc_grn(grn_date DESC);
CREATE INDEX idx_grn_vendor ON qc_grn(vendor_id);
CREATE INDEX idx_grn_status ON qc_grn(status);
CREATE INDEX idx_grn_qc_status ON qc_grn(qc_status);

-- 4.2 GRN Line Items
CREATE TABLE IF NOT EXISTS qc_grn_items (
    id SERIAL PRIMARY KEY,
    grn_id INTEGER NOT NULL REFERENCES qc_grn(id) ON DELETE CASCADE,
    po_line_number INTEGER,
    odoo_po_line_id INTEGER,
    component_id INTEGER NOT NULL REFERENCES qc_component_master(id),
    part_code VARCHAR(100) NOT NULL,
    part_name VARCHAR(300),
    po_quantity DECIMAL(15,3),
    received_quantity DECIMAL(15,3) NOT NULL,
    accepted_quantity DECIMAL(15,3) DEFAULT 0,
    rejected_quantity DECIMAL(15,3) DEFAULT 0,
    uom VARCHAR(20) DEFAULT 'NOS',
    unit_price DECIMAL(15,4),
    line_amount DECIMAL(15,2),
    qc_status VARCHAR(20) DEFAULT 'pending',
    inspection_type VARCHAR(20),
    sample_size INTEGER,
    inspected_quantity INTEGER DEFAULT 0,
    batch_number VARCHAR(100),
    manufacturing_date DATE,
    expiry_date DATE,
    storage_location_id INTEGER REFERENCES qc_locations(id),
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_grni_grn ON qc_grn_items(grn_id);
CREATE INDEX idx_grni_component ON qc_grn_items(component_id);
CREATE INDEX idx_grni_qc_status ON qc_grn_items(qc_status);


-- ================================================================================
-- SECTION 5: QC INSPECTION
-- ================================================================================

-- 5.1 Inspection Queue
CREATE TABLE IF NOT EXISTS qc_inspection_queue (
    id SERIAL PRIMARY KEY,
    queue_number VARCHAR(50) UNIQUE NOT NULL,
    grn_id INTEGER NOT NULL REFERENCES qc_grn(id),
    grn_item_id INTEGER NOT NULL REFERENCES qc_grn_items(id),
    component_id INTEGER NOT NULL REFERENCES qc_component_master(id),
    qc_plan_id INTEGER REFERENCES qc_plans(id),
    lot_size INTEGER NOT NULL,
    sample_size INTEGER NOT NULL,
    inspection_type VARCHAR(20) NOT NULL,
    sampling_plan_id INTEGER REFERENCES qc_sampling_plans(id),
    priority INTEGER DEFAULT 5,
    assigned_to VARCHAR(100),
    assigned_date TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'pending',
    current_stage_id INTEGER REFERENCES qc_plan_stages(id),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    due_date DATE,
    is_overdue BOOLEAN DEFAULT FALSE,
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_iq_grn ON qc_inspection_queue(grn_id);
CREATE INDEX idx_iq_component ON qc_inspection_queue(component_id);
CREATE INDEX idx_iq_status ON qc_inspection_queue(status);
CREATE INDEX idx_iq_priority ON qc_inspection_queue(priority, created_at);

-- 5.2 Inspection Results
CREATE TABLE IF NOT EXISTS qc_inspection_results (
    id SERIAL PRIMARY KEY,
    result_number VARCHAR(50) UNIQUE NOT NULL,
    inspection_queue_id INTEGER NOT NULL REFERENCES qc_inspection_queue(id),
    qc_plan_stage_id INTEGER REFERENCES qc_plan_stages(id),
    stage_name VARCHAR(100),
    sample_number INTEGER DEFAULT 1,
    sample_size INTEGER,
    total_checked INTEGER DEFAULT 0,
    total_passed INTEGER DEFAULT 0,
    total_failed INTEGER DEFAULT 0,
    result VARCHAR(20),
    result_date TIMESTAMP WITH TIME ZONE,
    inspector_id VARCHAR(100),
    inspector_name VARCHAR(200),
    verified_by VARCHAR(100),
    verified_date TIMESTAMP WITH TIME ZONE,
    verification_remarks TEXT,
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ir_queue ON qc_inspection_results(inspection_queue_id);
CREATE INDEX idx_ir_result ON qc_inspection_results(result);

-- 5.3 Inspection Result Details
CREATE TABLE IF NOT EXISTS qc_inspection_result_details (
    id SERIAL PRIMARY KEY,
    inspection_result_id INTEGER NOT NULL REFERENCES qc_inspection_results(id) ON DELETE CASCADE,
    checking_param_id INTEGER REFERENCES qc_component_checking_params(id),
    qc_plan_param_id INTEGER REFERENCES qc_plan_parameters(id),
    parameter_name VARCHAR(200) NOT NULL,
    specification VARCHAR(500),
    unit_code VARCHAR(20),
    tolerance_min DECIMAL(15,4),
    tolerance_max DECIMAL(15,4),
    measured_value DECIMAL(15,4),
    measured_value_2 DECIMAL(15,4),
    measured_value_text VARCHAR(500),
    yes_no_result BOOLEAN,
    instrument_id INTEGER REFERENCES qc_instruments(id),
    instrument_code VARCHAR(50),
    is_within_tolerance BOOLEAN,
    result VARCHAR(20),
    defect_type_id INTEGER REFERENCES qc_defect_types(id),
    defect_remarks TEXT,
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ird_result ON qc_inspection_result_details(inspection_result_id);

-- 5.4 Inspection Defects
CREATE TABLE IF NOT EXISTS qc_inspection_defects (
    id SERIAL PRIMARY KEY,
    inspection_result_id INTEGER NOT NULL REFERENCES qc_inspection_results(id) ON DELETE CASCADE,
    defect_type_id INTEGER REFERENCES qc_defect_types(id),
    defect_code VARCHAR(50),
    defect_description TEXT,
    defect_quantity INTEGER DEFAULT 1,
    severity VARCHAR(20),
    image_url VARCHAR(500),
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_id_result ON qc_inspection_defects(inspection_result_id);


-- ================================================================================
-- SECTION 6: VENDOR RETURNS
-- ================================================================================

-- 6.1 Vendor Return Request
CREATE TABLE IF NOT EXISTS qc_vendor_returns (
    id SERIAL PRIMARY KEY,
    return_number VARCHAR(50) UNIQUE NOT NULL,
    return_date DATE NOT NULL DEFAULT CURRENT_DATE,
    grn_id INTEGER NOT NULL REFERENCES qc_grn(id),
    vendor_id INTEGER NOT NULL REFERENCES qc_vendors(id),
    return_type VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'draft',
    maker_id VARCHAR(100),
    maker_date TIMESTAMP WITH TIME ZONE,
    maker_remarks TEXT,
    checker_id VARCHAR(100),
    checker_date TIMESTAMP WITH TIME ZONE,
    checker_remarks TEXT,
    checker_action VARCHAR(20),
    approver_id VARCHAR(100),
    approver_date TIMESTAMP WITH TIME ZONE,
    approver_remarks TEXT,
    approver_action VARCHAR(20),
    shipped_date DATE,
    courier_name VARCHAR(200),
    tracking_number VARCHAR(100),
    debit_note_number VARCHAR(100),
    debit_note_date DATE,
    debit_note_amount DECIMAL(15,2),
    odoo_return_picking_id INTEGER,
    odoo_sync_status VARCHAR(20),
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100)
);

CREATE INDEX idx_vr_grn ON qc_vendor_returns(grn_id);
CREATE INDEX idx_vr_vendor ON qc_vendor_returns(vendor_id);
CREATE INDEX idx_vr_status ON qc_vendor_returns(status);

-- 6.2 Vendor Return Items
CREATE TABLE IF NOT EXISTS qc_vendor_return_items (
    id SERIAL PRIMARY KEY,
    vendor_return_id INTEGER NOT NULL REFERENCES qc_vendor_returns(id) ON DELETE CASCADE,
    grn_item_id INTEGER NOT NULL REFERENCES qc_grn_items(id),
    component_id INTEGER NOT NULL REFERENCES qc_component_master(id),
    part_code VARCHAR(100),
    part_name VARCHAR(300),
    return_quantity DECIMAL(15,3) NOT NULL,
    uom VARCHAR(20) DEFAULT 'NOS',
    rejection_reason_id INTEGER REFERENCES qc_rejection_reasons(id),
    rejection_reason_text TEXT,
    inspection_result_id INTEGER REFERENCES qc_inspection_results(id),
    unit_price DECIMAL(15,4),
    line_amount DECIMAL(15,2),
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_vri_return ON qc_vendor_return_items(vendor_return_id);


-- ================================================================================
-- SECTION 7: WORKFLOW & AUDIT
-- ================================================================================

-- 7.1 Workflow Definitions
CREATE TABLE IF NOT EXISTS qc_workflow_definitions (
    id SERIAL PRIMARY KEY,
    workflow_code VARCHAR(50) UNIQUE NOT NULL,
    workflow_name VARCHAR(200) NOT NULL,
    module VARCHAR(50) NOT NULL,
    requires_maker BOOLEAN DEFAULT TRUE,
    requires_checker BOOLEAN DEFAULT TRUE,
    requires_approver BOOLEAN DEFAULT TRUE,
    auto_approve_amount DECIMAL(15,2),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7.2 Approval History
CREATE TABLE IF NOT EXISTS qc_approval_history (
    id SERIAL PRIMARY KEY,
    module VARCHAR(50) NOT NULL,
    record_id INTEGER NOT NULL,
    action VARCHAR(50) NOT NULL,
    from_status VARCHAR(50),
    to_status VARCHAR(50),
    action_by VARCHAR(100) NOT NULL,
    action_by_name VARCHAR(200),
    action_role VARCHAR(50),
    action_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    remarks TEXT,
    action_data JSONB
);

CREATE INDEX idx_ah_module_record ON qc_approval_history(module, record_id);

-- 7.3 Component History
CREATE TABLE IF NOT EXISTS qc_component_history (
    id SERIAL PRIMARY KEY,
    component_id INTEGER NOT NULL REFERENCES qc_component_master(id) ON DELETE CASCADE,
    action VARCHAR(20) NOT NULL,
    field_name VARCHAR(100),
    old_value TEXT,
    new_value TEXT,
    change_reason TEXT,
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    changed_by VARCHAR(100)
);
CREATE INDEX idx_ch_component ON qc_component_history(component_id);

-- 7.4 System Audit Log
CREATE TABLE IF NOT EXISTS qc_audit_log (
    id SERIAL PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL,
    record_id INTEGER NOT NULL,
    action VARCHAR(20) NOT NULL,
    old_data JSONB,
    new_data JSONB,
    changed_fields TEXT[],
    user_id VARCHAR(100),
    user_name VARCHAR(200),
    user_ip VARCHAR(50),
    action_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_al_table_record ON qc_audit_log(table_name, record_id);


-- ================================================================================
-- SECTION 8: DASHBOARD
-- ================================================================================

-- 8.1 Daily Summary
CREATE TABLE IF NOT EXISTS qc_daily_summary (
    id SERIAL PRIMARY KEY,
    summary_date DATE NOT NULL UNIQUE,
    grn_count INTEGER DEFAULT 0,
    grn_pending INTEGER DEFAULT 0,
    inspections_completed INTEGER DEFAULT 0,
    inspections_pending INTEGER DEFAULT 0,
    pass_count INTEGER DEFAULT 0,
    fail_count INTEGER DEFAULT 0,
    pass_rate DECIMAL(5,2),
    returns_initiated INTEGER DEFAULT 0,
    returns_approved INTEGER DEFAULT 0,
    returns_amount DECIMAL(15,2) DEFAULT 0,
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8.2 Vendor Performance
CREATE TABLE IF NOT EXISTS qc_vendor_performance (
    id SERIAL PRIMARY KEY,
    vendor_id INTEGER NOT NULL REFERENCES qc_vendors(id),
    period_year INTEGER NOT NULL,
    period_month INTEGER NOT NULL,
    total_deliveries INTEGER DEFAULT 0,
    on_time_deliveries INTEGER DEFAULT 0,
    total_lots_inspected INTEGER DEFAULT 0,
    lots_accepted INTEGER DEFAULT 0,
    lots_rejected INTEGER DEFAULT 0,
    total_quantity DECIMAL(15,3) DEFAULT 0,
    accepted_quantity DECIMAL(15,3) DEFAULT 0,
    rejected_quantity DECIMAL(15,3) DEFAULT 0,
    acceptance_rate DECIMAL(5,2),
    on_time_rate DECIMAL(5,2),
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(vendor_id, period_year, period_month)
);


-- ================================================================================
-- SECTION 9: TRIGGERS
-- ================================================================================

-- Auto-generate Component Code
CREATE OR REPLACE FUNCTION fn_generate_component_code()
RETURNS TRIGGER AS $$
BEGIN
    SELECT 'COMP-' || LPAD((COALESCE(MAX(CAST(SUBSTRING(component_code FROM 6) AS INTEGER)), 0) + 1)::TEXT, 3, '0')
    INTO NEW.component_code FROM qc_component_master;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_component_code BEFORE INSERT ON qc_component_master
    FOR EACH ROW WHEN (NEW.component_code IS NULL) EXECUTE FUNCTION fn_generate_component_code();

-- Auto-generate GRN Number
CREATE OR REPLACE FUNCTION fn_generate_grn_number()
RETURNS TRIGGER AS $$
DECLARE yr VARCHAR(4); num INTEGER;
BEGIN
    yr := TO_CHAR(CURRENT_DATE, 'YYYY');
    SELECT COALESCE(MAX(CAST(SUBSTRING(grn_number FROM 10) AS INTEGER)), 0) + 1 INTO num
    FROM qc_grn WHERE grn_number LIKE 'GRN-' || yr || '-%';
    NEW.grn_number := 'GRN-' || yr || '-' || LPAD(num::TEXT, 5, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_grn_number BEFORE INSERT ON qc_grn
    FOR EACH ROW WHEN (NEW.grn_number IS NULL) EXECUTE FUNCTION fn_generate_grn_number();

-- Auto-generate Queue Number
CREATE OR REPLACE FUNCTION fn_generate_queue_number()
RETURNS TRIGGER AS $$
DECLARE yr VARCHAR(4); num INTEGER;
BEGIN
    yr := TO_CHAR(CURRENT_DATE, 'YYYY');
    SELECT COALESCE(MAX(CAST(SUBSTRING(queue_number FROM 9) AS INTEGER)), 0) + 1 INTO num
    FROM qc_inspection_queue WHERE queue_number LIKE 'QC-' || yr || '-%';
    NEW.queue_number := 'QC-' || yr || '-' || LPAD(num::TEXT, 5, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_queue_number BEFORE INSERT ON qc_inspection_queue
    FOR EACH ROW WHEN (NEW.queue_number IS NULL) EXECUTE FUNCTION fn_generate_queue_number();

-- Auto-generate Result Number
CREATE OR REPLACE FUNCTION fn_generate_result_number()
RETURNS TRIGGER AS $$
DECLARE yr VARCHAR(4); num INTEGER;
BEGIN
    yr := TO_CHAR(CURRENT_DATE, 'YYYY');
    SELECT COALESCE(MAX(CAST(SUBSTRING(result_number FROM 9) AS INTEGER)), 0) + 1 INTO num
    FROM qc_inspection_results WHERE result_number LIKE 'IR-' || yr || '-%';
    NEW.result_number := 'IR-' || yr || '-' || LPAD(num::TEXT, 5, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_result_number BEFORE INSERT ON qc_inspection_results
    FOR EACH ROW WHEN (NEW.result_number IS NULL) EXECUTE FUNCTION fn_generate_result_number();

-- Auto-generate Return Number
CREATE OR REPLACE FUNCTION fn_generate_return_number()
RETURNS TRIGGER AS $$
DECLARE yr VARCHAR(4); num INTEGER;
BEGIN
    yr := TO_CHAR(CURRENT_DATE, 'YYYY');
    SELECT COALESCE(MAX(CAST(SUBSTRING(return_number FROM 9) AS INTEGER)), 0) + 1 INTO num
    FROM qc_vendor_returns WHERE return_number LIKE 'VR-' || yr || '-%';
    NEW.return_number := 'VR-' || yr || '-' || LPAD(num::TEXT, 5, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_return_number BEFORE INSERT ON qc_vendor_returns
    FOR EACH ROW WHEN (NEW.return_number IS NULL) EXECUTE FUNCTION fn_generate_return_number();

-- Auto-update Timestamps
CREATE OR REPLACE FUNCTION fn_update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_cm_ts BEFORE UPDATE ON qc_component_master FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();
CREATE TRIGGER trg_grn_ts BEFORE UPDATE ON qc_grn FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();
CREATE TRIGGER trg_iq_ts BEFORE UPDATE ON qc_inspection_queue FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();
CREATE TRIGGER trg_vr_ts BEFORE UPDATE ON qc_vendor_returns FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();
CREATE TRIGGER trg_vnd_ts BEFORE UPDATE ON qc_vendors FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();


-- ================================================================================
-- SECTION 10: VIEWS
-- ================================================================================

CREATE OR REPLACE VIEW vw_component_list AS
SELECT c.id, c.component_code, c.part_code, c.part_name, c.status,
    cat.category_code AS product_category, pg.group_name AS product_group,
    qp.plan_code AS qc_plan_no, v.vendor_name AS primary_vendor,
    (SELECT COUNT(*) FROM qc_component_checking_params WHERE component_id = c.id AND is_active) AS checkpoints
FROM qc_component_master c
LEFT JOIN qc_product_categories cat ON c.category_id = cat.id
LEFT JOIN qc_product_groups pg ON c.product_group_id = pg.id
LEFT JOIN qc_plans qp ON c.qc_plan_id = qp.id
LEFT JOIN qc_vendors v ON c.primary_vendor_id = v.id
WHERE c.is_deleted = FALSE;

CREATE OR REPLACE VIEW vw_inspection_queue AS
SELECT iq.id, iq.queue_number, iq.status, iq.priority, iq.lot_size, iq.sample_size,
    g.grn_number, c.part_code, c.part_name, v.vendor_name, iq.assigned_to, iq.due_date
FROM qc_inspection_queue iq
JOIN qc_grn g ON iq.grn_id = g.id
JOIN qc_component_master c ON iq.component_id = c.id
LEFT JOIN qc_vendors v ON g.vendor_id = v.id
WHERE iq.status != 'completed';

CREATE OR REPLACE VIEW vw_grn_list AS
SELECT g.id, g.grn_number, g.grn_date, g.status, g.qc_status, g.po_number,
    v.vendor_name, COUNT(gi.id) AS line_count, SUM(gi.received_quantity) AS total_qty
FROM qc_grn g
JOIN qc_vendors v ON g.vendor_id = v.id
LEFT JOIN qc_grn_items gi ON g.id = gi.grn_id
GROUP BY g.id, v.vendor_name;


-- ================================================================================
-- SECTION 11: MASTER DATA
-- ================================================================================

INSERT INTO qc_product_categories (category_code, category_name, icon, sort_order) VALUES
('mechanical', 'Mechanical', '⚙️', 1),
('electrical', 'Electrical', '⚡', 2),
('plastic', 'Plastic', '🧪', 3),
('electronics', 'Electronics', '🔌', 4),
('optical', 'Optical', '🔍', 5)
ON CONFLICT DO NOTHING;

INSERT INTO qc_units (unit_code, unit_name, unit_symbol, unit_type) VALUES
('mm', 'Millimeter', 'mm', 'length'),
('g', 'Gram', 'g', 'weight'),
('nos', 'Numbers', 'nos', 'count'),
('ohm', 'Ohm', 'Ω', 'electrical'),
('V', 'Volt', 'V', 'electrical')
ON CONFLICT DO NOTHING;

INSERT INTO qc_sampling_plans (plan_code, plan_name, aql_level, inspection_level) VALUES
('SP-001', 'Critical - Level I', '1.0', 'Level I'),
('SP-002', 'Electrical - Level II', '0.65', 'Level II'),
('SP-003', 'Visual - Standard', '2.5', 'Level III')
ON CONFLICT DO NOTHING;

INSERT INTO qc_plans (plan_code, plan_name, revision, status) VALUES
('RD.7.3-01', 'B-SCAN Probe QC Plan', 'Rev 3', 'active'),
('RD.7.3-02', 'Display Module QC Plan', 'Rev 2', 'active'),
('RD.7.3-03', 'Cable Assembly QC Plan', 'Rev 4', 'active')
ON CONFLICT DO NOTHING;

INSERT INTO qc_instruments (instrument_code, instrument_name, instrument_type) VALUES
('INST-001', 'Vernier Caliper', 'Dimensional'),
('INST-002', 'Multimeter', 'Electrical'),
('INST-003', 'Digital Scale', 'Weight')
ON CONFLICT DO NOTHING;

INSERT INTO qc_vendors (vendor_code, vendor_name, city, is_approved) VALUES
('VND-001', 'Precision Components Ltd', 'Chennai', TRUE),
('VND-002', 'ElectroCables India', 'Bangalore', TRUE),
('VND-003', 'TechDisplay Corp', 'Hyderabad', TRUE)
ON CONFLICT DO NOTHING;

INSERT INTO qc_defect_types (defect_code, defect_name, defect_category, severity_level) VALUES
('DEF-001', 'Scratch', 'visual', 2),
('DEF-002', 'Dimension Out of Spec', 'dimensional', 3),
('DEF-003', 'Continuity Failure', 'electrical', 3)
ON CONFLICT DO NOTHING;

INSERT INTO qc_rejection_reasons (reason_code, reason_name, reason_category) VALUES
('REJ-001', 'Visual Defect', 'quality'),
('REJ-002', 'Dimensional Failure', 'quality'),
('REJ-003', 'Functional Failure', 'quality')
ON CONFLICT DO NOTHING;

INSERT INTO qc_locations (location_code, location_name, location_type) VALUES
('LOC-QC', 'QC Inspection Area', 'qc_area'),
('LOC-REJ', 'Rejection Area', 'rejection_area'),
('LOC-STORE', 'Main Store', 'warehouse')
ON CONFLICT DO NOTHING;


-- ================================================================================
-- VERIFY
-- ================================================================================
SELECT 'QC Schema v3 Created Successfully!' AS status;
SELECT COUNT(*) AS total_tables FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name LIKE 'qc_%';

-- ================================================================================
-- END OF SCHEMA v3 (Without Gate Entry)
-- ================================================================================
