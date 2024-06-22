import mongoose from 'mongoose';

const drumSchema = mongoose.Schema(
    {
        date: {
            type: Date,
            required: true,
        },
        invoice_no: {
            type: Number,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        credit: {
            type: Number,
            required: true,
        },
        debit: {
            type: Number,
            required: true,
        },
        balance: {
            type: Number,
            required: true,
        },
        vehicle_no: {
            type: String,
            required: true,
        },
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company',
            required: true
        }
    },
    {
        timestamps: true,
    }
);

export const Drum = mongoose.model('Drum', drumSchema)