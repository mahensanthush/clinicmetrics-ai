import pandas as pd
from database import engine

def load_csv_to_oracle():
    csv_file_path = "KaggleV2-May-2016.csv"
    df = pd.read_csv(csv_file_path)
    try:
        df.to_sql("appointments", con=engine, if_exists="append", index=False)
        print("Success")
    except Exception as e:
        print(e)

if __name__ == "__main__":
    load_csv_to_oracle()