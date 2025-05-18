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

export const getReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .sort({ createdAt: -1 })
      .populate('generatedBy', 'name email');
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    res.status(500).json({ message: error.message });
  }
}; 