from sqlalchemy import Column, Integer, String, Float
from database import Base

class AppointmentRecord(Base):
    __tablename__ = "appointments"

    AppointmentID = Column(Integer, primary_key=True, index=True)
    PatientId = Column(Float, index=True)
    
    Gender = Column(String(1))
    
    ScheduledDay = Column(String(50)) 
    AppointmentDay = Column(String(50))
    
    Age = Column(Integer)
    Neighbourhood = Column(String(100))
    Scholarship = Column(Integer)
    Hipertension = Column(Integer)
    Diabetes = Column(Integer)
    Alcoholism = Column(Integer)
    Handcap = Column(Integer)
    SMS_received = Column(Integer)
    
    no_show = Column("No-show", String(3))