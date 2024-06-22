import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import nodemailer from 'nodemailer';
import cron from 'node-cron';
import { PORT, mongoDBURL, emailConfig } from './config.js';
import itemsRoute from './routes/itemsRoute.js';
import companyrouter from './routes/companyrouter.js';
import { Drum } from './models/drummodel.js'; // Import Drum model

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.get('/', (req, res) => {
  return res.status(200).send('Welcome to Visa Chemical');
});

app.use('/items', itemsRoute);
app.use('/company', companyrouter);

// MongoDB connection
mongoose.connect(mongoDBURL, {
    useNewUrlParser: true,  // No longer necessary in MongoDB Node.js Driver version 4.0.0+
    useUnifiedTopology: true // No longer necessary in MongoDB Node.js Driver version 4.0.0+
  })
  .then(() => {
    console.log('App connected to database');
  
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on Port ${PORT}`);
    });
  
    // Schedule email sending task every day at 8:20 PM
    cron.schedule('30 07 * * *', async () => {
      console.log('Sending email at 7:30 PM');
      try {
        const highBalanceItems = await Drum.find({ balance: { $gt: 200 } }).populate('company');
        sendEmail(highBalanceItems);
      } catch (error) {
        console.error('Error fetching items from MongoDB:', error);
      }
    });
  })
  .catch((error) => {
    console.log('Error connecting to database:', error);
  });
  

// Function to send email
const sendEmail = (items) => {
  // Filter out items where company is null or undefined and balance <= 200
  const filteredItems = items.filter(item => item.company && item.balance > 200);

  // Create transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailConfig.user,
      pass: emailConfig.pass
    }
  });

  // Prepare email content
  const mailOptions = {
    from: emailConfig.user,
    to: 'sajidmomin8340@gmail.com', // Replace with recipient email address
    subject: 'High Balance Items Report',
    html: `<p>Here Are Today's High Balance Items with Balance > 200:</p>
           <table border="1">
             <thead>
               <tr>
                 <th>Company Name</th>
                 <th>Date</th>
                 <th>Invoice Number</th>
                 <th>Type</th>
                 <th>Credit</th>
                 <th>Debit</th>
                 <th>Balance</th>
                 <th>Vehicle Number</th>
               </tr>
             </thead>
             <tbody>
               ${filteredItems.map(item => (
                 `<tr>
                    <td>${item.company.name}</td>
                    <td>${formatDate(item.date)}</td>
                    <td>${item.invoice_no}</td>
                    <td>${item.type}</td>
                    <td>${item.credit}</td>
                    <td>${item.debit}</td>
                    <td>${item.balance}</td>
                    <td>${item.vehicle_no}</td>
                  </tr>`
               )).join('')}
             </tbody>
           </table>`
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

// Helper function to format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};



export default app;
