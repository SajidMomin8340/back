import express from 'express';
import { Drum } from '../models/drummodel.js';
import { Company } from '../models/Company.js';

const router = express.Router();

// Route to save new Drum item
router.post('/', async (request, response) => {
    try {
        const { date, invoice_no, credit, debit, balance, vehicle_no, company_id } = request.body;
        if (!date || !invoice_no || !credit || !debit || !balance || !vehicle_no || !company_id) {
            return response.status(400).send({
                message: 'Send all required fields: Date, Invoice No, Credit, Debit, Balance, Vehicle No, Company ID',
            });
        }

        const company = await Company.findById(company_id);
        if (!company) {
            return response.status(404).send({
                message: 'Company Not Found',
            });
        }

        const newItem = { date, invoice_no, credit, debit, balance, vehicle_no, company: company_id };
        const item = await Drum.create(newItem);
        return response.status(201).send(item);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Retrieve all Drums with company names (general route)/*
router.get('/items', async (request, response) => {
    try {
     
        const items = await Drum.find({ balance: { $gt: 200 } }).populate('company', 'name');
        return response.status(200).json({ count: items.length, data: items });
    } catch (error) {
        console.log(error.message);
        return response.status(500).send({ message: error.message });
    }
});

// Retrieve Drums by company ID
router.get('/', async (request, response) => {
    try {
        const { companyId } = request.query; // Assuming companyId is passed as a query parameter
        const items = await Drum.find({ company: companyId }).populate('company', 'name');
        return response.status(200).json({ count: items.length, data: items });
    } catch (error) {
        console.log(error.message);
        return response.status(500).send({ message: error.message });
    }
});


// Retrieve a specific Drum by ID with company name
router.get('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const item = await Drum.findById(id).populate('company', 'name'); // Populating the company name
        if (!item) {
            return response.status(404).json({ message: 'Drum Not Found' });
        }
        return response.status(200).json(item);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Update a Drum
router.put('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const { date, invoice_no, credit, debit, balance, vehicle_no, company_id } = request.body;
        if (!date || !invoice_no || !credit || !debit || !balance || !vehicle_no || !company_id) {
            return response.status(400).send({
                message: 'Send all required fields: Date, Invoice No, Credit, Debit, Balance, Vehicle No, Company ID',
            });
        }

        const company = await Company.findById(company_id);
        if (!company) {
            return response.status(404).send({
                message: 'Company Not Found',
            });
        }

        const updatedItem = { date, invoice_no, credit, debit, balance, vehicle_no, company: company_id };
        const result = await Drum.findByIdAndUpdate(id, updatedItem, { new: true });
        if (!result) {
            return response.status(404).json({ message: 'Drum Not Found' });
        }
        return response.status(200).send({ message: 'Drum Updated Successfully', result });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Delete a Drum
router.delete('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const result = await Drum.findByIdAndDelete(id);
        if (!result) {
            return response.status(404).json({ message: 'Drum Not Found' });
        }
        return response.status(200).send({ message: 'Drum Deleted Successfully' });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

export default router;
