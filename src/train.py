import torch
import torch.nn as nn
import torch.optim as optim
from models.models import load_classification_model
from data_loader import get_dataloaders
from tqdm import tqdm
import os

def train_model(data_dir, model_name="resnet50", num_epochs=10, batch_size=32, device="cuda"):
    device = torch.device(device if torch.cuda.is_available() else "cpu")
    print(f"Training leveraging {device}...")
    
    if not os.path.exists(data_dir):
        print(f"Directory {data_dir} not found. Please ensure it exists with class subfolders.")
        return

    dataloader, classes = get_dataloaders(data_dir, batch_size)
    num_classes = len(classes)
    
    model = load_classification_model(model_name, num_classes).to(device)
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=0.001)
    
    for epoch in range(num_epochs):
        model.train()
        running_loss = 0.0
        print(f"Epoch {epoch+1}/{num_epochs}")
        
        for inputs, labels in tqdm(dataloader):
            inputs, labels = inputs.to(device), labels.to(device)
            
            optimizer.zero_grad()
            outputs = model(inputs)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
            running_loss += loss.item()
            
        print(f"Loss: {running_loss/len(dataloader):.4f}")
        
    print('Finished Training')
    os.makedirs("../models", exist_ok=True)
    save_path = f"../models/best_{model_name}.pth"
    torch.save(model.state_dict(), save_path)
    print(f"Model saved to {save_path}")

if __name__ == "__main__":
    # Ensure you are running this from the src directory
    print("This script is a template meant to be run directly when data is ready.")
    # train_model(data_dir="../data/train", model_name="resnet50")
