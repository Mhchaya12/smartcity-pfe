import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import * as reportController from '../controllers/reportController.js';

const router = express.Router();

// Route pour initialiser la base de données avec des rapports
router.get(
  '/seed',
  expressAsyncHandler(async (req, res) => {
    try {
      await Report.deleteMany({});
      const createdReports = await Report.insertMany(data.reports);
      res.send({ createdReports });
    } catch (error) {
      res.status(500).send({ message: 'Error during seed process', error: error.message });
    }
  })
);

// Get all reports
router.get('/', expressAsyncHandler(reportController.getAllReports));

// Get single report
router.get('/:id', expressAsyncHandler(reportController.getReportById));

// Create new report
router.post('/', expressAsyncHandler(reportController.createReport));

// Update report
router.put('/:id', expressAsyncHandler(reportController.updateReport));

// Delete report
router.delete('/:id', expressAsyncHandler(reportController.deleteReport));

export default router; 