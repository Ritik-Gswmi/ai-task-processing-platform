FROM python:3.12-slim

WORKDIR /app

RUN useradd -m -u 10001 appuser

COPY requirements.txt ./

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV PYTHONUNBUFFERED=1

USER appuser

CMD ["python", "worker.py"]
