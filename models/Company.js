import mongoose from 'mongoose';

const companySchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        
    },
    {
        timestamps: true,
    }
);

export const Company = mongoose.model('Company', companySchema);