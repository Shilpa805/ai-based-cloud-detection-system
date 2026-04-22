from huggingface_hub import HfApi
api = HfApi()
datasets = api.list_datasets(search="cloud detection")
for d in datasets:
    print(d.id)
