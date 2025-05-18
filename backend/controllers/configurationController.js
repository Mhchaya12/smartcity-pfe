import Configuration from '../models/configurationModel.js';

export const createConfiguration = async (req, res) => {
  try {
    const { type, parameters, thresholds } = req.body;
    
    const configuration = new Configuration({
      type,
      parameters,
      thresholds,
      createdBy: req.user._id // Assuming you have user authentication
    });

    await configuration.save();
    res.status(201).json(configuration);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getConfigurations = async (req, res) => {
  try {
    const configurations = await Configuration.find();
    res.status(200).json(configurations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateConfiguration = async (req, res) => {
  try {
    const { id } = req.params;
    const { parameters, thresholds } = req.body;

    const configuration = await Configuration.findById(id);
    if (!configuration) {
      return res.status(404).json({ message: 'Configuration not found' });
    }

    configuration.parameters = parameters;
    configuration.thresholds = thresholds;
    configuration.updatedAt = new Date();

    await configuration.save();
    res.status(200).json(configuration);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteConfiguration = async (req, res) => {
  try {
    const { id } = req.params;
    const configuration = await Configuration.findByIdAndDelete(id);
    
    if (!configuration) {
      return res.status(404).json({ message: 'Configuration not found' });
    }

    res.status(200).json({ message: 'Configuration deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 