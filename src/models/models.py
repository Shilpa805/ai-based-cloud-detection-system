import torch
import torch.nn as nn
from torchvision.models import resnet50, ResNet50_Weights
from torchvision.models import vgg19, VGG19_Weights

def get_resnet50(num_classes=4):
    model = resnet50(weights=ResNet50_Weights.DEFAULT)
    # Replace the last layer for classification
    num_ftrs = model.fc.in_features
    model.fc = nn.Linear(num_ftrs, num_classes)
    return model

def get_vgg19(num_classes=4):
    model = vgg19(weights=VGG19_Weights.DEFAULT)
    # Replace the classifier's last layer
    num_ftrs = model.classifier[6].in_features
    model.classifier[6] = nn.Linear(num_ftrs, num_classes)
    return model

def load_classification_model(model_name="resnet50", num_classes=4):
    """
    Factory function to load models dynamically.
    """
    if model_name == "resnet50":
        return get_resnet50(num_classes)
    elif model_name == "vgg19":
        return get_vgg19(num_classes)
    else:
        raise ValueError(f"Model {model_name} not implemented yet.")
