import Report from '../models/reportModel.js';
import SensorSecurite from '../models/sensorSecuriteModel.js';
import SensorTransport from '../models/sensorTransportModel.js';
import SensorDechet from '../models/sensorDechetModel.js';
import SensorEnergie from '../models/sensorEnergieModel.js';

const analyzeSensorData = async (Model, startDate, endDate) => {
  const data = await Model.find({
    lastUpdate: {
      $gte: startDate,
      $lte: endDate
    }
  });

  const totalReadings = data.length;
  const averageValue = data.reduce((acc, curr) => acc + curr.value, 0) / totalReadings;
  const statusCounts = data.reduce((acc, curr) => {
    acc[curr.status] = (acc[curr.status] || 0) + 1;
    return acc;
  }, {});

  return {
    totalReadings,
    averageValue,
    statusCounts,
    minValue: Math.min(...data.map(d => d.value)),
    maxValue: Math.max(...data.map(d => d.value))
  };
};

export const generateReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    const start = new Date(startDate);
    const end = new Date(endDate);

    const [securite, transport, dechet, energie] = await Promise.all([
      analyzeSensorData(SensorSecurite, start, end),
      analyzeSensorData(SensorTransport, start, end),
      analyzeSensorData(SensorDechet, start, end),
      analyzeSensorData(SensorEnergie, start, end)
    ]);

    const report = new Report({
      startDate: start,
      endDate: end,
      analysis: {
        securite,
        transport,
        dechet,
        energie
      },
      generatedBy: req.user._id // Assuming you have user authentication
    });

    await report.save();
    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .sort({ createdAt: -1 })
      .populate('generatedBy', 'name email');
    
    // Ensure we always return an array
    const reportsArray = Array.isArray(reports) ? reports : [];
    
    res.status(200).json(reportsArray);
  } catch (error) {
    console.error('Error in getAllReports:', error);
    res.status(500).json({ message: error.message, reports: [] });
  }
};

export const getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('generatedBy', 'name email');
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.status(200).json(report);
  } catch (error) {
    console.error('Error in getReportById:', error);
    res.status(500).json({ message: error.message });
  }
};

export const createReport = async (req, res) => {
  try {
    const reportData = {
      type: req.body.type,
      dateGeneration: new Date(),
      type_rapport: req.body.type_rapport,
      titre_rapport: req.body.titre_rapport,
      description: req.body.description,
      data: req.body.data || [],
      generatedBy: req.user?._id || '000000000000000000000000' // Default ObjectId if no user
    };

    const report = new Report(reportData);
    const savedReport = await report.save();
    
    res.status(201).json(savedReport);
  } catch (error) {
    console.error('Error in createReport:', error);
    res.status(400).json({ 
      message: error.message,
      details: error.errors // Include validation errors if any
    });
  }
};

export const updateReport = async (req, res) => {
  try {
    const updateData = {
      type: req.body.type,
      dateGeneration: new Date(),
      type_rapport: req.body.type_rapport,
      titre_rapport: req.body.titre_rapport,
      description: req.body.description,
      data: req.body.data || []
    };

    const report = await Report.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.status(200).json(report);
  } catch (error) {
    console.error('Error in updateReport:', error);
    res.status(400).json({ message: error.message });
  }
};

export const deleteReport = async (req, res) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id);
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.status(200).json({ message: 'Report deleted successfully' });
  } catch (error) {
    console.error('Error in deleteReport:', error);
    res.status(500).json({ message: error.message });
  }
}; 