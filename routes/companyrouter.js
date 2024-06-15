import express from 'express';
import { Company } from '../models/Company.js'; // Adjust the path as necessary

const router = express.Router();
router.post('/', async (request, response) => {
    try {
        const { name } = request.body;
        if (!name) {
            return response.status(400).send({
                message: 'Send all required fields: Name',
            });
        }

        const newCompany = new Company({ name });
        const company = await newCompany.save();
        return response.status(201).send(company);
    } catch (error) {
        console.log(error.message);
        return response.status(500).send({ message: error.message });
    }
});

// Retrieve all companies
router.get('/', async (request, response) => {
    try {
        const companies = await Company.find({});
        return response.status(200).json({ count: companies.length, data: companies });
    } catch (error) {
        console.log(error.message);
        return response.status(500).send({ message: error.message });
    }
});

// Retrieve a specific company by ID
router.get('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const company = await Company.findById(id);
        if (!company) {
            return response.status(404).json({ message: 'Company Not Found' });
        }
        return response.status(200).json(company);
    } catch (error) {
        console.log(error.message);
        return response.status(500).send({ message: error.message });
    }
});

// Update a company
router.put('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const { name } = request.body;
        if (!name) {
            return response.status(400).send({
                message: 'Send all required fields: Name',
            });
        }

        const company = await Company.findByIdAndUpdate(id, { name }, { new: true });
        if (!company) {
            return response.status(404).json({ message: 'Company Not Found' });
        }
        return response.status(200).send({ message: 'Company Updated Successfully', company });
    } catch (error) {
        console.log(error.message);
        return response.status(500).send({ message: error.message });
    }
});

// Delete a company
router.delete('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const company = await Company.findByIdAndDelete(id);
        if (!company) {
            return response.status(404).json({ message: 'Company Not Found' });
        }
        return response.status(200).send({ message: 'Company Deleted Successfully' });
    } catch (error) {
        console.log(error.message);
        return response.status(500).send({ message: error.message });
    }
});

export default router;