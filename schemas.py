from pydantic import BaseModel, ConfigDict
from typing import Optional

class AppointmentBase(BaseModel):
    PatientId: float
    AppointmentID: int
    Gender: str
    ScheduledDay: str
    AppointmentDay: str
    Age: int
    Neighbourhood: str
    Scholarship: int
    Hipertension: int
    Diabetes: int
    Alcoholism: int
    Handcap: int
    SMS_received: int

class AppointmentCreate(AppointmentBase):
    pass

class Appointment(AppointmentBase):
    id: int
    No_show: Optional[str] = None
    
    model_config = ConfigDict(from_attributes=True)

class PredictionRequest(BaseModel):
    Gender: str
    Age: int
    Neighbourhood: str
    Scholarship: int
    Hipertension: int
    Diabetes: int
    Alcoholism: int
    Handcap: int
    SMS_received: int
    DaysWaiting: int