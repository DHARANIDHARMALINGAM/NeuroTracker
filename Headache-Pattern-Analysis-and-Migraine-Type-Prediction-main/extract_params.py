import joblib
import json
import numpy as np
import os
from sklearn.svm import SVC

class NpEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        if isinstance(obj, np.floating):
            return float(obj)
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        return super(NpEncoder, self).default(obj)

model_path = r"models\best_model.pkl"

if os.path.exists(model_path):
    artifact = joblib.load(model_path)
    model = artifact["model"]
    
    print(f"Loaded model: {type(model)}")
    
    export_data = {
        "model_type": str(type(model)),
        "feature_names": artifact.get("feature_names", []),
        "classes": model.classes_.tolist(),
    }
    
    # Extract Scaler
    scaler = artifact.get("scaler")
    if scaler:
        export_data["scaler"] = {
            "mean": scaler.mean_.tolist(),
            "scale": scaler.scale_.tolist(),
        }
    
    # Extract Label Encoders
    encoders = artifact.get("label_encoders", {})
    export_data["encoders"] = {}
    for col, le in encoders.items():
        export_data["encoders"][col] = le.classes_.tolist()
    
    # Extract Model Parameters (SVM)
    if isinstance(model, SVC):
        export_data["kernel"] = model.kernel
        export_data["intercept"] = model.intercept_.tolist()
        export_data["n_support"] = model.n_support_.tolist() # CRITICAL for OVO
        
        if model.kernel == "linear":
            export_data["coef"] = model.coef_.tolist()
        else:
            export_data["gamma"] = float(model._gamma) if hasattr(model, "_gamma") else float(model.gamma)
            export_data["support_vectors"] = model.support_vectors_.tolist()
            export_data["dual_coef"] = model.dual_coef_.tolist()
            if hasattr(model, "probA_") and len(model.probA_) > 0:
                export_data["probA"] = model.probA_.tolist()
                export_data["probB"] = model.probB_.tolist()
    
    # Save to JSON
    with open("model_params.json", "w") as f:
        json.dump(export_data, f, indent=4, cls=NpEncoder)
    print("✅ Exported model parameters to model_params.json")
else:
    print("❌ Model file not found")
