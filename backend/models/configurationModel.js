import mongoose from 'mongoose';

const configurationSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    seuil_energie: { type: Number, required: true },
    debut_pointe: { type: String, required: true },
    fin_pointe: { type: String, required: true },
    matin_pointe: { type: String, required: true },
    soir_pointe: { type: String, required: true },
    intervalle_trafic: { type: Number, required: true },
    seuil_dechet: { type: Number, required: true },
    frequence_deche: { type: String, required: true },
    temps_collect_dechet: { type: String, required: true },
    seuil_securite: { type: Number, required: true },
    frequence_controle_securite: { type: String, required: true },
    niveau_critique_securite: { type: String, required: true }
  },
  {
    timestamps: true,
  }
);

const Configuration = mongoose.model('Configuration', configurationSchema);
export default Configuration;